export class SpeciesResponseDTO {
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
    created: string;
    edited: string;
    url: string;

    constructor(species: any) {
        this.name = species.name;
        this.classification = species.classification;
        this.designation = species.designation;
        this.averageHeight = species.average_height;
        this.skinColors = species.skin_colors;
        this.hairColors = species.hair_colors;
        this.eyeColors = species.eye_colors;
        this.averageLifespan = species.average_lifespan;
        this.homeworld = species.homeworld;
        this.language = species.language;
        this.people = species.people;
        this.films = species.films;
        this.created = species.created;
        this.edited = species.edited;
        this.url = species.url;
    }
}
