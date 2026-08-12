import { Pool } from 'pg';
import { UsuarioAutenticado, UsuarioRepository } from '../usuario.repository';

interface UsuarioRow {
  id: number;
  login: string;
  perfil_id: number;
  perfil_nome: string;
  data_cadastro: Date;
}

export class UsuarioPostgresRepository implements UsuarioRepository {
  constructor(private readonly database: Pool) {}

  async authenticate(
    login: string,
    senha: string,
  ): Promise<UsuarioAutenticado | null> {
    const query = `
      SELECT
        u.id,
        u.login,
        u.perfil_id,
        u.data_cadastro,
        p.nome AS perfil_nome
      FROM usuario AS u
      INNER JOIN perfil AS p
        ON p.id = u.perfil_id
      WHERE u.login = $1
        AND u.senha = crypt($2, u.senha)
      LIMIT 1;
    `;

    const result = await this.database.query<UsuarioRow>(query, [login, senha]);

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      login: row.login,
      perfilId: row.perfil_id,
      perfilNome: row.perfil_nome,
      dataCadastro: row.data_cadastro,
    };
  }
}
