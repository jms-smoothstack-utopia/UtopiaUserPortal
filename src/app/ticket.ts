export interface Ticket {
  id: number;
  flightId: number;
  flightTime: Date;
  purchaserId: string; //UUID
  passengerName: string;
  seatClass: string;
  seatNumber: string;
  status: string; //TicketStatus enum
  statusPrettyPrint: string;
  timePrettyPrint: string;
}

export enum TicketsList {
  HISTORY,
  UPCOMING
}
