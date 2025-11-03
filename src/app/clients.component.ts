import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ClientService } from "./client.service";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-clients",
  template: `
    <div class="create-client">
      <app-button (click)="showNewClientForm = !showNewClientForm"> Create client</app-button>
    </div>

    <new-client-form
      *ngIf="showNewClientForm"
      [client]="newClient"
      (create)="createClient($event)"
      (cancel)="showNewClientForm = false"
    ></new-client-form>

    <div class="clients">
      <div class="clients-filter">
        <h3>Filter clients</h3>
        <div class="flex-wrapper">
          <input
            type="text"
            placeholder="Type a name"
            [(ngModel)]="filterText"
            (ngModelChange)="onNameChanged($event)"
          />
          <div class="filter-checkbox-wrapper">
            <input
              id="filterCheckbox"
              type="checkbox"
              [(ngModel)]="filterActive"
              (change)="onActiveChanged()"
            />
            <span style="padding-left: 8px"><label for="filterCheckbox">Show only active clients</label></span>
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
  styles: [],
})
export class ClientsComponent {
  showNewClientForm: boolean = false;
  newClient: any = {
    firstName: "",
    lastName: "",
    birthdate: "",
    isActive: false,
  };
  clients: any[] = [];
  filteredClients: any[] = [];
  filterText: string = "";
  filterActive: boolean = false;

  editingClientId: number | null = null;
  editClientCopy: any = {};

  clientService;

  private nameFilter$ = new Subject<string>();

  constructor(private http: HttpClient) {
    this.clientService = new ClientService(this.http);

    // Debounce local name typing and apply frontend filter only
    this.nameFilter$.pipe(debounceTime(180), distinctUntilChanged()).subscribe((name) => {
      this.applyLocalNameFilter(name);
    });

    this.loadFromServer();
  }

  private loadFromServer() {
    const isActive = this.filterActive ? true : undefined;
    this.clientService.getClients({ isActive }).subscribe(
      (data: any) => {
        this.clients = Array.isArray(data)
          ? data.map((c: any) => ({
              ...c,
              id: c.id != null && !isNaN(Number(c.id)) ? Number(c.id) : c.id,
              isActive: c.isActive === true,
            }))
          : [];

        // apply local frontend name filter after loading server data
        this.applyLocalNameFilter(this.filterText);
      },
      (err) => {
        console.error("[Clients] loadFromServer error:", err);
        this.clients = [];
        this.filteredClients = [];
      }
    );
  }

  private applyLocalNameFilter(name: string) {
    const text = (name || "").trim().toLowerCase();
    if (!text) {
      this.filteredClients = this.clients;
      return;
    }
    this.filteredClients = this.clients.filter((c) => {
      const first = (c.firstName || "").toString().toLowerCase();
      const last = (c.lastName || "").toString().toLowerCase();
      const full = `${first} ${last}`;
      return full.includes(text) || first.includes(text) || last.includes(text);
    });
  }

  // Accept the client payload emitted by the new-client-form.
  createClient(clientPayload?: any) {
    const payload = clientPayload ?? this.newClient;
    this.clientService.createClient(payload).subscribe(() => {
      this.newClient = {
        firstName: "",
        lastName: "",
        birthdate: "",
        isActive: false,
      };
      this.showNewClientForm = false;
      this.loadFromServer();
    });
  }

  startEdit(client: any) {
    this.editingClientId = client.id;
    this.editClientCopy = { ...client };
  }

  saveEdit() {
    if (this.editingClientId == null) return;
    this.clientService.updateClient(this.editingClientId, this.editClientCopy).subscribe(() => {
      this.editingClientId = null;
      this.editClientCopy = {};
      this.loadFromServer();
    });
  }

  cancelEdit() {
    this.editingClientId = null;
    this.editClientCopy = {};
  }

  deleteClient(client: any) {
    if (!confirm(`Delete client ${client.firstName} ${client.lastName}?`)) return;
    this.clientService.deleteClient(client.id).subscribe(() => {
      this.loadFromServer();
    });
  }

  // Emit name changes to the debounced local filter instead of calling backend
  // TODO: Add server-side filtering
  onNameChanged(value: string) {
    this.nameFilter$.next(value);
  }

  onActiveChanged() {
    this.loadFromServer();
  }
}
