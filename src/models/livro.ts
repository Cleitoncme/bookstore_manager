import { Autor } from './autor';

export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  ano_publicacao: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  autores: Autor[];
}

export interface LivroCreate {
  titulo: string;
  editora: string;
  ano_publicacao: number;
  quantidade_total: number;
  autor_ids: number[];
}

export interface LivroUpdate {
  id: number;
  titulo: string;
  editora: string;
  ano_publicacao: number;
  quantidade_total: number;
  autor_ids: number[];
}
