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
        return await this.medicoRepository.find({relations: ['recipes']});
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ['recipes']});
        if (!medico) {
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        }

        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
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
