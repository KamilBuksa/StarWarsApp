import { StarshipEntity } from "../../../../data-access-layer/star-wars-entity/entities/starship.entity";

export class StarshipResponseDTO {
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
  hyperdriveRating: string;
  MGLT: string;
  starshipClass: string;
  pilots: string[];
  films: string[];
  createdAt: Date;
  modifiedAt: Date;
  url: string;

  constructor(starship: StarshipEntity) {
    this.name = starship.name;
    this.model = starship.model;
    this.manufacturer = starship.manufacturer;
    this.costInCredits = starship.costInCredits;
    this.length = starship.length;
    this.maxAtmospheringSpeed = starship.maxAtmospheringSpeed;
    this.crew = starship.crew;
    this.passengers = starship.passengers;
    this.cargoCapacity = starship.cargoCapacity;
    this.consumables = starship.consumables;
    this.hyperdriveRating = starship.hyperdriveRating;
    this.MGLT = starship.MGLT;
    this.starshipClass = starship.starshipClass;
    this.pilots = starship.pilots;
    this.films = starship.films;
    this.createdAt = starship.createdAt;
    this.modifiedAt = starship.modifiedAt;
    this.url = starship.url;
  }
}
