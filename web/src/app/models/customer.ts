export class Customer {
    constructor(
        public CustomerId: number,
        public name: string,
        public isActive: boolean = true,
        public email?: string,
        public phone?: string
    ) {}
}