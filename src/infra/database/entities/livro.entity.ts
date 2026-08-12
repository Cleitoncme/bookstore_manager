import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutorEntity } from './autor.entity';
import { EmprestimoEntity } from './emprestimo.entity';

@Entity({ name: 'livro' })
export class LivroEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'titulo', type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ name: 'editora', type: 'varchar', length: 100 })
  editora!: string;

  @Column({ name: 'ano_publicacao', type: 'integer' })
  ano_publicacao!: number;

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
