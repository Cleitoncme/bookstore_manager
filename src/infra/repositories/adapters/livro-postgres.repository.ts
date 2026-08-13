import { Pool, PoolClient } from 'pg';

import { Livro, LivroCreate, LivroUpdate } from '../../../models/livro';
import { LivroRepository } from '../livro.repository';

interface LivroRow {
  id: number;
  titulo: string;
  editora: string;
  ano_publicacao: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  autores: {
    id: number;
    nome: string;
  }[];
}

export class LivroPostgresRepository implements LivroRepository {
  constructor(private readonly database: Pool) {}

  async create(data: LivroCreate): Promise<Livro> {
    const client = await this.database.connect();

    try {
      await client.query('BEGIN');

      const livro = await this.insertLivro(client, data);

      await this.insertAutores(client, livro.id, data.autor_ids);

      await client.query('COMMIT');

      const createdLivro = await this.findById(livro.id);

      if (!createdLivro) {
        throw new Error('Livro criado, mas não foi possível consultá-lo.');
      }

      return createdLivro;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Livro[]> {
    const query = `
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
              'id', a.id,
              'nome', a.nome
            )
            ORDER BY a.nome
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS autores
      FROM livro AS l
      LEFT JOIN livro_autor AS la
        ON la.livro_id = l.id
      LEFT JOIN autor AS a
        ON a.id = la.autor_id
      GROUP BY
        l.id,
        l.titulo,
        l.editora,
        l.ano_publicacao,
        l.quantidade_total,
        l.quantidade_disponivel
      ORDER BY l.titulo ASC;
    `;

    const result = await this.database.query<LivroRow>(query);

    return result.rows;
  }

  async findById(id: number): Promise<Livro | null> {
    const query = `
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
              'id', a.id,
              'nome', a.nome
            )
            ORDER BY a.nome
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS autores
      FROM livro AS l
      LEFT JOIN livro_autor AS la
        ON la.livro_id = l.id
      LEFT JOIN autor AS a
        ON a.id = la.autor_id
      WHERE l.id = $1
      GROUP BY
        l.id,
        l.titulo,
        l.editora,
        l.ano_publicacao,
        l.quantidade_total,
        l.quantidade_disponivel
      LIMIT 1;
    `;

    const result = await this.database.query<LivroRow>(query, [id]);

    return result.rows[0] ?? null;
  }

  async update(data: LivroUpdate): Promise<Livro | null> {
    const client = await this.database.connect();

    try {
      await client.query('BEGIN');

      const currentLivro = await this.findLivroForUpdate(client, data.id);

      if (!currentLivro) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Livro com ID ${data.id} não encontrado.`);
      }

      const emprestados =
        currentLivro.quantidade_total - currentLivro.quantidade_disponivel;

      const novaQuantidadeDisponivel = data.quantidade_total - emprestados;

      if (novaQuantidadeDisponivel < 0) {
        throw new Error(
          'A quantidade total não pode ser menor que a quantidade atualmente emprestada.',
        );
      }

      const updateQuery = `
        UPDATE livro
        SET
          titulo = $1,
          editora = $2,
          ano_publicacao = $3,
          quantidade_total = $4,
          quantidade_disponivel = $5
        WHERE id = $6
        RETURNING id;
      `;

      await client.query(updateQuery, [
        data.titulo,
        data.editora,
        data.ano_publicacao,
        data.quantidade_total,
        novaQuantidadeDisponivel,
        data.id,
      ]);

      await client.query(
        `
          DELETE FROM livro_autor
          WHERE livro_id = $1;
        `,
        [data.id],
      );

      await this.insertAutores(client, data.id, data.autor_ids);

      await client.query('COMMIT');

      return await this.findById(data.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<boolean> {
    const client = await this.database.connect();

    try {
      await client.query('BEGIN');

      await client.query(
        `
          DELETE FROM livro_autor
          WHERE livro_id = $1;
        `,
        [id],
      );

      const result = await client.query(
        `
          DELETE FROM livro
          WHERE id = $1;
        `,
        [id],
      );

      await client.query('COMMIT');

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async hasLoans(id: number): Promise<boolean> {
    const result = await this.database.query(
      `
        SELECT 1
        FROM emprestimo_livro
        WHERE livro_id = $1
        LIMIT 1;
      `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }

  private async insertLivro(
    client: PoolClient,
    data: LivroCreate,
  ): Promise<{ id: number }> {
    const query = `
      INSERT INTO livro (
        titulo,
        editora,
        ano_publicacao,
        quantidade_total,
        quantidade_disponivel
      )
      VALUES ($1, $2, $3, $4, $4)
      RETURNING id;
    `;

    const result = await client.query<{ id: number }>(query, [
      data.titulo,
      data.editora,
      data.ano_publicacao,
      data.quantidade_total,
    ]);

    const livro = result.rows[0];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!livro) {
      throw new Error('Não foi possível cadastrar o livro.');
    }

    return livro;
  }

  private async insertAutores(
    client: PoolClient,
    livroId: number,
    autorIds: number[],
  ): Promise<void> {
    for (const autorId of autorIds) {
      await client.query(
        `
          INSERT INTO livro_autor (
            livro_id,
            autor_id
          )
          VALUES ($1, $2);
        `,
        [livroId, autorId],
      );
    }
  }

  private async findLivroForUpdate(
    client: PoolClient,
    id: number,
  ): Promise<{
    quantidade_total: number;
    quantidade_disponivel: number;
  } | null> {
    const result = await client.query<{
      quantidade_total: number;
      quantidade_disponivel: number;
    }>(
      `
        SELECT
          quantidade_total,
          quantidade_disponivel
        FROM livro
        WHERE id = $1
        FOR UPDATE;
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
