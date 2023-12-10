import { PlanetEntity } from "../../../../data-access-layer/star-wars-entity/entities/planet.entity";

export class PlanetResponseDTO {
  name: string;
  rotationPeriod: string;
  orbitalPeriod: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surfaceWater: string;
  population: string;
  residents: string[];
  films: string[];
  createdAt: Date;
  modifiedAt: Date;
  url: string;

  constructor(planet: PlanetEntity) {
    this.name = planet.name;
    this.rotationPeriod = planet.rotationPeriod;
    this.orbitalPeriod = planet.orbitalPeriod;
    this.diameter = planet.diameter;
    this.climate = planet.climate;
    this.gravity = planet.gravity;
    this.terrain = planet.terrain;
    this.surfaceWater = planet.surfaceWater;
    this.population = planet.population;
    this.residents = planet.residents;
    this.films = planet.films;
    this.createdAt = planet.createdAt;
    this.modifiedAt = planet.modifiedAt;
    this.url = planet.url;
  }
}
