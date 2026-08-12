export interface UsuarioAutenticado {
  id: number;
  login: string;
  perfilId: number;
  perfilNome: string;
  dataCadastro: Date;
}

export interface UsuarioRepository {
  authenticate(
    login: string,
    senha: string,
  ): Promise<UsuarioAutenticado | null>;
}
