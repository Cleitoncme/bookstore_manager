export interface Perfil {
  id: number;
  nome: string;
}

export type PerfilCreate = Omit<Perfil, 'id'>;

export interface PerfilUpdate {
  id: number;
  nome: string;
}
