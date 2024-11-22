import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';

@Module({
    providers: [MedicoService],
    imports: [TypeOrmModule.forFeature([MedicoEntity])],
    controllers: [MedicoController]
})
export class MedicoModule {}
