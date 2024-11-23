import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class PacienteDTO {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly genero: string;
}