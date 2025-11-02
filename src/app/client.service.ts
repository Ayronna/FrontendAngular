import { HttpClient, HttpParams } from '@angular/common/http';

export class ClientService {
  private base = 'http://localhost:3000/clients';

  constructor(protected http: HttpClient) {}

  // Accept optional filters. `q` is a json-server full-text search;
  // adjust param names if your backend expects something else.
  getClients(filters?: { name?: string; isActive?: boolean }) {
    let params = new HttpParams();
    if (filters?.name) {
      params = params.set('q', filters.name);
    }
    if (typeof filters?.isActive === 'boolean') {
      params = params.set('isActive', String(filters.isActive));
    }
    return this.http.get(this.base, { params });
  }

  createClient(client: any) {
    return this.http.post(`${this.base}/`, client);
  }

  updateClient(id: number | string, client: any) {
    return this.http.put(`${this.base}/${id}`, client);
  }

  deleteClient(id: number | string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
