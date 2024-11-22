import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';

@Module({
    providers: [PacienteService],
    imports: [TypeOrmModule.forFeature([PacienteEntity])]
})
export class PacienteModule {}
