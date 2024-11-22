import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await diagnosticoRepository.clear();
    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: DiagnosticoEntity = await diagnosticoRepository.save({
        nombre: faker.person.fullName(),
        description: faker.lorem.sentence(),
      });
      diagnosticosList.push(paciente);
    }
  
    return diagnosticosList;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('create should return a new result', async () => {
    const diagnostico: DiagnosticoEntity = {
        id: "",
        nombre: faker.person.fullName(),
        description: faker.lorem.sentence(),
        pacientes: [],
    };

    const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico: DiagnosticoEntity = await diagnosticoRepository.findOne({ where: { id: newDiagnostico.id } });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(diagnostico.nombre);
    expect(storedDiagnostico.description).toEqual(diagnostico.description);
  });

});