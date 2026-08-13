/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Pool } from 'pg';

import { Cliente, ClienteCreate, ClienteUpdate } from '../../../models/cliente';
import { ClienteRepository } from '../cliente.repository';

interface ClienteRow {
  id: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
}

export class ClientePostgresRepository implements ClienteRepository {
  constructor(private readonly database: Pool) {}

  async create(data: ClienteCreate): Promise<Cliente> {
    const query = `
      INSERT INTO cliente (
        nome,
        cpf,
        telefone,
        email
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        nome,
        cpf,
        telefone,
        email;
    `;

    const result = await this.database.query<ClienteRow>(query, [
      data.nome,
      data.cpf,
      data.telefone ?? null,
      data.email ?? null,
    ]);

    const cliente = result.rows[0];

    if (!cliente) {
      throw new Error('Não foi possível cadastrar o cliente.');
    }

    return {
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone ?? undefined,
      email: cliente.email ?? undefined,
    };
  }

  async findAll(): Promise<Cliente[]> {
    const query = `
      SELECT
        id,
        nome,
        cpf,
        telefone,
        email
      FROM cliente
      ORDER BY nome ASC;
    `;

    const result = await this.database.query<ClienteRow>(query);

    return result.rows.map((cliente) => ({
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone ?? undefined,
      email: cliente.email ?? undefined,
    }));
  }

  async findById(id: number): Promise<Cliente | null> {
    const query = `
      SELECT
        id,
        nome,
        cpf,
        telefone,
        email
      FROM cliente
      WHERE id = $1
      LIMIT 1;
    `;

    const result = await this.database.query<ClienteRow>(query, [id]);

    const cliente = result.rows[0];

    if (!cliente) {
      return null;
    }

    return {
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone ?? undefined,
      email: cliente.email ?? undefined,
    };
  }

  async findByCpf(cpf: string): Promise<Cliente | null> {
    const query = `
      SELECT
        id,
        nome,
        cpf,
        telefone,
        email
      FROM cliente
      WHERE cpf = $1
      LIMIT 1;
    `;

    const result = await this.database.query<ClienteRow>(query, [cpf]);

    const cliente = result.rows[0];

    if (!cliente) {
      return null;
    }

    return {
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone ?? undefined,
      email: cliente.email ?? undefined,
    };
  }

  async update(data: ClienteUpdate): Promise<Cliente | null> {
    const query = `
      UPDATE cliente
      SET
        nome = $1,
        cpf = $2,
        telefone = $3,
        email = $4
      WHERE id = $5
      RETURNING
        id,
        nome,
        cpf,
        telefone,
        email;
    `;

    const result = await this.database.query<ClienteRow>(query, [
      data.nome,
      data.cpf,
      data.telefone ?? null,
      data.email ?? null,
      data.id,
    ]);

    const cliente = result.rows[0];

    if (!cliente) {
      return null;
    }

    return {
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone ?? undefined,
      email: cliente.email ?? undefined,
    };
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.database.query(
      `
        DELETE FROM cliente
        WHERE id = $1;
      `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }

  async hasLoans(id: number): Promise<boolean> {
    const result = await this.database.query(
      `
        SELECT 1
        FROM emprestimo
        WHERE cliente_id = $1
        LIMIT 1;
      `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
