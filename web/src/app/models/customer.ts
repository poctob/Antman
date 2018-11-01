export class Customer {
    constructor(
        public CustomerId: number,
        public name: string,
        public email?: string,
        public phone?: string
    ) {}
}