export interface purchaseTicketDto {
    purchaserId: string,    //UUID
    flightId: number,
    tickets: TicketItem[]
}

export interface TicketItem {
    seatClass: string,
    seatNumber: string,
    passengerName: string,
    flightTime: Date,
}