import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewClientFormComponent } from './new-client-form.component';

describe('NewClientFormComponent', () => {
  let fixture: ComponentFixture<NewClientFormComponent>;
  let component: NewClientFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewClientFormComponent], // standalone component import
    }).compileComponents();

    fixture = TestBed.createComponent(NewClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit create with client payload when form is valid and submitted', () => {
    component.client = { firstName: 'Jane', lastName: 'Doe', birthdate: '1990-01-01', isActive: true };
    jest.spyOn(component.create, 'emit');
    fixture.detectChanges();

    const submitButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();

    submitButton!.click();
    fixture.detectChanges();

    expect(component.create.emit).toHaveBeenCalledWith(component.client);
  });

  it('should not emit and should show validation summary when fields are empty', () => {
    component.client = { firstName: '', lastName: '', birthdate: '', isActive: false };
    jest.spyOn(component.create, 'emit');
    fixture.detectChanges();

    const submitButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton!.click();
    fixture.detectChanges();

    expect(component.create.emit).not.toHaveBeenCalled();

    const summary: HTMLElement | null = fixture.nativeElement.querySelector('.submit-errors');
    expect(summary).toBeTruthy();
    const text = summary!.textContent || '';
    expect(text).toContain('First name is required.');
    expect(text).toContain('Last name is required.');
    expect(text).toContain('Birthdate is required.');
  });

  it('should not emit and should show future-date error when birthdate is after today', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().split('T')[0];

    component.client = { firstName: 'John', lastName: 'Smith', birthdate: iso, isActive: false };
    jest.spyOn(component.create, 'emit');
    fixture.detectChanges();

    const submitButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton!.click();
    fixture.detectChanges();

    expect(component.create.emit).not.toHaveBeenCalled();

    const summary: HTMLElement | null = fixture.nativeElement.querySelector('.submit-errors');
    expect(summary).toBeTruthy();
    expect((summary!.textContent || '')).toContain('Birthdate cannot be in the future.');
  });
});