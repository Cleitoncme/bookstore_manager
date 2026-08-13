import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { LivroEntity } from './livro.entity';

@Entity({ name: 'autor' })
export class AutorEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 100 })
  nome!: string;

  @ManyToMany(() => LivroEntity, (livro) => livro.autores)
  livros!: LivroEntity[];
}
