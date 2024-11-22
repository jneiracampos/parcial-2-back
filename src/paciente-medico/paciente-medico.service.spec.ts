import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteMedicoService } from './paciente-medico.service';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();
    medicosList = [];
    for (let i = 0; i < 4; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
        nombre: faker.person.fullName(),
        genero: faker.helpers.arrayElement(["Masculino", "Femenino"]),
        medicos: medicosList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should return a paciente with the doctor added', async () => {
    const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
    });

    const updatedPaciente = await service.addMedicoToPaciente(paciente.id, medico.id);
    expect(updatedPaciente.medicos.length).toEqual(medicosList.length + 1);
  });

  it('addMedicoToPaciente should throw an exception for an invalid paciente', async () => {
    const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
    });

    await expect(service.addMedicoToPaciente("0", medico.id)).rejects.toHaveProperty("message", "The patient with the given id was not found");
  });

  it('addMedicoToPaciente should throw an exception for an invalid doctor', async () => {
    await expect(service.addMedicoToPaciente(paciente.id, "0")).rejects.toHaveProperty("message", "The doctor with the given id was not found");
  });

  it('addMedicoToPaciente should throw an exception when the patient has more than 5 doctors', async () => {
    const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
    });

    await service.addMedicoToPaciente(paciente.id, medico.id);

    const medico2: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
    });

    await expect(service.addMedicoToPaciente(paciente.id, medico2.id)).rejects.toHaveProperty("message", "A patient cannot have more than 5 associated doctors");
    });
});