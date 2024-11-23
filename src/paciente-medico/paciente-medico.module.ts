import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteMedicoService } from './paciente-medico.service';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
    providers: [PacienteMedicoService],
    imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
    controllers: [PacienteMedicoController]
})
export class PacienteMedicoModule {}
