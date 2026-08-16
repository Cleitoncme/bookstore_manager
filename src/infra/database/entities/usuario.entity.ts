import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PerfilEntity } from './perfil.entity';

@Entity({ name: 'usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'login', type: 'varchar', length: 100, unique: true })
  login!: string;

  @Column({ name: 'senha', type: 'varchar', length: 255 })
  senha!: string;

  @Column({ name: 'perfil_id', type: 'integer' })
  perfil_id!: number;

  @Column({
    name: 'data_cadastro',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  data_cadastro!: Date;

  @ManyToOne(() => PerfilEntity, (perfil) => perfil.usuarios, {
    nullable: false,
  })
  @JoinColumn({ name: 'perfil_id' })
  perfil!: PerfilEntity;
}
