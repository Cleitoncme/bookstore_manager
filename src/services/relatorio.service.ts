import type { RelatorioRepository } from '../infra/repositories/relatorio.repository';
import type {
  ClienteEmprestimoAtivoRelatorio,
  LivroDisponivelRelatorio,
  LivroEmprestadoRelatorio,
  LivroPorAutorRelatorio,
  QuantidadeEmprestimosPorLivroRelatorio,
} from '../models/relatorio';

export class RelatorioService {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async findAvailableBooks(): Promise<LivroDisponivelRelatorio[]> {
    return this.relatorioRepository.findAvailableBooks();
  }

  async findBorrowedBooks(): Promise<LivroEmprestadoRelatorio[]> {
    return this.relatorioRepository.findBorrowedBooks();
  }

  async findBooksByAuthor(): Promise<LivroPorAutorRelatorio[]> {
    return this.relatorioRepository.findBooksByAuthor();
  }

  async findLoanCountByBook(): Promise<
    QuantidadeEmprestimosPorLivroRelatorio[]
  > {
    return this.relatorioRepository.findLoanCountByBook();
  }

  async findClientsWithActiveLoans(): Promise<
    ClienteEmprestimoAtivoRelatorio[]
  > {
    return this.relatorioRepository.findClientsWithActiveLoans();
  }
}
