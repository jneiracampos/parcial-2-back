import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class MedicoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    nombre: string;

    @Column()
    especialidad: string;
  
    @Column()
    telefono: string;
}
