export class VehicleResponseDTO {
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
    vehicleClass: string;
    pilots: string[];
    films: string[];
    created: string;
    edited: string;
    url: string;

    constructor(vehicle: any) {
        this.name = vehicle.name;
        this.model = vehicle.model;
        this.manufacturer = vehicle.manufacturer;
        this.costInCredits = vehicle.cost_in_credits;
        this.length = vehicle.length;
        this.maxAtmospheringSpeed = vehicle.max_atmosphering_speed;
        this.crew = vehicle.crew;
        this.passengers = vehicle.passengers;
        this.cargoCapacity = vehicle.cargo_capacity;
        this.consumables = vehicle.consumables;
        this.vehicleClass = vehicle.vehicle_class;
        this.pilots = vehicle.pilots;
        this.films = vehicle.films;
        this.created = vehicle.created;
        this.edited = vehicle.edited;
        this.url = vehicle.url;
    }
}
