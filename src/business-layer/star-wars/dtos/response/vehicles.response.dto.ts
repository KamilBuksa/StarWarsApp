import { VehicleEntity } from "../../../../data-access-layer/star-wars-entity/entities/vehicle.entity";

export class VehicleResponseDTO {
  name: string;
  model: string;
  manufacturer: string;
  costInCredits: string;
  length: string;
  maxAtmospheringSpeed: string;
  crew: string;
  passengers: string;
  cargoCapacity: string;
  consumables: string;
  vehicleClass: string;
  pilots: string[];
  films: string[];
  createdAt: Date;
  modifiedAt: Date;
  url: string;

  constructor(vehicle: VehicleEntity) {
    this.name = vehicle.name;
    this.model = vehicle.model;
    this.manufacturer = vehicle.manufacturer;
    this.costInCredits = vehicle.costInCredits;
    this.length = vehicle.length;
    this.maxAtmospheringSpeed = vehicle.maxAtmospheringSpeed;
    this.crew = vehicle.crew;
    this.passengers = vehicle.passengers;
    this.cargoCapacity = vehicle.cargoCapacity;
    this.consumables = vehicle.consumables;
    this.vehicleClass = vehicle.vehicleClass;
    this.pilots = vehicle.pilots;
    this.films = vehicle.films;
    this.createdAt = vehicle.createdAt;
    this.modifiedAt = vehicle.modifiedAt;
    this.url = vehicle.url;
  }
}
