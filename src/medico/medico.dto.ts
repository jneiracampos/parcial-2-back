import { IsNotEmpty, IsString } from 'class-validator';

export class MedicoDTO {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly especialidad: string;

    @IsString()
    @IsNotEmpty()
    readonly telefono: string;
}