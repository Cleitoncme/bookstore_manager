import { Cliente, ClienteCreate, ClienteUpdate } from '../../models/cliente';

export interface ClienteRepository {
  create(data: ClienteCreate): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findById(id: number): Promise<Cliente | null>;
  findByCpf(cpf: string): Promise<Cliente | null>;
  update(data: ClienteUpdate): Promise<Cliente | null>;
  delete(id: number): Promise<boolean>;
  hasLoans(id: number): Promise<boolean>;
}
