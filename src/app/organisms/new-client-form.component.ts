import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from '../atoms/button.component';
import {
  showErrors as showErrorsHelper,
  hasError as hasErrorHelper,
  collectControlErrors,
  validationMessages
} from '../shared/validation-helpers';

interface Client {
  firstName: string;
  lastName: string;
  birthdate: string;
  isActive: boolean;
}

@Component({
  selector: 'new-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
<h3>Create new client</h3>

<div class="submit-errors" *ngIf="submitted && submitErrors.length">
  <strong>Please fix the following:</strong>
  <ul>
    <li *ngFor="let err of submitErrors">{{ err }}</li>
  </ul>
</div>

<form #form="ngForm" (ngSubmit)="handleCreate(form)" novalidate>
  <input
    name="firstName"
    type="text"
    placeholder="First name"
    [(ngModel)]="client.firstName"
    required
    pattern="^[A-Za-zÀ-ÖØ-öø-ÿ'’\\-\\s]+$"
    #firstName="ngModel"
  >
  <div class="error" *ngIf="showErrors(firstName, submitted)">
    <div *ngIf="hasError(firstName, 'required')">
      {{ getValidationMessage('firstName', 'required') }}
    </div>
    <div *ngIf="hasError(firstName, 'pattern')">
      {{ getValidationMessage('firstName', 'pattern') }}
    </div>
  </div>

  <input
    name="lastName"
    type="text"
    placeholder="Last name"
    [(ngModel)]="client.lastName"
    required
    pattern="^[A-Za-zÀ-ÖØ-öø-ÿ'’\\-\\s]+$"
    #lastName="ngModel"
  >
  <div class="error" *ngIf="showErrors(lastName, submitted)">
    <div *ngIf="hasError(lastName, 'required')">
      {{ getValidationMessage('lastName', 'required') }}
    </div>
    <div *ngIf="hasError(lastName, 'pattern')">
      {{ getValidationMessage('lastName', 'pattern') }}
    </div>
  </div>

  <input
    name="birthdate"
    type="date"
    placeholder="Birthdate"
    [(ngModel)]="client.birthdate"
    required
    [attr.max]="maxDate"
    #birthdate="ngModel"
  >
  <div class="error" *ngIf="showErrors(birthdate, submitted) || (submitted && isBirthdateInFuture())">
    <div *ngIf="hasError(birthdate, 'required')">
      {{ getValidationMessage('birthdate', 'required') }}
    </div>
    <div *ngIf="isBirthdateInFuture()">
      {{ futureDateMessage }}
    </div>
  </div>

  <label>
    <input type="checkbox" [(ngModel)]="client.isActive" name="isActive">
    Active
  </label>

  <div>
    <app-button type="submit">Create client</app-button>
    <app-button type="button" variant="secondary" (clicked)="cancel.emit()">Cancel</app-button>
  </div>
</form>
  `
})
export class NewClientFormComponent {
  showErrors = showErrorsHelper;
  hasError = hasErrorHelper;

  @Input() client: Client = {
    firstName: '',
    lastName: '',
    birthdate: '',
    isActive: false,
  };

  @Output() create = new EventEmitter<Client>();
  @Output() cancel = new EventEmitter<void>();

  submitted = false;
  submitErrors: string[] = [];
  maxDate = new Date().toISOString().split('T')[0];

  readonly futureDateMessage = 'Birthdate cannot be in the future.';

  handleCreate(form?: NgForm) {
    this.submitted = true;
    this.submitErrors = [];

    if (form) {
      form.form.markAllAsTouched();
      this.submitErrors.push(...collectControlErrors(form.controls, validationMessages));
    }

    if (this.isBirthdateInFuture()) {
      this.submitErrors.push(this.futureDateMessage);
    }

    if (this.submitErrors.length || !form || form.invalid) return;
    this.create.emit(this.client);
  }

  isBirthdateInFuture(): boolean {
    if (!this.client.birthdate) return false;
    const birth = new Date(this.client.birthdate);
    const today = new Date();
    birth.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return birth > today;
  }

  getValidationMessage(controlName: string, errorKey: string): string {
    return validationMessages[controlName]?.[errorKey] ?? '';
  }
}
