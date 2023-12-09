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
  created: string;
  edited: string;
  url: string;

  constructor(planet: any) {
    this.name = planet.name;
    this.rotationPeriod = planet.rotation_period;
    this.orbitalPeriod = planet.orbital_period;
    this.diameter = planet.diameter;
    this.climate = planet.climate;
    this.gravity = planet.gravity;
    this.terrain = planet.terrain;
    this.surfaceWater = planet.surface_water;
    this.population = planet.population;
    this.residents = planet.residents;
    this.films = planet.films;
    this.created = planet.created;
    this.edited = planet.edited;
    this.url = planet.url;
  }
}
