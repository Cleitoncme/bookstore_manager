import { Autor } from '../models/autor';
import { AutorRepository } from '../infra/repositories/autor.repository';

export class AutorService {
  constructor(private readonly repository: AutorRepository) {}

  async create(nome: string): Promise<Autor> {
    const normalizedName = nome.trim();

    if (!normalizedName) {
      throw new Error('O nome do autor é obrigatório.');
    }

    return this.repository.create({
      nome: normalizedName,
    });
  }

  async findAll(): Promise<Autor[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Autor> {
    this.validateId(id);

    const autor = await this.repository.findById(id);

    if (!autor) {
      throw new Error(`Autor com ID ${id} não encontrado.`);
    }

    return autor;
  }

  async update(id: number, nome: string): Promise<Autor> {
    this.validateId(id);

    const normalizedName = nome.trim();

    if (!normalizedName) {
      throw new Error('O nome do autor é obrigatório.');
    }

    const existingAutor = await this.repository.findById(id);

    if (!existingAutor) {
      throw new Error(`Autor com ID ${id} não encontrado.`);
    }

    const updatedAutor = await this.repository.update(id, normalizedName);

    if (!updatedAutor) {
      throw new Error('Não foi possível atualizar o autor.');
    }

    return updatedAutor;
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);

    const autor = await this.repository.findById(id);

    if (!autor) {
      throw new Error(`Autor com ID ${id} não encontrado.`);
    }

    const hasBooks = await this.repository.hasBooks(id);

    if (hasBooks) {
      throw new Error(
        'Não é possível remover o autor porque existem livros vinculados a ele.',
      );
    }

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new Error('Não foi possível remover o autor.');
    }
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Informe um ID de autor válido.');
    }
  }
}
