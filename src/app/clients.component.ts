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
      <client-filter
        [filterText]="filterText"
        [filterActive]="filterActive"
        (nameChange)="onNameChanged($event)"
        (activeChange)="onActiveChanged($event)"
      ></client-filter>

      <client-card
        *ngFor="let client of filteredClients"
        [client]="client"
        (save)="handleSave($event)"
        (remove)="deleteClient($event)"
      ></client-card>
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
              isActive: this.parseBoolean(c.isActive),
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

  private parseBoolean(value: any): boolean {
    if (value === true || value === "true" || value === 1 || value === "1") return true;
    return false;
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

  handleSave(updatedClient: any) {
    if (!updatedClient || updatedClient.id == null) return;
    this.clientService.updateClient(updatedClient.id, updatedClient).subscribe(() => {
      this.loadFromServer();
    });
  }

  deleteClient(client: any) {
    if (!client || client.id == null) return;
    this.clientService.deleteClient(client.id).subscribe(() => {
      this.loadFromServer();
    });
  }

  // Emit name changes to the debounced local filter instead of calling backend
  // TODO: Add server-side filtering
  onNameChanged(value: string) {
    this.nameFilter$.next(value);
  }

  // called with the checkbox value emitted by the client-filter component
  onActiveChanged(value: boolean) {
    this.filterActive = value;
    this.loadFromServer();
  }
}
