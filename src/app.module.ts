import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity';
import { MedicoEntity } from './medico/medico.entity';
import { PacienteEntity } from './paciente/paciente.entity';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';


@Module({
  imports: [DiagnosticoModule, MedicoModule, PacienteModule, PacienteMedicoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [DiagnosticoEntity, MedicoEntity, PacienteEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
      autoLoadEntities: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
