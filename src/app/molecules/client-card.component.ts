import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from '../atoms/button.component';
import {
    showErrors as showErrorsHelper,
    hasError as hasErrorHelper,
    validationMessages,
} from '../shared/validation-helpers';

@Component({
    selector: 'client-card',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonComponent],
    template: `
<div class="client-card">
  <ng-container *ngIf="!editing; else editTemplate">
    <div class="client-view">
      <div class="client-info">
        <div class="client-name">{{ client.firstName }} {{ client.lastName }}</div>
        <div class="client-meta">
          <span>{{ client.birthdate }}</span>
          <span class="status" [class.active]="client.isActive" [class.inactive]="!client.isActive">
            {{ client.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <div class="client-actions">
        <app-button type="button" variant="secondary" (clicked)="startEdit()">Edit</app-button>
        <app-button type="button" variant="delete" (clicked)="confirmDelete()"></app-button>
      </div>
    </div>
  </ng-container>

  <ng-template #editTemplate>
    <form #editForm="ngForm" (ngSubmit)="handleSave(editForm)" class="client-edit-form" novalidate>
      <div class="client-edit">
        <ng-container *ngFor="let field of fields">
          <div class="field">
            <label [for]="field.name">{{ field.placeholder }}</label>
            <input
              [id]="field.name"
              [name]="field.name"
              [type]="field.type || 'text'"
              [placeholder]="field.placeholder"
              [(ngModel)]="editCopy[field.name]"
              required
              [attr.max]="field.type === 'date' ? maxDate : null"
              #ctrl="ngModel"
            />
            <div class="error"
              *ngIf="showErrors(ctrl, submitted) ||
                     (submitted && field.name === 'birthdate' && isBirthdateInFuture(editCopy.birthdate))">
              <div *ngIf="hasError(ctrl, 'required')">
                {{ getValidationMessage(field.name, 'required') }}
              </div>
              <div *ngIf="field.name === 'birthdate' && isBirthdateInFuture(editCopy.birthdate)">
                {{ futureDateMessage }}
              </div>
            </div>
          </div>
        </ng-container>

        <label class="active-label">
          <input type="checkbox" [(ngModel)]="editCopy.isActive" name="isActive" />
          Active
        </label>

        <div class="actions">
          <app-button type="submit" variant="edit">Save</app-button>
          <app-button type="button" variant="secondary" (clicked)="cancelEdit()">Cancel</app-button>
        </div>
      </div>
    </form>
  </ng-template>
</div>
  `,
})
export class ClientCardComponent {
    showErrors = showErrorsHelper;
    hasError = hasErrorHelper;

    @Input() client: any = {};
    @Output() save = new EventEmitter<any>();
    @Output() remove = new EventEmitter<any>();

    editing = false;
    editCopy: any = {};
    submitted = false;

    readonly maxDate = new Date().toISOString().split('T')[0];
    readonly futureDateMessage = 'Birthdate cannot be in the future.';

    fields = [
        { name: 'firstName', placeholder: 'First name' },
        { name: 'lastName', placeholder: 'Last name' },
        { name: 'birthdate', placeholder: 'Birthdate', type: 'date' },
    ];

    startEdit() {
        this.editing = true;
        this.editCopy = { ...this.client };
        this.submitted = false;
    }

    handleSave(form?: NgForm) {
        this.submitted = true;
        if (!form?.valid || this.isBirthdateInFuture(this.editCopy.birthdate)) return;
        this.save.emit(this.editCopy);
        this.resetEditState();
    }

    cancelEdit() {
        this.resetEditState();
    }

    confirmDelete() {
        if (confirm(`Delete client ${this.client.firstName} ${this.client.lastName}?`)) {
            this.remove.emit(this.client);
        }
    }

    isBirthdateInFuture(birthdate?: string): boolean {
        if (!birthdate) return false;
        const b = new Date(birthdate);
        const today = new Date();
        b.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return b > today;
    }

    getValidationMessage(controlName: string, errorKey: string): string {
        return validationMessages[controlName]?.[errorKey] ?? '';
    }

    private resetEditState() {
        this.editing = false;
        this.editCopy = {};
        this.submitted = false;
    }
}
