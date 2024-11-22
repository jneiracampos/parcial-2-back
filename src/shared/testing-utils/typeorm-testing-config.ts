import { TypeOrmModule } from "@nestjs/typeorm";
import { DiagnosticoEntity } from "../../diagnostico/diagnostico.entity";
import { MedicoEntity } from "../../medico/medico.entity";
import { PacienteEntity } from "../../paciente/paciente.entity";

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