/* eslint-disable @typescript-eslint/no-namespace */
import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';


export namespace AddressModel {
  export class AddressDTO {
    @MaxLength(200)
    @IsNotEmpty()
    @IsString()
    country: string;

    @MaxLength(200)
    @IsNotEmpty()
    @IsString()
    city: string;

    @MaxLength(40)
    @IsNotEmpty()
    @IsString()
    zipCode: string;

    @MaxLength(200)
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @MaxLength(200)
    @IsNotEmpty()
    @IsString()
    countryCode: string;
  }

  export class AddressOptionalDTO extends PartialType(AddressDTO) { }
  export class AddressWithIdDTO extends AddressDTO {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }
  export class AddressOptionalWithIdDTO extends PartialType(AddressDTO) {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }

  export class AddressResponseDTO {
    country: string;
    city: string;
    zipCode: string;
    address: string;
    countryCode?: string;
    id: string;
    constructor(address: AddressWithIdDTO) {
      this.id = address.id;
      this.country = address.country;
      this.city = address.city;
      this.zipCode = address.zipCode;
      this.address = address.address;
      this.countryCode = address.countryCode ?? null;
    }
  }
}

