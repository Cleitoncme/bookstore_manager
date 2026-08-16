/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ClienteRepository } from '../infra/repositories/cliente.repository';
import { Cliente, ClienteCreate, ClienteUpdate } from '../models/cliente';

export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async create(data: ClienteCreate): Promise<Cliente> {
    const normalizedData = this.validateAndNormalizeData(data);

    const existingCliente = await this.clienteRepository.findByCpf(
      normalizedData.cpf,
    );

    if (existingCliente) {
      throw new Error(
        `Já existe um cliente cadastrado com o CPF ${normalizedData.cpf}.\n ==>>!!! Cliente não cadastrado!!!`,
      );
    }

    return this.clienteRepository.create(normalizedData);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.findAll();
  }

  async findById(id: number): Promise<Cliente> {
    this.validateId(id);

    const cliente = await this.clienteRepository.findById(id);

    if (!cliente) {
      throw new Error(`Cliente com ID ${id} não encontrado.`);
    }

    return cliente;
  }

  async update(data: ClienteUpdate): Promise<Cliente> {
    this.validateId(data.id);

    const currentCliente = await this.clienteRepository.findById(data.id);

    if (!currentCliente) {
      throw new Error(`Cliente com ID ${data.id} não encontrado.`);
    }

    const normalizedData = this.validateAndNormalizeData(data);

    const clienteWithCpf = await this.clienteRepository.findByCpf(
      normalizedData.cpf,
    );

    if (clienteWithCpf && clienteWithCpf.id !== data.id) {
      throw new Error(
        `Já existe outro cliente cadastrado com o CPF ${normalizedData.cpf}. \n ==>>!!! Cliente não cadastrado!!!`,
      );
    }

    const updatedCliente = await this.clienteRepository.update({
      ...normalizedData,
      id: data.id,
    });

    if (!updatedCliente) {
      throw new Error('Não foi possível atualizar o cliente.');
    }

    return updatedCliente;
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);

    const cliente = await this.clienteRepository.findById(id);

    if (!cliente) {
      throw new Error(`Cliente com ID ${id} não encontrado.`);
    }

    const hasLoans = await this.clienteRepository.hasLoans(id);

    if (hasLoans) {
      throw new Error(
        'Não é possível remover o cliente porque existem empréstimos vinculados a ele.',
      );
    }

    const deleted = await this.clienteRepository.delete(id);

    if (!deleted) {
      throw new Error('Não foi possível remover o cliente.');
    }
  }

  private validateAndNormalizeData(data: ClienteCreate): ClienteCreate {
    const nome = data.nome.trim();
    const cpf = this.normalizeCpf(data.cpf);
    const telefone = this.normalizeOptionalField(data.telefone);
    const email = this.normalizeOptionalField(data.email);

    if (!nome) {
      throw new Error(
        'O nome do cliente é obrigatório.\n ==>>!!! Cliente não cadastrado!!!',
      );
    }

    this.validateCpf(cpf);

    if (email) {
      this.validateEmail(email);
    }

    return {
      nome,
      cpf,
      telefone,
      email,
    };
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Informe um ID de cliente válido.');
    }
  }

  private normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private validateCpf(cpf: string): void {
    if (!/^\d{11}$/.test(cpf)) {
      throw new Error(
        'O CPF deve possuir exatamente 11 dígitos. \n==>> Cliente não cadastrado',
      );
    }
  }

  private validateEmail(email: string): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      throw new Error('Informe um endereço de e-mail válido.');
    }
  }

  private normalizeOptionalField(value?: string): string | undefined {
    const normalizedValue = value?.trim();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return normalizedValue || undefined;
  }
}
