import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteEntity } from './cliente.entity';
import { LivroEntity } from './livro.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity({ name: 'emprestimo' })
export class EmprestimoEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'cliente_id', type: 'integer' })
  cliente_id!: number;

  @Column({ name: 'usuario_id', type: 'integer' })
  usuario_id!: number;

  @Column({
    name: 'data_emprestimo',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  data_emprestimo!: Date;

  @Column({
    name: 'data_devolucao',
    type: 'timestamptz',
    nullable: true,
  })
  data_devolucao!: Date | null;

  @ManyToOne(() => ClienteEntity, (cliente) => cliente.emprestimos, {
    nullable: false,
  })
  @JoinColumn({ name: 'cliente_id' })
  cliente!: ClienteEntity;

  @ManyToOne(() => UsuarioEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: UsuarioEntity;

  @ManyToMany(() => LivroEntity, (livro) => livro.emprestimos)
  @JoinTable({
    name: 'emprestimo_livro',
    joinColumn: {
      name: 'emprestimo_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'livro_id',
      referencedColumnName: 'id',
    },
  })
  livros!: LivroEntity[];
}