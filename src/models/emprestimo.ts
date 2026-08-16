import { Livro } from './livro';

export interface Emprestimo {
  id: number;
  cliente_id: number;
  usuario_id: number;
  data_emprestimo: Date;
  data_devolucao: Date | null;
  livros: Livro[];
}

export interface EmprestimoCreate {
  cliente_id: number;
  usuario_id: number;
  livro_ids: number[];
}
