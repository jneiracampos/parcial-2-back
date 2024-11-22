import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let medicoRepository: Repository<MedicoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicosList: MedicoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
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

  it('findAll should return all doctors', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(medicosList.length);
  });

  it('findOne should return a doctor by id', async () => {
    const storedMedico: MedicoEntity = medicosList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toEqual(storedMedico.nombre);
    expect(medico.especialidad).toEqual(storedMedico.especialidad);
    expect(medico.telefono).toEqual(storedMedico.telefono);
  });

  it('findOne should throw an exception for an invalid doctor', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The doctor with the given id was not found");
  });

  it('create should return a new doctor', async () => {
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

  it('create should throw an exception for a doctor without name or specialty', async () => {
    const medico: MedicoEntity = {
        id: "",
        nombre: "",
        especialidad: "",
        telefono: faker.phone.number(),
        pacientes: [],
    };

    await expect(() => service.create(medico)).rejects.toHaveProperty("message", "The name and specialty fields are required");
  });

  it('delete should remove a doctor', async () => {
    const doctor: MedicoEntity = medicosList[0];
    await service.delete(doctor.id);
    const deletedDoctor: MedicoEntity = await medicoRepository.findOne({ where: { id: doctor.id } });
    expect(deletedDoctor).toBeNull();
  });

  it('delete should throw an exception for an invalid doctor', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The doctor with the given id was not found");
  });

  it('delete should throw an exception for a doctor with associated patients', async () => {
    const paciente: PacienteEntity = await pacienteRepository.save({
      id: "",
      nombre: faker.person.fullName(),
      genero: faker.helpers.arrayElement(["Masculino", "Femenino"]),
      diagnosticos: [],
      medicos: [],
    });

    const medico: MedicoEntity = medicosList[0];
    medico.pacientes = [paciente];
    await medicoRepository.save(medico);

    await expect(() => service.delete(medico.id)).rejects.toHaveProperty("message", "The doctor cannot be deleted because it has at least one associated patient");
  });

});