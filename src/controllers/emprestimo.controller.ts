/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Interface } from 'node:readline/promises';

import type { UsuarioAutenticado } from '../infra/repositories/usuario.repository';
import type { Emprestimo } from '../models/emprestimo';
import { EmprestimoService } from '../services/emprestimo.service';

export class EmprestimoController {
  constructor(
    private readonly terminal: Interface,
    private readonly service: EmprestimoService,
  ) {}

  async execute(usuario: UsuarioAutenticado): Promise<void> {
    let running = true;

    while (running) {
      this.showMenu();

      const option = (
        await this.terminal.question('Escolha uma opção: ')
      ).trim();

      switch (option) {
        case '1':
          await this.create(usuario);
          break;

        case '2':
          await this.findAll();
          break;

        case '3':
          await this.findById();
          break;

        case '4':
          await this.findActive();
          break;

        case '5':
          await this.returnLoan();
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
    console.log('           MENU DE EMPRÉSTIMOS');
    console.log('==========================================');
    console.log('1 - Registrar empréstimo');
    console.log('2 - Listar empréstimos');
    console.log('3 - Consultar empréstimo por ID');
    console.log('4 - Listar empréstimos ativos');
    console.log('5 - Registrar devolução');
    console.log('0 - Voltar');
    console.log('');
  }

  private async create(usuario: UsuarioAutenticado): Promise<void> {
    try {
      console.log('\n--- Registro de Empréstimo ---');

      const clienteId = await this.readId('ID do cliente: ');

      const livroIds = await this.readBookIds();

      const emprestimo = await this.service.create({
        cliente_id: clienteId,
        usuario_id: usuario.id,
        livro_ids: livroIds,
      });

      console.log('\nEmpréstimo registrado com sucesso.');
      this.showEmprestimo(emprestimo);
    } catch (error) {
      this.showError(error);
    }
  }

  private async findAll(): Promise<void> {
    try {
      const emprestimos = await this.service.findAll();

      if (emprestimos.length === 0) {
        console.log('\nNenhum empréstimo registrado.\n');
        return;
      }

      console.log('\n==========================================');
      console.log('          EMPRÉSTIMOS REGISTRADOS');
      console.log('==========================================');

      for (const emprestimo of emprestimos) {
        this.showEmprestimo(emprestimo);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async findById(): Promise<void> {
    try {
      const id = await this.readId('ID do empréstimo: ');

      const emprestimo = await this.service.findById(id);

      console.log('\nEmpréstimo encontrado:');
      this.showEmprestimo(emprestimo);
    } catch (error) {
      this.showError(error);
    }
  }

  private async findActive(): Promise<void> {
    try {
      const emprestimos = await this.service.findActive();

      if (emprestimos.length === 0) {
        console.log('\nNenhum empréstimo ativo encontrado.\n');
        return;
      }

      console.log('\n==========================================');
      console.log('            EMPRÉSTIMOS ATIVOS');
      console.log('==========================================');

      for (const emprestimo of emprestimos) {
        this.showEmprestimo(emprestimo);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async returnLoan(): Promise<void> {
    try {
      const id = await this.readId('ID do empréstimo: ');

      const emprestimoAtual = await this.service.findById(id);

      console.log('\nEmpréstimo selecionado:');
      this.showEmprestimo(emprestimoAtual);

      if (emprestimoAtual.data_devolucao) {
        console.log('\nEste empréstimo já foi devolvido.\n');
        return;
      }

      const confirmation = (
        await this.terminal.question(
          'Confirma a devolução deste empréstimo? (s/n): ',
        )
      )
        .trim()
        .toLowerCase();

      if (confirmation !== 's') {
        console.log('\nDevolução cancelada.\n');
        return;
      }

      const emprestimo = await this.service.returnLoan(id);

      console.log('\nDevolução registrada com sucesso.');
      this.showEmprestimo(emprestimo);
    } catch (error) {
      this.showError(error);
    }
  }

  private async readId(message: string): Promise<number> {
    const value = await this.terminal.question(message);

    return Number(value.trim());
  }

  private async readBookIds(): Promise<number[]> {
    const value = await this.terminal.question(
      'IDs dos livros separados por vírgula (ex: 1,2,3): ',
    );

    if (!value.trim()) {
      return [];
    }

    return value.split(',').map((item) => Number(item.trim()));
  }

  private showEmprestimo(emprestimo: Emprestimo): void {
    const status = emprestimo.data_devolucao ? 'Devolvido' : 'Ativo';

    console.log('------------------------------------------');
    console.log(`ID: ${emprestimo.id}`);
    console.log(`Cliente ID: ${emprestimo.cliente_id}`);
    console.log(`Funcionário ID: ${emprestimo.usuario_id}`);
    console.log(
      `Data do empréstimo: ${this.formatDate(emprestimo.data_emprestimo)}`,
    );
    console.log(`Status: ${status}`);

    if (emprestimo.data_devolucao) {
      console.log(
        `Data da devolução: ${this.formatDate(emprestimo.data_devolucao)}`,
      );
    }

    console.log('Livros:');

    for (const livro of emprestimo.livros) {
      console.log(`  - ${livro.titulo} (ID: ${livro.id})`);
    }

    console.log('------------------------------------------\n');
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
