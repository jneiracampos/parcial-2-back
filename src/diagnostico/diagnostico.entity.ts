import { PacienteEntity } from 'src/paciente/paciente.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class DiagnosticoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    nombre: string;
  
    @Column()
    description: string

    @ManyToMany(() => PacienteEntity, paciente => paciente.diagnosticos)
    @JoinTable()
    pacientes: PacienteEntity[];
}
