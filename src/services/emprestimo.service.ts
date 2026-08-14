/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { ClienteRepository } from '../infra/repositories/cliente.repository';
import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository';
import { LivroRepository } from '../infra/repositories/livro.repository';
import { Emprestimo, EmprestimoCreate } from '../models/emprestimo';

export class EmprestimoService {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly livroRepository: LivroRepository,
  ) {}

  async create(data: EmprestimoCreate): Promise<Emprestimo> {
    this.validateId(data.cliente_id, 'cliente');
    this.validateId(data.usuario_id, 'usuário');

    const cliente = await this.clienteRepository.findById(data.cliente_id);

    if (!cliente) {
      throw new Error(`Cliente com ID ${data.cliente_id} não encontrado.`);
    }

    const livroIds = this.normalizeBookIds(data.livro_ids);

    await this.validateBooks(livroIds);

    return this.emprestimoRepository.create({
      cliente_id: data.cliente_id,
      usuario_id: data.usuario_id,
      livro_ids: livroIds,
    });
  }

  async findAll(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.findAll();
  }

  async findById(id: number): Promise<Emprestimo> {
    this.validateId(id, 'empréstimo');

    const emprestimo = await this.emprestimoRepository.findById(id);

    if (!emprestimo) {
      throw new Error(`Empréstimo com ID ${id} não encontrado.`);
    }

    return emprestimo;
  }

  async findActive(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.findActive();
  }

  async returnLoan(id: number): Promise<Emprestimo> {
    this.validateId(id, 'empréstimo');

    const emprestimo = await this.emprestimoRepository.findById(id);

    if (!emprestimo) {
      throw new Error(`Empréstimo com ID ${id} não encontrado.`);
    }

    if (emprestimo.data_devolucao) {
      throw new Error(`O empréstimo com ID ${id} já foi devolvido.`);
    }

    const returnedEmprestimo = await this.emprestimoRepository.returnLoan(id);

    if (!returnedEmprestimo) {
      throw new Error(`Empréstimo com ID ${id} não encontrado.`);
    }

    return returnedEmprestimo;
  }

  private validateId(id: number, entityName: string): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Informe um ID de ${entityName} válido.`);
    }
  }

  private normalizeBookIds(livroIds: number[]): number[] {
    if (!Array.isArray(livroIds) || livroIds.length === 0) {
      throw new Error('O empréstimo deve possuir pelo menos um livro.');
    }

    const uniqueLivroIds = [...new Set(livroIds)];

    for (const livroId of uniqueLivroIds) {
      this.validateId(livroId, 'livro');
    }

    return uniqueLivroIds;
  }

  private async validateBooks(livroIds: number[]): Promise<void> {
    for (const livroId of livroIds) {
      const livro = await this.livroRepository.findById(livroId);

      if (!livro) {
        throw new Error(`Livro com ID ${livroId} não encontrado.`);
      }

      if (livro.quantidade_disponivel <= 0) {
        throw new Error(
          `O livro "${livro.titulo}" não possui exemplares disponíveis.`,
        );
      }
    }
  }
}
