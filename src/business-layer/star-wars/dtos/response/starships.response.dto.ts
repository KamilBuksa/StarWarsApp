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
  created: string;
  edited: string;
  url: string;

  constructor(starship: any) {
    this.name = starship.name;
    this.model = starship.model;
    this.manufacturer = starship.manufacturer;
    this.costInCredits = starship.cost_in_credits;
    this.length = starship.length;
    this.maxAtmospheringSpeed = starship.max_atmosphering_speed;
    this.crew = starship.crew;
    this.passengers = starship.passengers;
    this.cargoCapacity = starship.cargo_capacity;
    this.consumables = starship.consumables;
    this.hyperdriveRating = starship.hyperdrive_rating;
    this.MGLT = starship.MGLT;
    this.starshipClass = starship.starship_class;
    this.pilots = starship.pilots;
    this.films = starship.films;
    this.created = starship.created;
    this.edited = starship.edited;
    this.url = starship.url;
  }
}
