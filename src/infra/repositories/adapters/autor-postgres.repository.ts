import { Pool } from 'pg';

import { Autor, AutorCreate } from '../../../models/autor';
import { AutorRepository } from '../autor.repository';

interface AutorRow {
  id: number;
  nome: string;
}

export class AutorPostgresRepository implements AutorRepository {
  constructor(private readonly database: Pool) {}

  async create(data: AutorCreate): Promise<Autor> {
    const query = `
      INSERT INTO autor (nome)
      VALUES ($1)
      RETURNING id, nome;
    `;

    const result = await this.database.query<AutorRow>(query, [data.nome]);

    const autor = result.rows[0];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!autor) {
      throw new Error('Não foi possível cadastrar o autor.');
    }

    return autor;
  }

  async findAll(): Promise<Autor[]> {
    const query = `
      SELECT id, nome
      FROM autor
      ORDER BY nome ASC;
    `;

    const result = await this.database.query<AutorRow>(query);

    return result.rows;
  }

  async findById(id: number): Promise<Autor | null> {
    const query = `
      SELECT id, nome
      FROM autor
      WHERE id = $1
      LIMIT 1;
    `;

    const result = await this.database.query<AutorRow>(query, [id]);

    return result.rows[0] ?? null;
  }

  async update(id: number, nome: string): Promise<Autor | null> {
    const query = `
      UPDATE autor
      SET nome = $1
      WHERE id = $2
      RETURNING id, nome;
    `;

    const result = await this.database.query<AutorRow>(query, [nome, id]);

    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM autor
      WHERE id = $1;
    `;

    const result = await this.database.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }

  async hasBooks(id: number): Promise<boolean> {
    const query = `
      SELECT 1
      FROM livro_autor
      WHERE autor_id = $1
      LIMIT 1;
    `;

    const result = await this.database.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }
}
