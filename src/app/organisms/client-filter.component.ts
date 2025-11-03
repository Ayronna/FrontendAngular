import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'client-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h3>Filter clients</h3>
  <div class="clients-filter">
    <input
      type="text"
      placeholder="Type a name"
      [(ngModel)]="filterText"
      (ngModelChange)="onNameChanged($event)"
    >
    <div class="clients-filter--checkbox-wrapper">
      <input
        id="filterCheckbox"
        type="checkbox"
        [checked]="filterActive"
        (change)="onActiveToggled($event)"
      >
      <label for="filterCheckbox">Show only active clients</label>
    </div>
  </div>
  `,
})
export class ClientFilterComponent {
  @Input() filterText: string = '';
  @Input() filterActive: boolean = false;

  @Output() nameChange = new EventEmitter<string>();
  @Output() activeChange = new EventEmitter<boolean>();

  onNameChanged(value: string) {
    this.nameChange.emit(value);
  }

  onActiveToggled(e: Event) {
    const input = e.target as HTMLInputElement;
    const checked = !!input.checked;
    this.activeChange.emit(checked);
  }
}