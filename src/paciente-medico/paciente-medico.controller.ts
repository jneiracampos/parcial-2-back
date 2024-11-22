import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from 'src/paciente/paciente.entity';

@Controller('pacientes/:pacienteId/medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService) { }

    @Post(':medicoId')
    async addMedicoToPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string): Promise<PacienteEntity> {
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }
}