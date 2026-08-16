/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { AutorRepository } from '../infra/repositories/autor.repository';
import { LivroRepository } from '../infra/repositories/livro.repository';
import { Livro, LivroCreate, LivroUpdate } from '../models/livro';

export class LivroService {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository,
  ) {}

  async create(data: LivroCreate): Promise<Livro> {
    const normalizedData = await this.validateAndNormalizeData(data);

    return this.livroRepository.create(normalizedData);
  }

  async findAll(): Promise<Livro[]> {
    return this.livroRepository.findAll();
  }

  async findById(id: number): Promise<Livro> {
    this.validateId(id);

    const livro = await this.livroRepository.findById(id);

    if (!livro) {
      throw new Error(`Livro com ID ${id} não encontrado.`);
    }

    return livro;
  }

  async update(data: LivroUpdate): Promise<Livro> {
    this.validateId(data.id);

    const existingLivro = await this.livroRepository.findById(data.id);

    if (!existingLivro) {
      throw new Error(`Livro com ID ${data.id} não encontrado.`);
    }

    const normalizedData = await this.validateAndNormalizeData(data);

    const updatedLivro = await this.livroRepository.update({
      ...normalizedData,
      id: data.id,
    });

    if (!updatedLivro) {
      throw new Error('Não foi possível atualizar o livro.');
    }

    return updatedLivro;
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);

    const livro = await this.livroRepository.findById(id);

    if (!livro) {
      throw new Error(`Livro com ID ${id} não encontrado.`);
    }

    const hasLoans = await this.livroRepository.hasLoans(id);

    if (hasLoans) {
      throw new Error(
        'Não é possível remover o livro porque existem empréstimos vinculados a ele.',
      );
    }

    const deleted = await this.livroRepository.delete(id);

    if (!deleted) {
      throw new Error('Não foi possível remover o livro.');
    }
  }

  private async validateAndNormalizeData(
    data: LivroCreate,
  ): Promise<LivroCreate> {
    const titulo = data.titulo.trim();
    const editora = data.editora.trim();

    if (!titulo) {
      throw new Error('O título do livro é obrigatório.');
    }

    if (!editora) {
      throw new Error('A editora do livro é obrigatória.');
    }

    this.validatePublicationYear(data.ano_publicacao);
    this.validateQuantity(data.quantidade_total);

    const autorIds = this.normalizeAuthorIds(data.autor_ids);

    await this.validateAuthors(autorIds);

    return {
      titulo,
      editora,
      ano_publicacao: data.ano_publicacao,
      quantidade_total: data.quantidade_total,
      autor_ids: autorIds,
    };
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Informe um ID de livro válido.');
    }
  }

  private validatePublicationYear(year: number): void {
    const currentYear = new Date().getFullYear();

    if (!Number.isInteger(year) || year <= 0 || year > currentYear) {
      throw new Error(
        `O ano de publicação deve estar entre 1 e ${currentYear}.`,
      );
    }
  }

  private validateQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(
        'A quantidade total deve ser um número inteiro maior que zero.',
      );
    }
  }

  private normalizeAuthorIds(autorIds: number[]): number[] {
    if (!Array.isArray(autorIds) || autorIds.length === 0) {
      throw new Error('O livro deve possuir pelo menos um autor.');
    }

    const uniqueAuthorIds = [...new Set(autorIds)];

    for (const autorId of uniqueAuthorIds) {
      if (!Number.isInteger(autorId) || autorId <= 0) {
        throw new Error('Informe apenas IDs de autores válidos.');
      }
    }

    return uniqueAuthorIds;
  }

  private async validateAuthors(autorIds: number[]): Promise<void> {
    for (const autorId of autorIds) {
      const autor = await this.autorRepository.findById(autorId);

      if (!autor) {
        throw new Error(`Autor com ID ${autorId} não encontrado.`);
      }
    }
  }
}
