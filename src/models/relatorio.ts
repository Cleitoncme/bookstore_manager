/* eslint-disable @typescript-eslint/array-type */
export interface LivroDisponivelRelatorio {
  id: number;
  titulo: string;
  quantidade_total: number;
  quantidade_disponivel: number;
}

export interface LivroEmprestadoRelatorio {
  emprestimo_id: number;
  livro_id: number;
  titulo: string;
  cliente_id: number;
  cliente_nome: string;
  data_emprestimo: Date;
}

export interface LivroPorAutorRelatorio {
  autor_id: number;
  autor_nome: string;
  livro_id: number;
  livro_titulo: string;
}

export interface QuantidadeEmprestimosPorLivroRelatorio {
  livro_id: number;
  livro_titulo: string;
  quantidade_emprestimos: number;
}

export interface ClienteEmprestimoAtivoRelatorio {
  cliente_id: number;
  cliente_nome: string;
  quantidade_emprestimos_ativos: number;
  livros_emprestados: Array<{
    id: number;
    titulo: string;
  }>;
}
