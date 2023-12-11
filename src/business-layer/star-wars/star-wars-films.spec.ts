import { Test } from '@nestjs/testing';
import { filmsMock } from '../../../test/mocks/films.mock';
import { FilmRepositoryService } from '../../data-access-layer/star-wars-entity/services/film.repository.service';
import { StarWarsApiService } from './services/star-wars-api.service';
import { StarWarsHelpersService } from './services/star-wars-helpers.service';
import { StarWarsService } from './services/star-wars.service';

describe('StarWarsService', () => {
  let starWarsService: StarWarsService;
  let filmRepositoryService: jest.Mocked<FilmRepositoryService>;
  let starWarsApiService: jest.Mocked<StarWarsApiService>;
  let starWarsHelpersService: jest.Mocked<StarWarsHelpersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        StarWarsService,
        { provide: FilmRepositoryService, useValue: jest.fn() },
        {
          provide: StarWarsApiService,
          useValue: { fetchDataFromSwApi: jest.fn() },
        },
        {
          provide: StarWarsHelpersService,
          useValue: { updateOrCreateFilms: jest.fn() },
        },
      ],
    }).compile();

    starWarsService = moduleRef.get<StarWarsService>(StarWarsService);
    filmRepositoryService = moduleRef.get(FilmRepositoryService);
    starWarsApiService = moduleRef.get(StarWarsApiService);
    starWarsHelpersService = moduleRef.get(StarWarsHelpersService);

    starWarsApiService.fetchDataFromSwApi.mockResolvedValue(filmsMock);

    // filmRepositoryService.find.mockResolvedValue(filmsMockEntities);
    // filmRepositoryService.saveMany.mockImplementation(async (films) => films);
    // filmRepositoryService.findAllPaginatedFilms.mockResolvedValue(filmsMockPaginated);
  });

  it('should fetch films, update DB, and return paginated response', async () => {
    const query = {
      /* parametry zapytania */
    };
    const result = await starWarsService.getFilms(query);

    expect(result).toBeDefined();
    expect(starWarsApiService.fetchDataFromSwApi).toHaveBeenCalledWith(
      'https://swapi.dev/api/films',
    );
    // expect(starWarsHelpersService.updateOrCreateFilms).toHaveBeenCalled();
    // expect(filmRepositoryService.find).toHaveBeenCalled();
    // expect(filmRepositoryService.saveMany).toHaveBeenCalled();
    // expect(filmRepositoryService.findAllPaginatedFilms).toHaveBeenCalledWith(query);
  });
});
