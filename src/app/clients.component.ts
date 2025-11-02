import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ClientService } from "./client.service";

@Component({
  selector: "app-clients",
  template: `
    <div class="create-client">
      <button style="font-size: 16px" (click)="showNewClientForm = true">Create client</button>
    </div>

    <div class="clients">
      <div class="new-client" *ngIf="showNewClientForm">
        <h3>Create new client</h3>
        <input
          type="text"
          placeholder="First name"
          [(ngModel)]="newClient.firstName"
        />
        <input
          type="text"
          placeholder="Last name"
          [(ngModel)]="newClient.lastName"
        />
        <input
          type="date"
          placeholder="Birthdate"
          [(ngModel)]="newClient.birthdate"
        />
        <label style="display:flex; align-items:center; gap:8px; padding-top:8px">
          <input type="checkbox" [(ngModel)]="newClient.isActive" />
          Active
        </label>
        <div style="padding-top:8px">
          <button (click)="createClient()">Create client</button>
          <button (click)="showNewClientForm = false" style="margin-left:8px">Cancel</button>
        </div>
      </div>

      <div class="clients-filter">
        <h3>Filter clients</h3>
        <div class="flex-wrapper">
          <input type="text" placeholder="Filter by clients name" [(ngModel)]="filterText" (input)="applyFilter()" />
          <div class="filter-checkbox-wrapper">
            <input id="filterCheckbox" type="checkbox" [(ngModel)]="filterActive" (change)="applyFilter()" /> 
            <span style="padding-left: 8px"><label for="filterCheckbox">Filter by active state</label></span>
          </div>
        </div>
      </div>

      <div class="client-card" *ngFor="let client of filteredClients">
        <div *ngIf="editingClientId !== client.id">
          <span>
            {{ client.firstName }} {{ client.lastName }} -
            {{ client.birthdate }} - {{ client.isActive }}
          </span>
          <span>
            <a (click)="startEdit(client)" style="cursor:pointer">Edit</a>
            <a (click)="deleteClient(client)" style="padding-left: 8px; cursor:pointer; color:darkred">Delete</a>
          </span>
        </div>

        <div *ngIf="editingClientId === client.id" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap">
          <input type="text" [(ngModel)]="editClientCopy.firstName" />
          <input type="text" [(ngModel)]="editClientCopy.lastName" />
          <input type="date" [(ngModel)]="editClientCopy.birthdate" />
          <label style="display:flex; align-items:center; gap:8px">
            <input type="checkbox" [(ngModel)]="editClientCopy.isActive" />
            Active
          </label>
          <button (click)="saveEdit()">Save</button>
          <button (click)="cancelEdit()" style="margin-left:4px">Cancel</button>
        </div>
      </div>
    </div>
  `,
  standalone: false,
  styles: [
    `
      .filter-checkbox-wrapper {
        padding-left: 20px;
        display: flex;
        align-items: center;
      }
      .flex-wrapper {
        display: flex;
        justify-content: flex-start;
      }
      .create-client {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 16px;
      }
      .clients {
        padding: 16px;
      }
      .new-client {
        padding: 8px 32px;
        border: 1px solid #006175;
        margin-bottom: 16px;
      }
      .clients-filter {
        padding: 8px 32px;
        border: 1px solid #006175;
        margin-bottom: 16px;
      }
      
      #filterCheckbox {
        width: 20px;
        height: 20px;
        padding-left: 40px
      }

      .client-card {
        display:flex;
        justify-content:space-between;
        padding:8px 12px;
        border:1px solid #ddd;
        margin-bottom:8px;
        border-radius:4px;
        align-items:center;
      }

      .client-card input[type="text"], .client-card input[type="date"] {
        padding:4px 6px;
      }
    `,
  ],
})
export class ClientsComponent {
  showNewClientForm: boolean = false;
  newClient: any = {};
  clients: any[] = [];
  filteredClients: any[] = [];
  filterText: string = "";
  filterActive: boolean = false;

  editingClientId: number | null = null;
  editClientCopy: any = {};

  clientService;

  constructor(private http: HttpClient) {
    this.clientService = new ClientService(this.http);
    this.clientService.getClients().subscribe((data: any) => {
      this.clients = Array.isArray(data) ? data : [];
      this.applyFilter();
    });
  }

  createClient() {
    // create new client
    this.clientService.createClient(this.newClient).subscribe((data: any) => {
      this.clients.push(data);
      this.newClient = {};
      this.showNewClientForm = false;
      this.applyFilter();
    });
  }

  startEdit(client: any) {
    this.editingClientId = client.id;
    // shallow copy so editing doesn't mutate original until save
    this.editClientCopy = { ...client };
  }

  saveEdit() {
    if (this.editingClientId == null) return;
    this.clientService.updateClient(this.editingClientId, this.editClientCopy).subscribe((updated: any) => {
      // update local list
      const idx = this.clients.findIndex((c) => c.id === this.editingClientId);
      if (idx > -1) {
        this.clients[idx] = updated;
      }
      this.editingClientId = null;
      this.editClientCopy = {};
      this.applyFilter();
    });
  }

  cancelEdit() {
    this.editingClientId = null;
    this.editClientCopy = {};
  }

  deleteClient(client: any) {
    if (!confirm(`Delete client ${client.firstName} ${client.lastName}?`)) return;
    this.clientService.deleteClient(client.id).subscribe(() => {
      this.clients = this.clients.filter((c) => c.id !== client.id);
      this.applyFilter();
    });
  }

  applyFilter() {
    const text = this.filterText.trim().toLowerCase();
    this.filteredClients = this.clients.filter((c) => {
      const matchesText =
        !text ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(text) ||
        (c.firstName && c.firstName.toLowerCase().includes(text)) ||
        (c.lastName && c.lastName.toLowerCase().includes(text));
      const matchesActive = !this.filterActive || !!c.isActive;
      return matchesText && matchesActive;
    });
  }
}
