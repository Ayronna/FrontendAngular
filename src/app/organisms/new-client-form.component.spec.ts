import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { NewClientFormComponent } from './new-client-form.component';

describe('NewClientFormComponent', () => {
  let fixture: ComponentFixture<NewClientFormComponent>;
  let component: NewClientFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewClientFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit create with client payload when form is valid and submitted', async () => {
    jest.spyOn(component.create, 'emit');

    const firstInput = fixture.nativeElement.querySelector('input[name="firstName"]') as HTMLInputElement;
    const lastInput = fixture.nativeElement.querySelector('input[name="lastName"]') as HTMLInputElement;
    const birthInput = fixture.nativeElement.querySelector('input[name="birthdate"]') as HTMLInputElement;
    const activeCheckbox = fixture.nativeElement.querySelector('input[name="isActive"]') as HTMLInputElement;

    firstInput.value = 'Jane';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    lastInput.value = 'Doe';
    lastInput.dispatchEvent(new Event('input', { bubbles: true }));
    birthInput.value = '1990-01-01';
    birthInput.dispatchEvent(new Event('input', { bubbles: true }));
    activeCheckbox.checked = true;
    activeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    fixture.detectChanges();
    await fixture.whenStable();

    const formDe = fixture.debugElement.query(By.css('form'));
    const ngForm = formDe.injector.get(NgForm);

    component.handleCreate(ngForm);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.create.emit).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Doe',
      birthdate: '1990-01-01',
      isActive: true,
    });
  });

  it('should not emit and should show per-field validation messages when fields are empty', async () => {
    jest.spyOn(component.create, 'emit');

    const firstInput = fixture.nativeElement.querySelector('input[name="firstName"]') as HTMLInputElement;
    const lastInput = fixture.nativeElement.querySelector('input[name="lastName"]') as HTMLInputElement;
    const birthInput = fixture.nativeElement.querySelector('input[name="birthdate"]') as HTMLInputElement;
    const activeCheckbox = fixture.nativeElement.querySelector('input[name="isActive"]') as HTMLInputElement;

    firstInput.value = '';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    lastInput.value = '';
    lastInput.dispatchEvent(new Event('input', { bubbles: true }));
    birthInput.value = '';
    birthInput.dispatchEvent(new Event('input', { bubbles: true }));
    activeCheckbox.checked = false;
    activeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    fixture.detectChanges();
    await fixture.whenStable();

    const formDe = fixture.debugElement.query(By.css('form'));
    const ngForm = formDe.injector.get(NgForm);

    component.handleCreate(ngForm);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.create.emit).not.toHaveBeenCalled();

    const errorElems = Array.from(fixture.nativeElement.querySelectorAll('.client-form__field-error')) as HTMLElement[];
    const allText = errorElems.map(e => (e.textContent || '').trim()).join('\n');

    expect(allText).toContain('First name is required.');
    expect(allText).toContain('Last name is required.');
    expect(allText).toContain('Birthdate is required.');
  });

  it('should not emit and should show future-date error when birthdate is after today', async () => {
    jest.spyOn(component.create, 'emit');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().split('T')[0];

    const firstInput = fixture.nativeElement.querySelector('input[name="firstName"]') as HTMLInputElement;
    const lastInput = fixture.nativeElement.querySelector('input[name="lastName"]') as HTMLInputElement;
    const birthInput = fixture.nativeElement.querySelector('input[name="birthdate"]') as HTMLInputElement;
    const activeCheckbox = fixture.nativeElement.querySelector('input[name="isActive"]') as HTMLInputElement;

    firstInput.value = 'John';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    lastInput.value = 'Smith';
    lastInput.dispatchEvent(new Event('input', { bubbles: true }));
    birthInput.value = iso;
    birthInput.dispatchEvent(new Event('input', { bubbles: true }));
    activeCheckbox.checked = false;
    activeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    fixture.detectChanges();
    await fixture.whenStable();

    const formDe = fixture.debugElement.query(By.css('form'));
    const ngForm = formDe.injector.get(NgForm);

    component.handleCreate(ngForm);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.create.emit).not.toHaveBeenCalled();

    const errorElems = Array.from(fixture.nativeElement.querySelectorAll('.client-form__field-error')) as HTMLElement[];
    const combined = errorElems.map(e => (e.textContent || '').trim()).join('\n');

    expect(combined).toContain('Birthdate cannot be in the future.');
  });
});