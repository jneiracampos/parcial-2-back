import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { MedicoDTO } from './medico.dto';
import { plainToInstance } from 'class-transformer';


@Controller('medico')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) { }

    @Get()
    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoService.findAll();
    }

    @Get(':medicoId')
    async findOne(@Param('medicoId') medicoId: string): Promise<MedicoEntity> {
        return await this.medicoService.findOne(medicoId);
    }

    @Post()
    async create(@Body() medico: MedicoDTO): Promise<MedicoEntity> {
        return await this.medicoService.create(plainToInstance(MedicoEntity, medico));
    }

    @Delete(':medicoId')
    @HttpCode(204)
    async delete(@Param('medicoId') medicoId: string): Promise<void> {
        await this.medicoService.delete(medicoId);
    }
}
