import { Autor } from './autor';

export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  ano_publicacao: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  autores: Autor[];
}

export interface LivroCreate {
  titulo: string;
  editora: string;
  ano_publicacao: number;
  quantidade_total: number;
  autor_ids: number[];
}

export interface LivroUpdate {
  id: number;
  titulo: string;
  editora: string;
  ano_publicacao: number;
  quantidade_total: number;
  autor_ids: number[];
}

// src/infra/database/entities/livro.entity.ts

import {
  Check,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutorEntity } from '../infra/database/entities/autor.entity';
import { EmprestimoEntity } from '../infra/database/entities/emprestimo.entity';
@Entity({ name: 'livro' })
@Check('"quantidade_total" >= 0')
@Check('"quantidade_disponivel" >= 0')
@Check('"quantidade_disponivel" <= "quantidade_total"')
export class LivroEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'integer',
  })
  id!: number;

  @Column({
    name: 'titulo',
    type: 'varchar',
    length: 200,
  })
  titulo!: string;

  @Column({
    name: 'editora',
    type: 'varchar',
    length: 100,
  })
  editora!: string;

  @Column({
    name: 'ano_publicacao',
    type: 'integer',
  })
  ano_publicacao!: number;

  @Column({
    name: 'quantidade_total',
    type: 'integer',
    default: 1,
  })
  quantidade_total!: number;

  @Column({
    name: 'quantidade_disponivel',
    type: 'integer',
    default: 1,
  })
  quantidade_disponivel!: number;

  @ManyToMany(() => AutorEntity, (autor) => autor.livros)
  @JoinTable({
    name: 'livro_autor',
    joinColumn: {
      name: 'livro_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'autor_id',
      referencedColumnName: 'id',
    },
  })
  autores!: AutorEntity[];

  @ManyToMany(() => EmprestimoEntity, (emprestimo) => emprestimo.livros)
  emprestimos!: EmprestimoEntity[];
}
