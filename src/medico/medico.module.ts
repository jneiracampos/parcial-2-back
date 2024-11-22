import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { MedicoService } from './medico.service';

@Module({
    providers: [MedicoService],
    imports: [TypeOrmModule.forFeature([MedicoEntity])]
})
export class MedicoModule {}
