import { Interface } from 'node:readline/promises';
import { UsuarioAutenticado } from '../infra/repositories/usuario.repository';
import { LoginService } from '../services/login.service';

export class LoginController {
  constructor(
    private readonly terminal: Interface,
    private readonly loginService: LoginService,
  ) {}

  async execute(): Promise<UsuarioAutenticado> {
    this.showHeader();

    while (true) {
      const login = (await this.terminal.question('Login: ')).trim();

      const senha = await this.terminal.question('Senha: ');

      try {
        const usuario = await this.loginService.authenticate(login, senha);

        console.log(
          `\nLogin realizado com sucesso. Bem-vindo, ${usuario.login}!`,
        );
        console.log(`Perfil: ${usuario.perfilNome}\n`);

        return usuario;
      } catch (error) {
        this.showError(error);
      }
    }
  }

  private showHeader(): void {
    console.log('==========================================');
    console.log('          BOOKSTORE MANAGER CLI');
    console.log('==========================================');
    console.log('Login de funcionário\n');
  }

  private showError(error: unknown): void {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro inesperado durante o login.';

    console.error(`\n${message}\n`);
  }
}
