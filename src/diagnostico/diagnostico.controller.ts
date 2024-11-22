import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor';
import { DiagnosticoEntity } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';


@Controller('diagnotico')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) { }

    @Get()
    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoService.findAll();
    }

    @Get(':diagnosticoId')
    async findOne(@Param('diagnosticoId') diagnosticoId: string): Promise<DiagnosticoEntity> {
        return await this.diagnosticoService.findOne(diagnosticoId);
    }

    @Post()
    async create(@Body() diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        return await this.diagnosticoService.create(diagnostico);
    }

    @Delete(':diagnosticoId')
    @HttpCode(204)
    async delete(@Param('diagnosticoId') diagnosticoId: string): Promise<void> {
        await this.diagnosticoService.delete(diagnosticoId);
    }
}
