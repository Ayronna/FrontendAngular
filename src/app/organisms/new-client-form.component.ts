import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../atoms/button.component';

@Component({
  selector: 'new-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
<h3>Create new client</h3>

<input type="text" placeholder="First name" [(ngModel)]="client.firstName">
<input type="text" placeholder="Last name" [(ngModel)]="client.lastName">
<input type="date" placeholder="Birthdate" [(ngModel)]="client.birthdate">

<label>
  <input type="checkbox" [(ngModel)]="client.isActive">
  Active
</label>

<div>
  <app-button (clicked)="handleCreate()">Create client</app-button>
  <app-button variant="secondary" (clicked)="cancel.emit()">
    Cancel
  </app-button>
</div>
`,
})
export class NewClientFormComponent {
  @Input() client = {
    firstName: '',
    lastName: '',
    birthdate: '',
    isActive: false,
  };

  @Output() create = new EventEmitter<typeof this.client>();
  @Output() cancel = new EventEmitter<void>();

  handleCreate() {
    this.create.emit(this.client);
  }
}