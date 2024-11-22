import { TypeOrmModule } from "@nestjs/typeorm";
import { DiagnosticoEntity } from "src/diagnostico/diagnostico.entity";
import { MedicoEntity } from "src/medico/medico.entity";
import { PacienteEntity } from "src/paciente/paciente.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [DiagnosticoEntity, MedicoEntity, PacienteEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([DiagnosticoEntity, MedicoEntity, PacienteEntity],)
];