
export interface Flight {
    id: number,
    possibleLoyaltyPoints: number,
    origin: Airport,
    destination: Airport,
    airplane: Airplane,
    seats: Seat[],
    creationDateTime: Date,
    approximateDateTimeStart: Date,
    approximateDateTimeEnd: Date,
    flightActive: boolean
}

interface Airport {
    iataId: string,
    name: string,
    streetAddress: string,
    city: string,
    state: string,
    zipcode: string,
    servicingArea: ServicingArea
}

interface ServicingArea {
    id: number,
    areaName: string
}

interface Airplane {
    id: number,
    name: string,
    seatConfigurations: SeatConfiguration[]
}

interface SeatConfiguration {
    id: number,
    seatClass: string,  //SeatClass enum
    numRows: number,
    numSeatsPerRow: number
}

interface Seat {
    id: string,
    seatRow: number,
    seatColumn: string,
    seatClass: string,  //SeatClass enum
    seatStatus: string, //SeatStatus enum
    price: number       //BigDecimal; check to see if TS handles this properly
}