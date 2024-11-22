import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';
import { MedicoEntity } from './medico.entity';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ){}

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({relations: ['pacientes']});
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ['pacientes']});
        if (!medico) {
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        }

        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {

        //  El nombre y la especialidad no pueden ser nulos.
        if (!medico.nombre || !medico.especialidad) {
            throw new BusinessLogicException("The name and specialty fields are required", BusinessError.PRECONDITION_FAILED);
        }

        //  No se puede eliminar un médico si tiene al menos un paciente asociado.
        if (medico.pacientes.length > 0) {
            throw new BusinessLogicException("The doctor cannot be deleted because it has at least one associated patient", BusinessError.PRECONDITION_FAILED);
        }

        return await this.medicoRepository.save(medico);
    }

    async delete(id: string) {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}});
        if (!medico) {
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.medicoRepository.remove(medico);
    }
}
