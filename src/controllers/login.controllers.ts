import { createInterface, Interface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { UsuarioAutenticado } from '../infra/repositories/usuario.repository';
import { LoginService } from '../services/login.services';

export class LoginController {
  private readonly terminal: Interface;

  constructor(private readonly loginService: LoginService) {
    this.terminal = createInterface({ input, output });
  }

  async execute(): Promise<UsuarioAutenticado> {
    console.log('==========================================');
    console.log('          BookStore Manager CLI');
    console.log('==========================================');
    console.log('Login de funcionário\n');

    while (true) {
      const login = await this.terminal.question('Login: ');
      const senha = await this.terminal.question('Senha: ');

      try {
        const usuario = await this.loginService.authenticate(login, senha);

        console.log(
          `\nLogin realizado com sucesso. Bem-vindo, ${usuario.login}!`,
        );
        console.log(`Perfil: ${usuario.perfilNome}\n`);

        return usuario;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Erro inesperado durante o login.';

        console.error(`\n${message}\n`);
      }
    }
  }

  close(): void {
    this.terminal.close();
  }
}
