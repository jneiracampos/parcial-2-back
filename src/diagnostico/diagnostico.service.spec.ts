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

  it('findAll should return all results', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(diagnosticosList.length);
  });

  it('findOne should return a results by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticosList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.description).toEqual(storedDiagnostico.description);
  });

  it('findOne should throw an exception for an invalid results', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The result with the given id was not found");
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

  it('create should throw an exception for a result with a description longer than 200 characters', async () => {
    const diagnostico: DiagnosticoEntity = {
        id: "",
        nombre: faker.person.fullName(),
        description: faker.lorem.paragraph(15),
        pacientes: [],
    };

    await expect(() => service.create(diagnostico)).rejects.toHaveProperty("message", "The description must have a maximum length of 200 characters");
  });

  it('delete should remove a result', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);
    const deletedDiagnostico: DiagnosticoEntity = await diagnosticoRepository.findOne({ where: { id: diagnostico.id } });
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete should throw an exception for an invalid result', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The result with the given id was not found");
  });

});