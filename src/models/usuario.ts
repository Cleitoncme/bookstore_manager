import { Perfil } from './perfil';

export interface Usuario {
  id: number;
  login: string;
  senha: string;
  perfil_id: number;
  data_cadastro: Date;
  perfil?: Perfil;
}

export interface UsuarioCreate {
  login: string;
  senha: string;
  perfil_id: number;
}

export interface UsuarioUpdate {
  id: number;
  login: string;
  senha?: string;
  perfil_id: number;
}
