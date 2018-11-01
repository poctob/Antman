export class Project {
    constructor(
        public id: number,
        public type: string,
        public documentType: string,
        public received: Date,
        public started: Date,
        public mailed: Date,
        public status: string,
        public price: number,
        public postage: number,
        public discount: number,
        public total: number,
        public invoiceDate: Date,
        public paymentDate: Date,
        public paymentType: string,
        public translator: string,
        public sourceLanguage: string,
        public destinationLanguage: string
    ) {}
}