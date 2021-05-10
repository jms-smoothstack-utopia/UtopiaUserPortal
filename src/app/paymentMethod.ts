export interface PaymentMethod {
    id: number,
    ownerId: string,    //UUID for customer
    stripeId: string,
    notes: string,
    brand: string,
    expMonth: number,
    expYear: number,
    last4: string
}