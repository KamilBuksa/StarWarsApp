import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export namespace CoordinatesModel {
  export class CoordinatesDTO {
    @IsNotEmpty()
    @IsLongitude()
    longitude: number;

    @IsNotEmpty()
    @IsLatitude()
    latitude: number;
  }

  export class CoordinatesResponseDTO {
    longitude: number;
    latitude: number;

    constructor(coordinates: CoordinatesDTO) {
      this.longitude = coordinates?.longitude;
      this.latitude = coordinates?.latitude;
    }
  }
}
