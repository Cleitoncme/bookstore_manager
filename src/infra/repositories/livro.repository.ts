import { Livro, LivroCreate, LivroUpdate } from '../../models/livro';

export interface LivroRepository {
  create(data: LivroCreate): Promise<Livro>;
  findAll(): Promise<Livro[]>;
  findById(id: number): Promise<Livro | null>;
  update(data: LivroUpdate): Promise<Livro | null>;
  delete(id: number): Promise<boolean>;
  hasLoans(id: number): Promise<boolean>;
}
