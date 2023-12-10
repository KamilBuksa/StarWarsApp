import { Injectable } from '@nestjs/common';
import { FilmEntity } from '../../../data-access-layer/star-wars-entity/entities/film.entity';
import { SpeciesEntity } from '../../../data-access-layer/star-wars-entity/entities/specie.entity';
import { PlanetEntity } from '../../../data-access-layer/star-wars-entity/entities/planet.entity';
import { StarshipEntity } from '../../../data-access-layer/star-wars-entity/entities/starship.entity';
import { VehicleEntity } from '../../../data-access-layer/star-wars-entity/entities/vehicle.entity';

@Injectable()
export class StarWarsHelpersService {
  constructor(


  ) { }
  public mapToFilmEntity(filmData: any): FilmEntity {
    const film = new FilmEntity();
    film.title = filmData.title;
    film.episodeId = filmData.episode_id;
    film.openingCrawl = filmData.opening_crawl;
    film.director = filmData.director;
    film.producer = filmData.producer;
    film.releaseDate = filmData.release_date;

    film.characters = filmData.characters;
    film.planets = filmData.planets;
    film.starships = filmData.starships;
    film.vehicles = filmData.vehicles;
    film.species = filmData.species;

    film.createdAt = new Date(filmData.created);
    film.modifiedAt = new Date(filmData.edited);
    film.url = filmData.url;

    return film;
  }

  public mapToSpeciesEntity(speciesData: any): SpeciesEntity {
    const species = new SpeciesEntity();
    species.name = speciesData.name;
    species.classification = speciesData.classification;
    species.designation = speciesData.designation;
    species.averageHeight = speciesData.average_height;
    species.skinColors = speciesData.skin_colors;
    species.hairColors = speciesData.hair_colors;
    species.eyeColors = speciesData.eye_colors;
    species.averageLifespan = speciesData.average_lifespan;
    species.homeworld = speciesData.homeworld;
    species.language = speciesData.language;
    species.people = speciesData.people;
    species.films = speciesData.films;
    species.createdAt = new Date(speciesData.created);
    species.modifiedAt = new Date(speciesData.edited);
    species.url = speciesData.url;
    return species;
  }


  public mapToVehicleEntity(vehicleData: any): VehicleEntity {
    const vehicle = new VehicleEntity();
    vehicle.name = vehicleData.name;
    vehicle.model = vehicleData.model;
    vehicle.manufacturer = vehicleData.manufacturer;
    vehicle.costInCredits = vehicleData.cost_in_credits;
    vehicle.length = vehicleData.length;
    vehicle.maxAtmospheringSpeed = vehicleData.max_atmosphering_speed;
    vehicle.crew = vehicleData.crew;
    vehicle.passengers = vehicleData.passengers;
    vehicle.cargoCapacity = vehicleData.cargo_capacity;
    vehicle.consumables = vehicleData.consumables;
    vehicle.vehicleClass = vehicleData.vehicle_class;
    vehicle.pilots = vehicleData.pilots;
    vehicle.films = vehicleData.films;
    vehicle.createdAt = new Date(vehicleData.created);
    vehicle.modifiedAt = new Date(vehicleData.edited);
    vehicle.url = vehicleData.url;
    return vehicle;
  }

  public mapToStarshipEntity(starshipData: any): StarshipEntity {
    const starship = new StarshipEntity();
    starship.name = starshipData.name;
    starship.model = starshipData.model;
    starship.manufacturer = starshipData.manufacturer;
    starship.costInCredits = starshipData.cost_in_credits;
    starship.length = starshipData.length;
    starship.maxAtmospheringSpeed = starshipData.max_atmosphering_speed;
    starship.crew = starshipData.crew;
    starship.passengers = starshipData.passengers;
    starship.cargoCapacity = starshipData.cargo_capacity;
    starship.consumables = starshipData.consumables;
    starship.hyperdriveRating = starshipData.hyperdrive_rating;
    starship.MGLT = starshipData.MGLT;
    starship.starshipClass = starshipData.starship_class;
    starship.pilots = starshipData.pilots;
    starship.films = starshipData.films;
    starship.createdAt = new Date(starshipData.created);
    starship.modifiedAt = new Date(starshipData.edited);
    starship.url = starshipData.url;
    return starship;
  }

  public mapToPlanetEntity(planetData: any): PlanetEntity {
    const planet = new PlanetEntity();
    planet.name = planetData.name;
    planet.rotationPeriod = planetData.rotation_period;
    planet.orbitalPeriod = planetData.orbital_period;
    planet.diameter = planetData.diameter;
    planet.climate = planetData.climate;
    planet.gravity = planetData.gravity;
    planet.terrain = planetData.terrain;
    planet.surfaceWater = planetData.surface_water;
    planet.population = planetData.population;
    planet.residents = planetData.residents;
    planet.films = planetData.films;
    planet.createdAt = new Date(planetData.created);
    planet.modifiedAt = new Date(planetData.edited);
    planet.url = planetData.url;
    return planet;
  }

  public updateOrCreateStarships(existingStarships: StarshipEntity[], starshipData: any[]): StarshipEntity[] {
    const existingStarshipsObj = existingStarships.reduce((obj, starship) => {
      obj[starship.url] = starship;
      return obj;
    }, {});

    const updatedStarships = starshipData.map((starshipData: any) => {
      const existingStarship = existingStarshipsObj[starshipData.url];
      if (existingStarship) {
        Object.assign(existingStarship, this.mapToStarshipEntity(starshipData));
        return existingStarship;
      } else {
        return this.mapToStarshipEntity(starshipData);
      }
    });

    return updatedStarships;
  }

  public updateOrCreateFilms(existingFilms: FilmEntity[], filmData: any[]): FilmEntity[] {
    const existingFilmsObj = existingFilms.reduce((obj, film) => {
      obj[film.url] = film;
      return obj;
    }, {});

    const updatedFilms = filmData.map((filmData: any) => {
      const existingFilm = existingFilmsObj[filmData.url];
      if (existingFilm) {
        Object.assign(existingFilm, this.mapToFilmEntity(filmData));
        return existingFilm;
      } else {
        return this.mapToFilmEntity(filmData);
      }
    });

    return updatedFilms;
  }
  public updateOrCreatePlanets(existingPlanets: PlanetEntity[], planetData: any[]): PlanetEntity[] {
    const existingPlanetsObj = existingPlanets.reduce((obj, planet) => {
      obj[planet.url] = planet;
      return obj;
    }, {});

    const updatedPlanets = planetData.map((planetData: any) => {
      const existingPlanet = existingPlanetsObj[planetData.url];
      if (existingPlanet) {
        Object.assign(existingPlanet, this.mapToPlanetEntity(planetData));
        return existingPlanet;
      } else {
        return this.mapToPlanetEntity(planetData);
      }
    });

    return updatedPlanets;
  }
  public updateOrCreateSpecies(existingSpecies: SpeciesEntity[], speciesData: any[]): SpeciesEntity[] {
    const existingSpeciesObj = existingSpecies.reduce((obj, species) => {
      obj[species.url] = species;
      return obj;
    }, {});

    const updatedSpecies = speciesData.map((speciesData: any) => {
      const existingSpecie = existingSpeciesObj[speciesData.url];
      if (existingSpecie) {
        Object.assign(existingSpecie, this.mapToSpeciesEntity(speciesData));
        return existingSpecie;
      } else {
        return this.mapToSpeciesEntity(speciesData);
      }
    });

    return updatedSpecies;
  }
  public updateOrCreateVehicles(existingVehicles: VehicleEntity[], vehicleData: any[]): VehicleEntity[] {
    const existingVehiclesObj = existingVehicles.reduce((obj, vehicle) => {
      obj[vehicle.url] = vehicle;
      return obj;
    }, {});

    const updatedVehicles = vehicleData.map((vehicleData: any) => {
      const existingVehicle = existingVehiclesObj[vehicleData.url];
      if (existingVehicle) {
        Object.assign(existingVehicle, this.mapToVehicleEntity(vehicleData));
        return existingVehicle;
      } else {
        return this.mapToVehicleEntity(vehicleData);
      }
    });

    return updatedVehicles;
  }


}
