import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class DiagnosticoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    nombre: string;
  
    @Column()
    description: string


}
