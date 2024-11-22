import { PacienteEntity } from '../paciente/paciente.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

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

    @ManyToMany(() => PacienteEntity, paciente => paciente.medicos)
    @JoinTable()
    pacientes: PacienteEntity[];
}
