import { HttpClient } from "@angular/common/http";

export class ClientService {
  constructor(protected http: HttpClient) {}

  getClients() {
    return this.http.get("http://localhost:3000/clients");
  }

  createClient(client: any) {
    return this.http.post("http://localhost:3000/clients/", client);
  }

  updateClient(id: number | string, client: any) {
    return this.http.put(`http://localhost:3000/clients/${id}`, client);
  }

  deleteClient(id: number | string) {
    return this.http.delete(`http://localhost:3000/clients/${id}`);
  }
}
