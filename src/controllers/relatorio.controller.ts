/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Interface } from 'node:readline/promises';

import type {
  ClienteEmprestimoAtivoRelatorio,
  LivroDisponivelRelatorio,
  LivroEmprestadoRelatorio,
  LivroPorAutorRelatorio,
  QuantidadeEmprestimosPorLivroRelatorio,
} from '../models/relatorio';
import { RelatorioService } from '../services/relatorio.service';

export class RelatorioController {
  constructor(
    private readonly terminal: Interface,
    private readonly service: RelatorioService,
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
          await this.showAvailableBooks();
          break;

        case '2':
          await this.showBorrowedBooks();
          break;

        case '3':
          await this.showBooksByAuthor();
          break;

        case '4':
          await this.showLoanCountByBook();
          break;

        case '5':
          await this.showClientsWithActiveLoans();
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
    console.log('              RELATÓRIOS');
    console.log('==========================================');
    console.log('1 - Livros disponíveis');
    console.log('2 - Livros emprestados');
    console.log('3 - Livros por autor');
    console.log('4 - Quantidade de empréstimos por livro');
    console.log('5 - Clientes com empréstimos ativos');
    console.log('0 - Voltar');
    console.log('');
  }

  private async showAvailableBooks(): Promise<void> {
    try {
      const livros = await this.service.findAvailableBooks();

      if (livros.length === 0) {
        console.log('\nNenhum livro disponível.\n');
        return;
      }

      console.log('\n--- Livros Disponíveis ---');

      for (const livro of livros) {
        this.printAvailableBook(livro);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async showBorrowedBooks(): Promise<void> {
    try {
      const livros = await this.service.findBorrowedBooks();

      if (livros.length === 0) {
        console.log('\nNenhum livro emprestado no momento.\n');
        return;
      }

      console.log('\n--- Livros Emprestados ---');

      for (const livro of livros) {
        this.printBorrowedBook(livro);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async showBooksByAuthor(): Promise<void> {
    try {
      const livros = await this.service.findBooksByAuthor();

      if (livros.length === 0) {
        console.log('\nNenhum livro associado a autores.\n');
        return;
      }

      console.log('\n--- Livros por Autor ---');

      for (const livro of livros) {
        this.printBookByAuthor(livro);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async showLoanCountByBook(): Promise<void> {
    try {
      const livros = await this.service.findLoanCountByBook();

      if (livros.length === 0) {
        console.log('\nNenhum livro cadastrado.\n');
        return;
      }

      console.log('\n--- Quantidade de Empréstimos por Livro ---');

      for (const livro of livros) {
        this.printLoanCountByBook(livro);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async showClientsWithActiveLoans(): Promise<void> {
    try {
      const clientes = await this.service.findClientsWithActiveLoans();

      if (clientes.length === 0) {
        console.log('\nNenhum cliente possui empréstimos ativos.\n');
        return;
      }

      console.log('\n--- Clientes com Empréstimos Ativos ---');

      for (const cliente of clientes) {
        this.printClientWithActiveLoans(cliente);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private printAvailableBook(livro: LivroDisponivelRelatorio): void {
    console.log('------------------------------------------');
    console.log(`ID: ${livro.id}`);
    console.log(`Título: ${livro.titulo}`);
    console.log(`Quantidade total: ${livro.quantidade_total}`);
    console.log(`Quantidade disponível: ${livro.quantidade_disponivel}`);
  }

  private printBorrowedBook(livro: LivroEmprestadoRelatorio): void {
    console.log('------------------------------------------');
    console.log(`Empréstimo ID: ${livro.emprestimo_id}`);
    console.log(`Livro ID: ${livro.livro_id}`);
    console.log(`Título: ${livro.titulo}`);
    console.log(`Cliente: ${livro.cliente_nome} (ID: ${livro.cliente_id})`);
    console.log(
      `Data do empréstimo: ${this.formatDate(livro.data_emprestimo)}`,
    );
  }

  private printBookByAuthor(livro: LivroPorAutorRelatorio): void {
    console.log('------------------------------------------');
    console.log(`Autor: ${livro.autor_nome} (ID: ${livro.autor_id})`);
    console.log(`Livro: ${livro.livro_titulo} (ID: ${livro.livro_id})`);
  }

  private printLoanCountByBook(
    livro: QuantidadeEmprestimosPorLivroRelatorio,
  ): void {
    console.log('------------------------------------------');
    console.log(`Livro: ${livro.livro_titulo} (ID: ${livro.livro_id})`);
    console.log(`Quantidade de empréstimos: ${livro.quantidade_emprestimos}`);
  }

  private printClientWithActiveLoans(
    cliente: ClienteEmprestimoAtivoRelatorio,
  ): void {
    console.log('------------------------------------------');
    console.log(`Cliente: ${cliente.cliente_nome} (ID: ${cliente.cliente_id})`);
    console.log(`Empréstimos ativos: ${cliente.quantidade_emprestimos_ativos}`);
    console.log('Livros emprestados:');

    for (const livro of cliente.livros_emprestados) {
      console.log(`  - ${livro.titulo} (ID: ${livro.id})`);
    }
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  private showError(error: unknown): void {
    const message =
      error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';

    console.error(`\n${message}\n`);
  }
}
