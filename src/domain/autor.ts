export interface Autor {
  id: number;
  nome: string;
}

export type AutorCreate = Omit<Autor, 'id'>;

export interface AutorUpdate {
  id: number;
  nome: string;
}
