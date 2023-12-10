import { SpeciesEntity } from "../../../../data-access-layer/star-wars-entity/entities/specie.entity";

export class SpeciesResponseDTO {
  id: string;
  name: string;
  classification: string;
  designation: string;
  averageHeight: string;
  skinColors: string;
  hairColors: string;
  eyeColors: string;
  averageLifespan: string;
  homeworld: string | null;
  language: string;
  people: string[];
  films: string[];
  createdAt: Date;
  modifiedAt: Date;
  url: string;


  constructor(species: SpeciesEntity) {
    this.id = species.id;
    this.name = species.name;
    this.classification = species.classification;
    this.designation = species.designation;
    this.averageHeight = species.averageHeight;
    this.skinColors = species.skinColors;
    this.hairColors = species.hairColors;
    this.eyeColors = species.eyeColors;
    this.averageLifespan = species.averageLifespan;
    this.homeworld = species.homeworld;
    this.language = species.language;
    this.people = species.people;
    this.films = species.films;
    this.createdAt = species.createdAt;
    this.modifiedAt = species.modifiedAt;
    this.url = species.url;
  }
}
