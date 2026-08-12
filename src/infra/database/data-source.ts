import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { AutorEntity } from './entities/autor.entity';
import { ClienteEntity } from './entities/cliente.entity';
import { EmprestimoEntity } from './entities/emprestimo.entity';
import { LivroEntity } from './entities/livro.entity';
import { PerfilEntity } from './entities/perfil.entity';
import { UsuarioEntity } from './entities/usuario.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    PerfilEntity,
    UsuarioEntity,
    AutorEntity,
    LivroEntity,
    ClienteEntity,
    EmprestimoEntity,
  ],
});