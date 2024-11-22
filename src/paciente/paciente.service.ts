import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';
import { PacienteEntity } from './paciente.entity';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>
    ){}

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({relations: ['diagnosticos']});
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}, relations: ['diagnosticos']});
        if (!paciente) {
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);
        }

        return paciente;
    }

    async create(patient: PacienteEntity): Promise<PacienteEntity> {

        //El nombre debe ser mayor a 3 caracteres
        if (patient.nombre.length < 3) {
            throw new BusinessLogicException("The name must be at least 3 characters long", BusinessError.PRECONDITION_FAILED);
        }

        // No se puede eliminar un paciente si tiene un diagnóstico asociado.
        if (patient.diagnosticos.length > 0) {
            throw new BusinessLogicException("The patient cannot be deleted because it has an associated diagnosis", BusinessError.PRECONDITION_FAILED);
        }
        
        return await this.pacienteRepository.save(patient);
    }

    async delete(id: string) {
        const patient: PacienteEntity = await this.pacienteRepository.findOne({where: {id}});
        if (!patient) {
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.pacienteRepository.remove(patient);
    }
}
