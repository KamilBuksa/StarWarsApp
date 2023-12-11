import { Injectable } from '@nestjs/common';
import { FilmRepositoryService } from '../../../data-access-layer/star-wars-entity/services/film.repository.service';
import { PlanetRepositoryService } from '../../../data-access-layer/star-wars-entity/services/planet.repository.service';
import { SpeciesRepositoryService } from '../../../data-access-layer/star-wars-entity/services/species.repository.service';
import { StarshipRepositoryService } from '../../../data-access-layer/star-wars-entity/services/starship.repository.service';
import { VehicleRepositoryService } from '../../../data-access-layer/star-wars-entity/services/vehicle.repository.service';
import { ApiModel } from '../../../models/api.model';
import { StarWarsFilmsQuery } from '../dtos/request/films.query.dto';
import { StarWarsPlanetsQuery } from '../dtos/request/planets.query.dto';
import { StarWarsSpeciesQuery } from '../dtos/request/species.query.dto';
import { StarWarsStarshipsQuery } from '../dtos/request/starships.query.dto';
import { StarWarsVehiclesQuery } from '../dtos/request/vehicles.query.dto';
import { FilmResponseDTO } from '../dtos/response/films.response.dto';
import { PlanetResponseDTO } from '../dtos/response/planets.response.dto';
import { SpeciesResponseDTO } from '../dtos/response/species.response.dto';
import { StarshipResponseDTO } from '../dtos/response/starships.response.dto';
import { VehicleResponseDTO } from '../dtos/response/vehicles.response.dto';
import { StarWarsApiService } from './star-wars-api.service';
import { StarWarsHelpersService } from './star-wars-helpers.service';
import { ApiUniqueWordsResponse } from '../dtos/response/api-unique-words.response.dto';

@Injectable()
export class StarWarsService {
  constructor(
    private readonly StarWarsHelpersService: StarWarsHelpersService,
    private readonly filmRepository: FilmRepositoryService,
    private readonly speciesRepository: SpeciesRepositoryService,
    private readonly vehicleRepository: VehicleRepositoryService,
    private readonly starshipRepository: StarshipRepositoryService,
    private readonly planetRepository: PlanetRepositoryService,
    private readonly starWarsApiService: StarWarsApiService,

  ) { }

  async getFilms(
    query: StarWarsFilmsQuery,
  ): Promise<ApiModel.PaginatedResponse<FilmResponseDTO>> {
    let api = `https://swapi.dev/api/films`;

    const { results } = await this.starWarsApiService.fetchDataFromSwApi(api);
    const existingFilms = await this.filmRepository.find();
    const updatedFilms = this.StarWarsHelpersService.updateOrCreateFilms(existingFilms, results);
    await this.filmRepository.saveMany(updatedFilms);

    const response = await this.filmRepository.findAllPaginatedFilms(query);

    const data = []

    for await (const film of response.data) {
      data.push(new FilmResponseDTO(film));
    }


    return {
      ...response,
      data,
    };
  }

  async getFilmDetails(
    id: number
  ): Promise<FilmResponseDTO> {
    let api = `https://swapi.dev/api/films/${id}/`;

    let result = await this.filmRepository.findOneByApiId(id);
    if (!result) {
      // ask api
      const filmApi = await this.starWarsApiService.fetchDataFromSwApi(api);
      if (filmApi) {
        const updatedFilms = this.StarWarsHelpersService.updateOrCreateFilms([], [filmApi], id);
        [result] = await this.filmRepository.saveMany(updatedFilms);
      }
    }
    return new FilmResponseDTO(result);
  }

  async getSpecies(
    query: StarWarsSpeciesQuery,
  ): Promise<ApiModel.PaginatedResponse<SpeciesResponseDTO>> {
    let api = `https://swapi.dev/api/species`;

    const { results } = await this.starWarsApiService.fetchDataFromSwApi(api);

    const existingSpecies = await this.speciesRepository.find();
    const updatedSpecies = this.StarWarsHelpersService.updateOrCreateSpecies(existingSpecies, results);
    await this.speciesRepository.saveMany(updatedSpecies);

    const response = await this.speciesRepository.findAllPaginatedSpecies(query);

    const data = [];

    for await (const species of response.data) {
      data.push(new SpeciesResponseDTO(species));
    }

    return {
      ...response,
      data,
    };
  }

  async getSpeciesDetails(
    id: number
  ): Promise<SpeciesResponseDTO> {
    let api = `https://swapi.dev/api/species/${id}/`;

    let result = await this.speciesRepository.findOneByApiId(id);
    if (!result) {
      // ask api
      const speciesApi = await this.starWarsApiService.fetchDataFromSwApi(api);
      if (speciesApi) {
        const updatedSpecies = this.StarWarsHelpersService.updateOrCreateSpecies([], [speciesApi], id);
        [result] = await this.speciesRepository.saveMany(updatedSpecies);
      }
    }
    return new SpeciesResponseDTO(result);
  }


  async getVehicles(
    query: StarWarsVehiclesQuery,
  ): Promise<ApiModel.PaginatedResponse<VehicleResponseDTO>> {
    let api = `https://swapi.dev/api/vehicles`;

    const { results } = await this.starWarsApiService.fetchDataFromSwApi(api);

    const existingVehicles = await this.vehicleRepository.find();
    const updatedVehicles = this.StarWarsHelpersService.updateOrCreateVehicles(existingVehicles, results);
    await this.vehicleRepository.saveMany(updatedVehicles);


    const response = await this.vehicleRepository.findAllPaginatedVehicles(query);

    const data = [];

    for await (const vehicle of response.data) {
      data.push(new VehicleResponseDTO(vehicle));
    }

    return {
      ...response,
      data,
    };

  }
  async getVehicleDetails(
    id: number
  ): Promise<VehicleResponseDTO> {
    let api = `https://swapi.dev/api/vehicles/${id}/`;

    let result = await this.vehicleRepository.findOneByApiId(id);
    if (!result) {
      // ask api
      const vehicleApi = await this.starWarsApiService.fetchDataFromSwApi(api);
      if (vehicleApi) {
        const updatedVehicles = this.StarWarsHelpersService.updateOrCreateVehicles([], [vehicleApi], id);
        [result] = await this.vehicleRepository.saveMany(updatedVehicles);
      }
    }
    return new VehicleResponseDTO(result);
  }

  async getStarships(
    query: StarWarsStarshipsQuery,
  ): Promise<ApiModel.PaginatedResponse<StarshipResponseDTO>> {
    let api = `https://swapi.dev/api/starships`;

    const { results } = await this.starWarsApiService.fetchDataFromSwApi(api);

    const existingStarships = await this.starshipRepository.find();
    const updatedStarships = this.StarWarsHelpersService.updateOrCreateStarships(existingStarships, results);
    await this.starshipRepository.saveMany(updatedStarships);

    const response = await this.starshipRepository.findAllPaginatedStarships(query);

    const data = [];

    for await (const starship of response.data) {
      data.push(new StarshipResponseDTO(starship));
    }

    return {
      ...response,
      data,
    };

  }
  async getStarshipDetails(
    id: number
  ): Promise<StarshipResponseDTO> {
    let api = `https://swapi.dev/api/starships/${id}/`;

    let result = await this.starshipRepository.findOneByApiId(id);
    if (!result) {
      // ask api
      const starshipApi = await this.starWarsApiService.fetchDataFromSwApi(api);
      if (starshipApi) {
        const updatedStarships = this.StarWarsHelpersService.updateOrCreateStarships([], [starshipApi], id);
        [result] = await this.starshipRepository.saveMany(updatedStarships);
      }
    }
    return new StarshipResponseDTO(result);
  }

  async getPlanets(
    query: StarWarsPlanetsQuery,
  ): Promise<ApiModel.PaginatedResponse<PlanetResponseDTO>> {
    let api = `https://swapi.dev/api/planets`;

    const { results } = await this.starWarsApiService.fetchDataFromSwApi(api);

    const existingPlanets = await this.planetRepository.find();
    const updatedPlanets = this.StarWarsHelpersService.updateOrCreatePlanets(existingPlanets, results);
    await this.planetRepository.saveMany(updatedPlanets);


    const response = await this.planetRepository.findAllPaginatedPlanets(query);

    const data = [];

    for await (const planet of response.data) {
      data.push(new PlanetResponseDTO(planet));
    }

    return {
      ...response,
      data,
    };

  }
  async getPlanetDetails(
    id: number
  ): Promise<PlanetResponseDTO> {
    let api = `https://swapi.dev/api/planets/${id}/`;

    let result = await this.planetRepository.findOneByApiId(id);
    if (!result) {
      // ask api
      const planetApi = await this.starWarsApiService.fetchDataFromSwApi(api);
      if (planetApi) {
        const updatedPlanets = this.StarWarsHelpersService.updateOrCreatePlanets([], [planetApi], id);
        [result] = await this.planetRepository.saveMany(updatedPlanets);
      }
    }
    return new PlanetResponseDTO(result);
  }


  async getUniqueWordsAndMostFrequentCharacter(): Promise<ApiUniqueWordsResponse> {

    // Get the opening crawls from all films
    const films = await this.filmRepository.find();
    const openingCrawls = films.map((film) => film.openingCrawl);

    // Task A: Extract unique word pairs and count their occurrences
    const uniqueWordPairsAndOccurrences = this.extractUniqueWordPairs(openingCrawls);

    // Get the names of characters

    const characterUrls = films.map(film => film.characters).flat();

    const namesOfFilteredPeople = await this.fetchAndFilterPeople(characterUrls);

    // Task B: Find the characters with the most occurrences
    const mostFrequentCharacters = this.findMostFrequentCharacter(openingCrawls, namesOfFilteredPeople);

    return {
      mostFrequentCharacters,
      uniqueWordPairsAndOccurrences,
    };
  }

  private extractUniqueWordPairs(openingCrawls: string[]): Record<string, number> {
    const wordPairCounts: Record<string, number> = {};

    openingCrawls.forEach((crawl) => {
      const words = crawl.split(/[\p{Cc}\p{Cf}\s]+/gu).filter(Boolean);
      for (let i = 0; i < words.length - 1; i++) {
        const wordPair = `${words[i]} ${words[i + 1]}`;
        wordPairCounts[wordPair] = (wordPairCounts[wordPair] || 0) + 1;
      }
    });

    return wordPairCounts;
  }



  async fetchAndFilterPeople(urls: string[]) {
    try {
      // Fetch data about all people from the API
      const { results: allPeople } = await this.starWarsApiService.fetchDataFromSwApi("https://swapi.dev/api/people/");

      // Filter only the people from the unique list of URLs
      const filteredPeople = allPeople.filter(person => urls.includes(person.url));

      // Create a list of names of filtered people
      const namesOfFilteredPeople = filteredPeople.map(person => person.name);
      console.log(namesOfFilteredPeople);
      return namesOfFilteredPeople;
    } catch (error) {
      console.error('An error occurred while fetching data from the API:', error);
      throw error;
    }
  };



  private findMostFrequentCharacter(openingCrawls: string[], namesOfFilteredPeople: string[]): Record<string, number> {
    const characterCounts: Record<string, number> = {};

    openingCrawls.forEach((crawl) => {
      namesOfFilteredPeople.forEach((characterName) => {
        const regex = new RegExp(`\\b${characterName}\\b`, 'gi');
        const characterMatches = crawl.match(regex);
        if (characterMatches) {
          characterCounts[characterName] = (characterCounts[characterName] || 0) + characterMatches.length;
        }
      });
    });

    return characterCounts;
  }



}
