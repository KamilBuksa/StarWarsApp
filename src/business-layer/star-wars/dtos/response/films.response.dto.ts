import { FilmEntity } from '../../../../data-access-layer/star-wars-entity/entities/film.entity';

export class FilmResponseDTO {
  id: string;
  title: string;
  episodeId: number;
  openingCrawl: string;
  director: string;
  producer: string;
  releaseDate: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  createdAt: Date;
  modifiedAt: Date;
  url: string;

  constructor(film: FilmEntity) {
    this.id = film.id;
    this.title = film.title;
    this.episodeId = film.episodeId;
    this.openingCrawl = film.openingCrawl;
    this.director = film.director;
    this.producer = film.producer;
    this.releaseDate = film.releaseDate;
    this.characters = film.characters;
    this.planets = film.planets;
    this.starships = film.starships;
    this.vehicles = film.vehicles;
    this.species = film.species;
    this.createdAt = film.createdAt;
    this.modifiedAt = film.modifiedAt;
    this.url = film.url;
  }
}
