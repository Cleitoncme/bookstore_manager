import {
  UsuarioAutenticado,
  UsuarioRepository,
} from '../infra/repositories/usuario.repository';

export class LoginService {
  constructor(private readonly repository: UsuarioRepository) {}

  async authenticate(
    login: string,
    senha: string,
  ): Promise<UsuarioAutenticado> {
    const normalizedLogin = login.trim();

    if (!normalizedLogin || !senha) {
      throw new Error('Login e senha são obrigatórios.');
    }

    const usuario = await this.repository.authenticate(normalizedLogin, senha);

    if (!usuario) {
      throw new Error('Usuário ou senha inválidos.');
    }

    return usuario;
  }
}
