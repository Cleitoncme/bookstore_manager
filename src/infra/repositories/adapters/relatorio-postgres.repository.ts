import type { Pool } from 'pg';

import type {
  ClienteEmprestimoAtivoRelatorio,
  LivroDisponivelRelatorio,
  LivroEmprestadoRelatorio,
  LivroPorAutorRelatorio,
  QuantidadeEmprestimosPorLivroRelatorio,
} from '../../../models/relatorio';
import type { RelatorioRepository } from '../relatorio.repository';

export class RelatorioPostgresRepository implements RelatorioRepository {
  constructor(private readonly database: Pool) {}

  async findAvailableBooks(): Promise<LivroDisponivelRelatorio[]> {
    const result = await this.database.query<LivroDisponivelRelatorio>(
      `
        SELECT
          l.id,
          l.titulo,
          l.quantidade_total,
          l.quantidade_disponivel
        FROM livro AS l
        WHERE l.quantidade_disponivel > 0
        ORDER BY l.titulo ASC;
      `,
    );

    return result.rows;
  }

  async findBorrowedBooks(): Promise<LivroEmprestadoRelatorio[]> {
    const result = await this.database.query<LivroEmprestadoRelatorio>(
      `
        SELECT
          e.id AS emprestimo_id,
          l.id AS livro_id,
          l.titulo,
          c.id AS cliente_id,
          c.nome AS cliente_nome,
          e.data_emprestimo
        FROM emprestimo AS e
        INNER JOIN cliente AS c
          ON c.id = e.cliente_id
        INNER JOIN emprestimo_livro AS el
          ON el.emprestimo_id = e.id
        INNER JOIN livro AS l
          ON l.id = el.livro_id
        WHERE e.data_devolucao IS NULL
        ORDER BY
          e.data_emprestimo ASC,
          l.titulo ASC;
      `,
    );

    return result.rows;
  }

  async findBooksByAuthor(): Promise<LivroPorAutorRelatorio[]> {
    const result = await this.database.query<LivroPorAutorRelatorio>(
      `
        SELECT
          a.id AS autor_id,
          a.nome AS autor_nome,
          l.id AS livro_id,
          l.titulo AS livro_titulo
        FROM autor AS a
        INNER JOIN livro_autor AS la
          ON la.autor_id = a.id
        INNER JOIN livro AS l
          ON l.id = la.livro_id
        ORDER BY
          a.nome ASC,
          l.titulo ASC;
      `,
    );

    return result.rows;
  }

  async findLoanCountByBook(): Promise<
    QuantidadeEmprestimosPorLivroRelatorio[]
  > {
    const result =
      await this.database.query<QuantidadeEmprestimosPorLivroRelatorio>(
        `
          SELECT
            l.id AS livro_id,
            l.titulo AS livro_titulo,
            COUNT(el.emprestimo_id)::INTEGER
              AS quantidade_emprestimos
          FROM livro AS l
          LEFT JOIN emprestimo_livro AS el
            ON el.livro_id = l.id
          GROUP BY
            l.id,
            l.titulo
          ORDER BY
            quantidade_emprestimos DESC,
            l.titulo ASC;
        `,
      );

    return result.rows;
  }

  async findClientsWithActiveLoans(): Promise<
    ClienteEmprestimoAtivoRelatorio[]
  > {
    const result = await this.database.query<ClienteEmprestimoAtivoRelatorio>(
      `
        SELECT
          c.id AS cliente_id,
          c.nome AS cliente_nome,
          COUNT(DISTINCT e.id)::INTEGER
            AS quantidade_emprestimos_ativos,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', l.id,
                'titulo', l.titulo
              )
            ) FILTER (
              WHERE l.id IS NOT NULL
            ),
            '[]'
          ) AS livros_emprestados
        FROM cliente AS c
        INNER JOIN emprestimo AS e
          ON e.cliente_id = c.id
        INNER JOIN emprestimo_livro AS el
          ON el.emprestimo_id = e.id
        INNER JOIN livro AS l
          ON l.id = el.livro_id
        WHERE e.data_devolucao IS NULL
        GROUP BY
          c.id,
          c.nome
        ORDER BY
          quantidade_emprestimos_ativos DESC,
          c.nome ASC;
      `,
    );

    return result.rows;
  }
}
