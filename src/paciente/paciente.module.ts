import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';

@Module({
    providers: [PacienteService],
    imports: [TypeOrmModule.forFeature([PacienteEntity])],
    controllers: [PacienteController]
})
export class PacienteModule {}
