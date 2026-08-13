import { Interface } from 'node:readline/promises';

import { Livro, LivroCreate, LivroUpdate } from '../models/livro';
import { LivroService } from '../services/livro.service';

export class LivroController {
  constructor(
    private readonly terminal: Interface,
    private readonly service: LivroService,
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
    console.log('              MENU DE LIVROS');
    console.log('==========================================');
    console.log('1 - Cadastrar livro');
    console.log('2 - Listar livros');
    console.log('3 - Consultar livro por ID');
    console.log('4 - Atualizar livro');
    console.log('5 - Remover livro');
    console.log('0 - Voltar');
    console.log('');
  }

  private async create(): Promise<void> {
    try {
      console.log('\n--- Cadastro de Livro ---');

      const titulo = await this.terminal.question('Título: ');
      const editora = await this.terminal.question('Editora: ');

      const anoPublicacao = await this.readNumber('Ano de publicação: ');

      const quantidadeTotal = await this.readNumber('Quantidade total: ');

      const autorIds = await this.readAuthorIds();

      const data: LivroCreate = {
        titulo,
        editora,
        ano_publicacao: anoPublicacao,
        quantidade_total: quantidadeTotal,
        autor_ids: autorIds,
      };

      const livro = await this.service.create(data);

      console.log('\nLivro cadastrado com sucesso.');
      this.showLivro(livro);
    } catch (error) {
      this.showError(error);
    }
  }

  private async findAll(): Promise<void> {
    try {
      const livros = await this.service.findAll();

      if (livros.length === 0) {
        console.log('\nNenhum livro cadastrado.\n');
        return;
      }

      console.log('\n==========================================');
      console.log('            LIVROS CADASTRADOS');
      console.log('==========================================');

      for (const livro of livros) {
        this.showLivro(livro);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async findById(): Promise<void> {
    try {
      const id = await this.readNumber('ID do livro: ');

      const livro = await this.service.findById(id);

      console.log('\nLivro encontrado:');
      this.showLivro(livro);
    } catch (error) {
      this.showError(error);
    }
  }

  private async update(): Promise<void> {
    try {
      const id = await this.readNumber('ID do livro: ');

      const livroAtual = await this.service.findById(id);

      console.log('\nDados atuais:');
      this.showLivro(livroAtual);

      console.log('Pressione Enter para manter o valor atual.\n');

      const tituloInput = await this.terminal.question(
        `Título [${livroAtual.titulo}]: `,
      );

      const editoraInput = await this.terminal.question(
        `Editora [${livroAtual.editora}]: `,
      );

      const anoInput = await this.terminal.question(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Ano de publicação [${livroAtual.ano_publicacao}]: `,
      );

      const quantidadeInput = await this.terminal.question(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Quantidade total [${livroAtual.quantidade_total}]: `,
      );

      const autoresAtuais = livroAtual.autores
        .map((autor) => autor.id)
        .join(', ');

      const autoresInput = await this.terminal.question(
        `IDs dos autores [${autoresAtuais}]: `,
      );

      const data: LivroUpdate = {
        id,
        titulo: tituloInput.trim() || livroAtual.titulo,
        editora: editoraInput.trim() || livroAtual.editora,
        ano_publicacao: this.parseOptionalNumber(
          anoInput,
          livroAtual.ano_publicacao,
        ),
        quantidade_total: this.parseOptionalNumber(
          quantidadeInput,
          livroAtual.quantidade_total,
        ),
        autor_ids:
          autoresInput.trim().length > 0
            ? this.parseAuthorIds(autoresInput)
            : livroAtual.autores.map((autor) => autor.id),
      };

      const livro = await this.service.update(data);

      console.log('\nLivro atualizado com sucesso.');
      this.showLivro(livro);
    } catch (error) {
      this.showError(error);
    }
  }

  private async delete(): Promise<void> {
    try {
      const id = await this.readNumber('ID do livro: ');

      const livro = await this.service.findById(id);

      console.log('\nLivro selecionado:');
      this.showLivro(livro);

      const confirmation = (
        await this.terminal.question(
          `Confirma a remoção de "${livro.titulo}"? (s/n): `,
        )
      )
        .trim()
        .toLowerCase();

      if (confirmation !== 's') {
        console.log('\nRemoção cancelada.\n');
        return;
      }

      await this.service.delete(id);

      console.log('\nLivro removido com sucesso.\n');
    } catch (error) {
      this.showError(error);
    }
  }

  private async readNumber(message: string): Promise<number> {
    const value = await this.terminal.question(message);

    return Number(value.trim());
  }

  private async readAuthorIds(): Promise<number[]> {
    const value = await this.terminal.question(
      'IDs dos autores separados por vírgula (ex: 1,2): ',
    );

    return this.parseAuthorIds(value);
  }

  private parseAuthorIds(value: string): number[] {
    if (!value.trim()) {
      return [];
    }

    return value.split(',').map((item) => Number(item.trim()));
  }

  private parseOptionalNumber(value: string, currentValue: number): number {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return currentValue;
    }

    return Number(normalizedValue);
  }

  private showLivro(livro: Livro): void {
    const autores =
      livro.autores.length > 0
        ? livro.autores
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            .map((autor) => `${autor.nome} (ID: ${autor.id})`)
            .join(', ')
        : 'Nenhum autor';

    console.log('------------------------------------------');
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`ID: ${livro.id}`);
    console.log(`Título: ${livro.titulo}`);
    console.log(`Editora: ${livro.editora}`);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Ano de publicação: ${livro.ano_publicacao}`);
    console.log(`Autores: ${autores}`);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Quantidade total: ${livro.quantidade_total}`);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Quantidade disponível: ${livro.quantidade_disponivel}`);
    console.log('------------------------------------------\n');
  }

  private showError(error: unknown): void {
    const message =
      error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';

    console.error(`\n${message}\n`);
  }
}
