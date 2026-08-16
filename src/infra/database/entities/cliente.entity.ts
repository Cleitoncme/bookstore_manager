import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EmprestimoEntity } from './emprestimo.entity';

@Entity({ name: 'cliente' })
export class ClienteEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 100 })
  nome!: string;

  @Column({ name: 'cpf', type: 'varchar', length: 11, unique: true })
  cpf!: string;

  @Column({
    name: 'telefone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefone!: string | null;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email!: string | null;

  @OneToMany(() => EmprestimoEntity, (emprestimo) => emprestimo.cliente)
  emprestimos!: EmprestimoEntity[];
}
