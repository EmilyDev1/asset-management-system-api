import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    @ApiProperty({type:String, description:'username'})
    readonly email:string

    @IsNotEmpty()
    @ApiProperty({type:String, description:'password'})
    readonly password:string;
}
 