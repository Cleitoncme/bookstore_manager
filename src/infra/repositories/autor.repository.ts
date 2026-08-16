import { Autor, AutorCreate } from '../../models/autor';

export interface AutorRepository {
  create(data: AutorCreate): Promise<Autor>;
  findAll(): Promise<Autor[]>;
  findById(id: number): Promise<Autor | null>;
  update(id: number, nome: string): Promise<Autor | null>;
  delete(id: number): Promise<boolean>;
  hasBooks(id: number): Promise<boolean>;
}
