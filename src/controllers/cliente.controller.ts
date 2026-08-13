/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Interface } from 'node:readline/promises';

import { Cliente, ClienteCreate, ClienteUpdate } from '../models/cliente';
import { ClienteService } from '../services/cliente.service';

export class ClienteController {
  constructor(
    private readonly terminal: Interface,
    private readonly service: ClienteService,
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
    console.log('             MENU DE CLIENTES');
    console.log('==========================================');
    console.log('1 - Cadastrar cliente');
    console.log('2 - Listar clientes');
    console.log('3 - Consultar cliente por ID');
    console.log('4 - Atualizar cliente');
    console.log('5 - Remover cliente');
    console.log('0 - Voltar');
    console.log('');
  }

  private async create(): Promise<void> {
    try {
      console.log('\n--- Cadastro de Cliente ---');

      const nome = await this.terminal.question('Nome: ');
      const cpf = await this.terminal.question('CPF: ');
      const telefone = await this.terminal.question('Telefone (opcional): ');
      const email = await this.terminal.question('E-mail (opcional): ');

      const data: ClienteCreate = {
        nome,
        cpf,
        telefone: telefone.trim() || undefined,
        email: email.trim() || undefined,
      };

      const cliente = await this.service.create(data);

      console.log('\nCliente cadastrado com sucesso.');
      this.showCliente(cliente);
    } catch (error) {
      this.showError(error);
    }
  }

  private async findAll(): Promise<void> {
    try {
      const clientes = await this.service.findAll();

      if (clientes.length === 0) {
        console.log('\nNenhum cliente cadastrado.\n');
        return;
      }

      console.log('\n==========================================');
      console.log('           CLIENTES CADASTRADOS');
      console.log('==========================================');

      for (const cliente of clientes) {
        this.showCliente(cliente);
      }
    } catch (error) {
      this.showError(error);
    }
  }

  private async findById(): Promise<void> {
    try {
      const id = await this.readId();

      const cliente = await this.service.findById(id);

      console.log('\nCliente encontrado:');
      this.showCliente(cliente);
    } catch (error) {
      this.showError(error);
    }
  }

  private async update(): Promise<void> {
    try {
      const id = await this.readId();

      const clienteAtual = await this.service.findById(id);

      console.log('\nDados atuais:');
      this.showCliente(clienteAtual);

      console.log('Pressione Enter para manter o valor atual.\n');

      const nomeInput = await this.terminal.question(
        `Nome [${clienteAtual.nome}]: `,
      );

      const cpfInput = await this.terminal.question(
        `CPF [${clienteAtual.cpf}]: `,
      );

      const telefoneAtual = clienteAtual.telefone ?? 'não informado';

      const telefoneInput = await this.terminal.question(
        `Telefone [${telefoneAtual}]: `,
      );

      const emailAtual = clienteAtual.email ?? 'não informado';

      const emailInput = await this.terminal.question(
        `E-mail [${emailAtual}]: `,
      );

      const data: ClienteUpdate = {
        id,
        nome: nomeInput.trim() || clienteAtual.nome,
        cpf: cpfInput.trim() || clienteAtual.cpf,
        telefone:
          telefoneInput.trim().length > 0
            ? telefoneInput
            : clienteAtual.telefone,
        email: emailInput.trim().length > 0 ? emailInput : clienteAtual.email,
      };

      const cliente = await this.service.update(data);

      console.log('\nCliente atualizado com sucesso.');
      this.showCliente(cliente);
    } catch (error) {
      this.showError(error);
    }
  }

  private async delete(): Promise<void> {
    try {
      const id = await this.readId();

      const cliente = await this.service.findById(id);

      console.log('\nCliente selecionado:');
      this.showCliente(cliente);

      const confirmation = (
        await this.terminal.question(
          `Confirma a remoção de "${cliente.nome}"? (s/n): `,
        )
      )
        .trim()
        .toLowerCase();

      if (confirmation !== 's') {
        console.log('\nRemoção cancelada.\n');
        return;
      }

      await this.service.delete(id);

      console.log('\nCliente removido com sucesso.\n');
    } catch (error) {
      this.showError(error);
    }
  }

  private async readId(): Promise<number> {
    const value = await this.terminal.question('ID do cliente: ');

    return Number(value.trim());
  }

  private showCliente(cliente: Cliente): void {
    console.log('------------------------------------------');
    console.log(`ID: ${cliente.id}`);
    console.log(`Nome: ${cliente.nome}`);
    console.log(`CPF: ${cliente.cpf}`);
    console.log(`Telefone: ${cliente.telefone ?? 'Não informado'}`);
    console.log(`E-mail: ${cliente.email ?? 'Não informado'}`);
    console.log('------------------------------------------\n');
  }

  private showError(error: unknown): void {
    const message =
      error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';

    console.error(`\n${message}\n`);
  }
}
