import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordAdminDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({type:String, description:'currentPassword'})
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({type:String, description:'newPassword'})
    newPassword: string;
}