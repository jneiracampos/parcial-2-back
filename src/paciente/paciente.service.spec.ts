import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<PacienteEntity>;
  let pacienteList: PacienteEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await pacienteRepository.clear();
    pacienteList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await pacienteRepository.save({
        nombre: faker.person.fullName(),
        genero: faker.helpers.arrayElement(["Masculino", "Femenino"]),
      });
      pacienteList.push(paciente);
    }
  
    return pacienteList;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
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

});