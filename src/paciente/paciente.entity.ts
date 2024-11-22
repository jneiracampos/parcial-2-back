import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    nombre: string;

    @Column()
    genero: string;
}
