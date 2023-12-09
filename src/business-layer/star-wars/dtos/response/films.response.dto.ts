export class FilmResponseDTO {
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
    created: string;
    edited: string;
    url: string;

    constructor(film: any) {
        this.title = film.title;
        this.episodeId = film.episode_id;
        this.openingCrawl = film.opening_crawl;
        this.director = film.director;
        this.producer = film.producer;
        this.releaseDate = film.release_date;
        this.characters = film.characters;
        this.planets = film.planets;
        this.starships = film.starships;
        this.vehicles = film.vehicles;
        this.species = film.species;
        this.created = film.created;
        this.edited = film.edited;
        this.url = film.url;
    }
}
