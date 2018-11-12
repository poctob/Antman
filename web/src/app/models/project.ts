export interface ProjectsTableItem {
  CustomerId: number,
  CustomerName: string,
  ProjectId: number,
  type: string,
  documentType: string,
  received: Date,
  started: Date,
  mailed: Date,
  status: string,
  price: number,
  postage: number,
  discount: number,
  total: number,
  invoiceDate: Date,
  paymentDate: Date,
  paymentType: string,
  translator: string,
  sourceLanguage: string,
  destinationLanguage: string
}

export interface CustomerProjects {
    CustomerId: number,
    name: string,
    projects: ProjectsTableItem[]
}
  
  