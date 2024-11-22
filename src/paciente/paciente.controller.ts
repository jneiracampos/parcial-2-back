import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';

@Controller('paciente')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) { }

    @Get()
    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteService.findAll();
    }

    @Get(':pacienteId')
    async findOne(@Param('pacienteId') pacienteId: string): Promise<PacienteEntity> {
        return await this.pacienteService.findOne(pacienteId);
    }

    @Post()
    async create(@Body() paciente: PacienteEntity): Promise<PacienteEntity> {
        return await this.pacienteService.create(paciente);
    }

    @Delete(':pacienteId')
    @HttpCode(204)
    async delete(@Param('pacienteId') pacienteId: string): Promise<void> {
        await this.pacienteService.delete(pacienteId);
    }
}
