/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import type { Pool, PoolClient } from 'pg';

import type { Emprestimo, EmprestimoCreate } from '../../../models/emprestimo';
import type { Livro } from '../../../models/livro';
import type { EmprestimoRepository } from '../emprestimo.repository';

interface EmprestimoRow {
  id: number;
  cliente_id: number;
  usuario_id: number;
  data_emprestimo: Date;
  data_devolucao: Date | null;
}

interface LivroDisponibilidadeRow {
  id: number;
  quantidade_disponivel: number;
}

interface EmprestimoDevolucaoRow {
  id: number;
  data_devolucao: Date | null;
}

interface EmprestimoLivroRow {
  livro_id: number;
}

export class EmprestimoPostgresRepository implements EmprestimoRepository {
  constructor(private readonly database: Pool) {}

  async create(data: EmprestimoCreate): Promise<Emprestimo> {
    const client = await this.database.connect();

    try {
      await client.query('BEGIN');

      const emprestimoId = await this.insertEmprestimo(client, data);

      for (const livroId of data.livro_ids) {
        await this.reserveBook(client, emprestimoId, livroId);
      }

      await client.query('COMMIT');

      const emprestimo = await this.findById(emprestimoId);

      if (!emprestimo) {
        throw new Error(
          'Empréstimo registrado, mas não foi possível consultá-lo.',
        );
      }

      return emprestimo;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Emprestimo[]> {
    const result = await this.database.query<EmprestimoRow>(
      `
      SELECT id
      FROM emprestimo
      ORDER BY data_emprestimo DESC, id DESC;
    `,
    );

    const emprestimos = await Promise.all(
      result.rows.map(({ id }) => this.findById(id)),
    );

    return emprestimos.filter(
      (emprestimo): emprestimo is Emprestimo => emprestimo !== null,
    );
  }

  async findById(id: number): Promise<Emprestimo | null> {
    const emprestimoResult = await this.database.query<EmprestimoRow>(
      `
        SELECT
          id,
          cliente_id,
          usuario_id,
          data_emprestimo,
          data_devolucao
        FROM emprestimo
        WHERE id = $1
        LIMIT 1;
      `,
      [id],
    );

    const row = emprestimoResult.rows[0];

    if (!row) {
      return null;
    }

    const livrosResult = await this.database.query<Livro>(
      `
        SELECT
          l.id,
          l.titulo,
          l.editora,
          l.ano_publicacao,
          l.quantidade_total,
          l.quantidade_disponivel,
          COALESCE(
            json_agg(
              json_build_object(
                'id',
                a.id,
                'nome',
                a.nome
              )
              ORDER BY a.nome
            ) FILTER (
              WHERE a.id IS NOT NULL
            ),
            '[]'
          ) AS autores
        FROM emprestimo_livro AS el
        INNER JOIN livro AS l
          ON l.id = el.livro_id
        LEFT JOIN livro_autor AS la
          ON la.livro_id = l.id
        LEFT JOIN autor AS a
          ON a.id = la.autor_id
        WHERE el.emprestimo_id = $1
        GROUP BY
          l.id,
          l.titulo,
          l.editora,
          l.ano_publicacao,
          l.quantidade_total,
          l.quantidade_disponivel
        ORDER BY l.titulo ASC;
      `,
      [id],
    );

    return {
      id: row.id,
      cliente_id: row.cliente_id,
      usuario_id: row.usuario_id,
      data_emprestimo: row.data_emprestimo,
      data_devolucao: row.data_devolucao,
      livros: livrosResult.rows,
    };
  }

  async findActive(): Promise<Emprestimo[]> {
    const result = await this.database.query<EmprestimoRow>(
      `
      SELECT id
      FROM emprestimo
      WHERE data_devolucao IS NULL
      ORDER BY data_emprestimo DESC, id DESC;
    `,
    );

    const emprestimos = await Promise.all(
      result.rows.map(({ id }) => this.findById(id)),
    );

    return emprestimos.filter(
      (emprestimo): emprestimo is Emprestimo => emprestimo !== null,
    );
  }

  async returnLoan(id: number): Promise<Emprestimo | null> {
    const client = await this.database.connect();

    try {
      await client.query('BEGIN');

      const emprestimoResult = await client.query<EmprestimoDevolucaoRow>(
        `
            SELECT
              id,
              data_devolucao
            FROM emprestimo
            WHERE id = $1
            FOR UPDATE;
          `,
        [id],
      );

      const emprestimo = emprestimoResult.rows[0];

      if (!emprestimo) {
        await client.query('ROLLBACK');
        return null;
      }

      if (emprestimo.data_devolucao) {
        throw new Error(`O empréstimo com ID ${id} já foi devolvido.`);
      }

      const livrosResult = await client.query<EmprestimoLivroRow>(
        `
          SELECT livro_id
          FROM emprestimo_livro
          WHERE emprestimo_id = $1
          ORDER BY livro_id
          FOR UPDATE;
        `,
        [id],
      );

      if (livrosResult.rows.length === 0) {
        throw new Error(
          `O empréstimo com ID ${id} não possui livros vinculados.`,
        );
      }

      await client.query(
        `
          UPDATE emprestimo
          SET data_devolucao = CURRENT_TIMESTAMP
          WHERE id = $1;
        `,
        [id],
      );

      for (const { livro_id: livroId } of livrosResult.rows) {
        const updateResult = await client.query(
          `
            UPDATE livro
            SET quantidade_disponivel =
              quantidade_disponivel + 1
            WHERE id = $1
              AND quantidade_disponivel < quantidade_total;
          `,
          [livroId],
        );

        if ((updateResult.rowCount ?? 0) !== 1) {
          throw new Error(
            `Não foi possível devolver o livro com ID ${livroId}.`,
          );
        }
      }

      await client.query('COMMIT');

      return this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async insertEmprestimo(
    client: PoolClient,
    data: EmprestimoCreate,
  ): Promise<number> {
    const result = await client.query<{ id: number }>(
      `
        INSERT INTO emprestimo (
          cliente_id,
          usuario_id
        )
        VALUES ($1, $2)
        RETURNING id;
      `,
      [data.cliente_id, data.usuario_id],
    );

    const emprestimo = result.rows[0];

    if (!emprestimo) {
      throw new Error('Não foi possível registrar o empréstimo.');
    }

    return emprestimo.id;
  }

  private async reserveBook(
    client: PoolClient,
    emprestimoId: number,
    livroId: number,
  ): Promise<void> {
    const livroResult = await client.query<LivroDisponibilidadeRow>(
      `
        SELECT
          id,
          quantidade_disponivel
        FROM livro
        WHERE id = $1
        FOR UPDATE;
      `,
      [livroId],
    );

    const livro = livroResult.rows[0];

    if (!livro) {
      throw new Error(`Livro com ID ${livroId} não encontrado.`);
    }

    if (livro.quantidade_disponivel <= 0) {
      throw new Error(
        `O livro com ID ${livroId} não possui exemplares disponíveis.`,
      );
    }

    await client.query(
      `
        INSERT INTO emprestimo_livro (
          emprestimo_id,
          livro_id
        )
        VALUES ($1, $2);
      `,
      [emprestimoId, livroId],
    );

    const updateResult = await client.query(
      `
        UPDATE livro
        SET quantidade_disponivel =
          quantidade_disponivel - 1
        WHERE id = $1
          AND quantidade_disponivel > 0;
      `,
      [livroId],
    );

    if ((updateResult.rowCount ?? 0) !== 1) {
      throw new Error(`Não foi possível reservar o livro com ID ${livroId}.`);
    }
  }
}
