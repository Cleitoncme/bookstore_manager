import type {
  ClienteEmprestimoAtivoRelatorio,
  LivroDisponivelRelatorio,
  LivroEmprestadoRelatorio,
  LivroPorAutorRelatorio,
  QuantidadeEmprestimosPorLivroRelatorio,
} from '../../models/relatorio';

export interface RelatorioRepository {
  findAvailableBooks(): Promise<LivroDisponivelRelatorio[]>;

  findBorrowedBooks(): Promise<LivroEmprestadoRelatorio[]>;

  findBooksByAuthor(): Promise<LivroPorAutorRelatorio[]>;

  findLoanCountByBook(): Promise<QuantidadeEmprestimosPorLivroRelatorio[]>;

  findClientsWithActiveLoans(): Promise<ClienteEmprestimoAtivoRelatorio[]>;
}
