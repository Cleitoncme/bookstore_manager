import { Autor } from './autor';

export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  ano_publicacao: number;
  autores: Autor[];
}

export interface LivroCreate {
  titulo: string;
  editora: string;
  ano_publicacao: number;
  autor_ids: number[];
}

export interface LivroUpdate {
  id: number;
  titulo: string;
  editora: string;
  ano_publicacao: number;
  autor_ids: number[];
}
