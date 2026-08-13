import { Interface } from 'node:readline/promises';

import { AutorController } from '../controllers/autor.controller';
import { LivroController } from '../controllers/livro.controller';
import { UsuarioAutenticado } from '../infra/repositories/usuario.repository';

export class MainMenu {
  constructor(
    private readonly terminal: Interface,
    private readonly autorController: AutorController,
    private readonly livroController: LivroController,
  ) {}

  async execute(usuario: UsuarioAutenticado): Promise<void> {
    let running = true;

    while (running) {
      this.show(usuario);

      const option = (
        await this.terminal.question('Escolha uma opção: ')
      ).trim();

      switch (option) {
        case '1':
          await this.autorController.execute();
          break;

        case '2':
          await this.livroController.execute();
          break;

        case '3':
          this.showPendingModule('Clientes');
          break;

        case '4':
          this.showPendingModule('Empréstimos');
          break;

        case '5':
          this.showPendingModule('Relatórios');
          break;

        case '0':
          running = false;
          break;

        default:
          console.log('\nOpção inválida.\n');
      }
    }

    console.log('\nAplicação encerrada.');
  }

  private show(usuario: UsuarioAutenticado): void {
    console.log('\n==========================================');
    console.log('              MENU PRINCIPAL');
    console.log('==========================================');
    console.log(`Usuário: ${usuario.login}`);
    console.log(`Perfil: ${usuario.perfilNome}`);
    console.log('');
    console.log('1 - Autores');
    console.log('2 - Livros');
    console.log('3 - Clientes');
    console.log('4 - Empréstimos');
    console.log('5 - Relatórios');
    console.log('0 - Encerrar');
    console.log('');
  }

  private showPendingModule(moduleName: string): void {
    console.log(
      `\nMódulo "${moduleName}" será implementado nas próximas features.\n`,
    );
  }
}
