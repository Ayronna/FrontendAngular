import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private base = 'http://localhost:3000/clients';

  constructor(protected http: HttpClient) {}

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
    return this.http.post("http://localhost:3000/clients/", client);
  }

  updateClient(id: number | string, client: any) {
    return this.http.put(`http://localhost:3000/clients/${id}`, client);
  }

  deleteClient(id: number | string) {
    return this.http.delete(`http://localhost:3000/clients/${id}`);
  }
}
