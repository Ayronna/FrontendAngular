import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Standard button component.
 * Applies variant-based CSS classes that match the global SCSS:
 *  - .app-button--primary, --secondary, --ghost, --edit, --delete
 *
 * The component is standalone and imports CommonModule (for ngClass).
 * Consumers should use the `variant` input to select styles (or 'add' maps to 'primary').
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled || busy"
      [attr.aria-label]="ariaLabel"
      [attr.aria-hidden]="ariaHidden"
      [ngClass]="classes"
      (click)="handleClick($event)"
    >
      <ng-content select="[button-icon]"></ng-content>
      <span class="app-button__label"><ng-content></ng-content></span>
    </button>
  `,
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() disabled = false;
  @Input() busy = false;
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'edit' | 'delete' | 'add' | string = 'primary';
  @Input() size: 'small' | 'medium' | 'large' | string = 'medium';
  @Input() block = false;

  @Input() ariaLabel?: string;
  @Input() ariaHidden?: boolean;

  @Output() clicked = new EventEmitter<Event>();

  handleClick(event: Event): void {
    this.clicked.emit(event);
  }

  get classes(): string[] {
    const mappedVariant = this.mapVariant(this.variant);
    const sizeClass = this.size ? `app-button--size-${this.size}` : '';
    const blockClass = this.block ? 'app-button--block' : '';
    return ['app-button', `app-button--${mappedVariant}`, sizeClass, blockClass].filter(Boolean);
  }

  private mapVariant(v: string | undefined): string {
    if (!v) return 'primary';
    if (v === 'add') return 'primary';
    return v;
  }
}