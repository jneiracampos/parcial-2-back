import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class DiagnosticoDTO {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}