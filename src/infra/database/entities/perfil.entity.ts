import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UsuarioEntity } from './usuario.entity';

@Entity({ name: 'perfil' })
export class PerfilEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 30 })
  nome!: string;

  @OneToMany(() => UsuarioEntity, (usuario) => usuario.perfil)
  usuarios!: UsuarioEntity[];
}
