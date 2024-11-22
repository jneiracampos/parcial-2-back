import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let medicoRepository: Repository<MedicoEntity>;
  let medicosList: MedicoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await medicoRepository.clear();
    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }
  
    return medicosList;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('create should return a new patient', async () => {
    const medico: MedicoEntity = {
        id: "",
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: [],
    };

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await medicoRepository.findOne({ where: { id: newMedico.id } });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(medico.nombre);
    expect(storedMedico.especialidad).toEqual(medico.especialidad);
    expect(storedMedico.telefono).toEqual(medico.telefono);
  });

});