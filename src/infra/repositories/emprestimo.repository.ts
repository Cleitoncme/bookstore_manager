import { Emprestimo, EmprestimoCreate } from '../../models/emprestimo';

export interface EmprestimoRepository {
  create(data: EmprestimoCreate): Promise<Emprestimo>;
  findAll(): Promise<Emprestimo[]>;
  findById(id: number): Promise<Emprestimo | null>;
  findActive(): Promise<Emprestimo[]>;
  returnLoan(id: number): Promise<Emprestimo | null>;
}
