// Reusable validation helpers for template use.
//
// Usage in a component template:
//   *GIVEN* the component exposes the functions as members (see component below)
//   <div *ngIf="showErrors(firstName, submitted)">
//     <div *ngIf="hasError(firstName, 'required')">Required</div>
//   </div>

// TODO: Create seperate files for validations
// TODO: Validation service?
export function showErrors(control: any, submitted: boolean): boolean {
  return !!control && (submitted || control.dirty || control.touched) && !!control.invalid;
}

export function hasError(control: any, errorKey: string): boolean {
  return !!control && !!control.errors && !!(control.errors as Record<string, any>)[errorKey];
}

export const validationMessages: Record<string, Record<string, string>> = {
  firstName: {
    required: 'First name is required.',
    pattern: "First name must contain only letters, spaces, hyphens or apostrophes."
  },
  lastName: {
    required: 'Last name is required.',
    pattern: "Last name must contain only letters, spaces, hyphens or apostrophes."
  },
  birthdate: {
    required: 'Birthdate is required.'
  }
};

export function collectControlErrors(
  controls: Record<string, any>,
  messages: Record<string, Record<string, string>> = validationMessages
): string[] {
  const errors: string[] = [];
  Object.keys(controls).forEach(name => {
    const control = controls[name];
    if (control && control.invalid && control.errors) {
      Object.keys(control.errors).forEach(errKey => {
        const msg = messages[name]?.[errKey];
        if (msg) errors.push(msg);
      });
    }
  });
  return errors;
}