import { Address } from "./address";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string, 
    addresses: Address[]
}