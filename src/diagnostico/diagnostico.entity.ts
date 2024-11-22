import { PacienteEntity } from '../paciente/paciente.entity';
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
    @JoinTable({
        name: 'diagnostico_paciente',
        joinColumn: {
            name: 'diagnostico_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'paciente_id',
            referencedColumnName: 'id',
        },
    })
    pacientes: PacienteEntity[];
}
