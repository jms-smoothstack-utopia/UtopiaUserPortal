import { Address } from "./address";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string, 
    addresses: Address[]
    addrLine1: string,
    addrLine2: string,
    city: string,
    state: string,
    zipcode: string
}