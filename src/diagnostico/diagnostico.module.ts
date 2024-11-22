import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';

@Module({
    providers: [DiagnosticoService],
    imports: [TypeOrmModule.forFeature([DiagnosticoEntity])]
})
export class DiagnosticoModule {}
