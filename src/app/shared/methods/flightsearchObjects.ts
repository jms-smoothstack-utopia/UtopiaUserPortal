// File created for shared enums and interfaces
export enum SortMethod {
    EXPENSIVE = "expensive",
    CHEAPEST = "cheapest",
    MOST_RECENT = "most recent",
    OLDEST = "oldest",
    LOW_HOPS = "Low number of hops",
    HIGH_HOPS = "High number of hops",
    SHORTEST_DURATION = "Shortest duration",
    LONGEST_DURATION = "Longest duration"
}

export enum TripType{
    ONE_WAY = "One-Way",
    ROUND_TRIP = "Round-Trip"
}

export enum StopType{
    NON_STOP = "Non-Stop",
    MULTIHOP = "Multihop"
}

export enum PersonType{
    ADULT = "Adult",
    CHILDREN = "Children"
}

export enum WhereType{
    FROM = "from",
    TO = "to"
}

export interface flight{
    actualFlights: any,
    airplane: any,
    basePrice: any,
    business: number,
    cities: string[],
    creationTime: string,
    destination: any,
    duration: string,
    durationInMilliseconds: number,
    economy: number,
    flightID: any,
    fromDateTime: string,
    iataId: string,
    loyaltyPoints:number, 
    multihop: boolean,
    numberOfHops: number,
    origin: any,
    route: string,
    seats: {}[],
    toDateTime: string
}

export enum FlightSeatType{
    ECONOMY = "economy",
    BUSINESS = "business"
}

export interface seatAvailable{
    flightId: number,
    economy: number,
    business: number,
}

export interface bookingInfo{
    flightId: number,
    flight:any,
    numberOfPeople: number,
    seatClass: string,
}