import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';
import { DiagnosticoEntity } from './diagnostico.entity';

@Injectable()
export class DiagnosticoService {
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>
    ){}

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({relations: ['pacientes']});
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}, relations: ['pacientes']});
        if (!diagnostico) {
            throw new BusinessLogicException("The result with the given id was not found", BusinessError.NOT_FOUND);
        }

        return diagnostico;
    }

    async create(ingredient: DiagnosticoEntity): Promise<DiagnosticoEntity> {

        // La descripción debe tener una maxima longitud de 200 caracteres.
        if (ingredient.description.length > 200) {
            throw new BusinessLogicException("The description must have a maximum length of 200 characters", BusinessError.PRECONDITION_FAILED);
        }

        return await this.diagnosticoRepository.save(ingredient);
    }

    async delete(id: string) {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}});
        if (!diagnostico) {
            throw new BusinessLogicException("The result with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.diagnosticoRepository.remove(diagnostico);
    }
}
