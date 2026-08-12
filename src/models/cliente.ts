export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
}

export type ClienteCreate = Omit<Cliente, 'id'>;

export interface ClienteUpdate {
  id: number;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
}
