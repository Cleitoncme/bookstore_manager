import { Interface } from 'node:readline/promises';

import { AutorService } from '../services/autor.service';

export class AutorController {
  constructor(
    private readonly terminal: Interface,
    private readonly service: AutorService,
  ) {}

  async execute(): Promise<void> {
    let running = true;

    while (running) {
      this.showMenu();

      const option = (
        await this.terminal.question('Escolha uma opção: ')
      ).trim();

      switch (option) {
        case '1':
          await this.create();
          break;

        case '2':
          await this.findAll();
          break;

        case '3':
          await this.findById();
          break;

        case '4':
          await this.update();
          break;

        case '5':
          await this.delete();
          break;

        case '0':
          running = false;
          break;

        default:
          console.log('\nOpção inválida.\n');
      }
    }
  }

  private showMenu(): void {
    console.log('\n==========================================');
    console.log('             MENU DE AUTORES');
    console.log('==========================================');
    console.log('1 - Cadastrar autor');
    console.log('2 - Listar autores');
    console.log('3 - Consultar autor por ID');
    console.log('4 - Atualizar autor');
    console.log('5 - Remover autor');
    console.log('0 - Voltar');
    console.log('');
  }

  private async create(): Promise<void> {
    try {
      const nome = await this.terminal.question('Nome do autor: ');

      const autor = await this.service.create(nome);

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`\nAutor cadastrado com sucesso. ID: ${autor.id}\n`);
    } catch (error) {
      this.showError(error);
    }
  }

  private async findAll(): Promise<void> {
    try {
      const autores = await this.service.findAll();

      if (autores.length === 0) {
        console.log('\nNenhum autor cadastrado.\n');
        return;
      }

      console.log('\nAutores cadastrados:');

      for (const autor of autores) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`${autor.id} - ${autor.nome}`);
      }

      console.log('');
    } catch (error) {
      this.showError(error);
    }
  }

  private async findById(): Promise<void> {
    try {
      const id = await this.readId();
      const autor = await this.service.findById(id);

      console.log('\nAutor encontrado:');
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`ID: ${autor.id}`);
      console.log(`Nome: ${autor.nome}\n`);
    } catch (error) {
      this.showError(error);
    }
  }

  private async update(): Promise<void> {
    try {
      const id = await this.readId();
      const autor = await this.service.findById(id);

      console.log(`\nAutor atual: ${autor.nome}`);

      const nome = await this.terminal.question('Novo nome: ');

      const updatedAutor = await this.service.update(id, nome);

      console.log(`\nAutor atualizado com sucesso: ${updatedAutor.nome}\n`);
    } catch (error) {
      this.showError(error);
    }
  }

  private async delete(): Promise<void> {
    try {
      const id = await this.readId();
      const autor = await this.service.findById(id);

      const confirmation = (
        await this.terminal.question(
          `Confirma a remoção de "${autor.nome}"? (s/n): `,
        )
      )
        .trim()
        .toLowerCase();

      if (confirmation !== 's') {
        console.log('\nRemoção cancelada.\n');
        return;
      }

      await this.service.delete(id);

      console.log('\nAutor removido com sucesso.\n');
    } catch (error) {
      this.showError(error);
    }
  }

  private async readId(): Promise<number> {
    const value = await this.terminal.question('ID do autor: ');

    return Number(value.trim());
  }

  private showError(error: unknown): void {
    const message =
      error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';

    console.error(`\n${message}\n`);
  }
}
