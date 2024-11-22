import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<PacienteEntity>;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let pacientesList: PacienteEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await pacienteRepository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await pacienteRepository.save({
        nombre: faker.person.fullName(),
        genero: faker.helpers.arrayElement(["Masculino", "Femenino"]),
      });
      pacientesList.push(paciente);
    }
  
    return pacientesList;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all patients', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacientesList.length);
  });

  it('findOne should return a patient by id', async () => {
    const storedPaciente: PacienteEntity = pacientesList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  it('findOne should throw an exception for an invalid patient', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The patient with the given id was not found");
  });

  it('create should return a new patient', async () => {
    const patient: PacienteEntity = {
        id: "",
        nombre: faker.person.fullName(),
        genero: faker.helpers.arrayElement(["Masculino", "Femenino"]),
        medicos: [],
        diagnosticos: []
    };

    const newPatient: PacienteEntity = await service.create(patient);
    expect(newPatient).not.toBeNull();

    const storedPatient: PacienteEntity = await pacienteRepository.findOne({ where: { id: newPatient.id } });
    expect(storedPatient).not.toBeNull();
    expect(storedPatient.nombre).toEqual(patient.nombre);
    expect(storedPatient.genero).toEqual(patient.genero);
  });

  it('create should throw an exception for an invalid patient', async () => {
    const patient: PacienteEntity = {
      id: "",
      nombre: "ab",
      genero: faker.helpers.arrayElement(["Masculino", "Femenino"]),
      medicos: [],
      diagnosticos: []
  };

    await expect(service.create(patient)).rejects.toHaveProperty("message", "The name must be at least 3 characters long");
  });

  it('delete should remove a patient', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.id);
    const deletedPaciente: PacienteEntity = await pacienteRepository.findOne({ where: { id: paciente.id } });
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an exception for an invalid patient', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The patient with the given id was not found");
  });

  it('delete should throw an exception for a patient with associated result', async () => {
    const diagnostico: DiagnosticoEntity = await diagnosticoRepository.save({
      id: "",
      nombre: faker.person.fullName(),
      description: faker.lorem.sentence(),
      pacientes: [],
    });

    const paciente: PacienteEntity = pacientesList[0];
    paciente.diagnosticos = [diagnostico];
    await pacienteRepository.save(paciente);

    await expect(() => service.delete(paciente.id)).rejects.toHaveProperty("message", "The patient cannot be deleted because it has an associated diagnosis");
  });

});