import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientCardComponent } from './client-card.component';

describe('ClientCardComponent', () => {
  let fixture: ComponentFixture<ClientCardComponent>;
  let component: ClientCardComponent;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientCardComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
  });

  async function clickClientActionButton(index = 0) {
    const btn = host.querySelectorAll('.client-actions button')[index] as HTMLButtonElement | undefined;
    expect(btn).toBeTruthy();
    btn!.click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render client name, birthdate and active status', async () => {
    component.client = { firstName: 'Lyra', lastName: 'Moonshadow', birthdate: '1968-12-03', isActive: true };
    fixture.detectChanges();
    await fixture.whenStable();

    const name = host.querySelector('.client-name')!;
    expect(name).toBeTruthy();
    expect(name.textContent).toContain('Lyra Moonshadow');

    const birth = host.querySelector('.client-meta span')!;
    expect(birth).toBeTruthy();
    expect(birth.textContent).toContain('1968-12-03');

    const status = host.querySelector('.status')!;
    expect(status).toBeTruthy();
    expect(status.classList).toContain('active');
    expect(status.textContent!.trim()).toBe('Active');
  });

  it('should enter edit mode when Edit clicked and populate inputs', async () => {
    component.client = { firstName: 'John', lastName: 'Smith', birthdate: '1990-01-01', isActive: false };
    fixture.detectChanges();
    await fixture.whenStable();

    await clickClientActionButton(0);

    const firstInput = host.querySelector<HTMLInputElement>('input[id="firstName"]')!;
    const lastInput = host.querySelector<HTMLInputElement>('input[id="lastName"]')!;
    const birthInput = host.querySelector<HTMLInputElement>('input[id="birthdate"]')!;

    expect(firstInput).toBeTruthy();
    expect(firstInput.value).toBe('John');

    expect(lastInput).toBeTruthy();
    expect(lastInput.value).toBe('Smith');

    expect(birthInput).toBeTruthy();
    expect(birthInput.value).toBe('1990-01-01');
  });

  it('should emit save with updated client when valid edit submitted', async () => {
    component.client = { id: 1, firstName: 'John', lastName: 'Smith', birthdate: '1990-01-01', isActive: false };
    jest.spyOn(component.save, 'emit');
    fixture.detectChanges();
    await fixture.whenStable();

    await clickClientActionButton(0); 

    const firstInput = host.querySelector<HTMLInputElement>('input[id="firstName"]')!;
    const birthInput = host.querySelector<HTMLInputElement>('input[id="birthdate"]')!;

    firstInput.value = 'Johnny';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    birthInput.value = '1991-02-02';
    birthInput.dispatchEvent(new Event('input', { bubbles: true }));

    fixture.detectChanges();
    await fixture.whenStable();

    const submitBtn = host.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    expect(submitBtn).toBeTruthy();
    submitBtn!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.save.emit).toHaveBeenCalled();
    const emitted = (component.save.emit as jest.Mock).mock.calls[0][0];
    expect(emitted.firstName).toBe('Johnny');
    expect(emitted.birthdate).toBe('1991-02-02');
  });

  it('should not emit save and should show validation error when name is empty', async () => {
    component.client = { id: 2, firstName: 'A', lastName: 'B', birthdate: '1990-01-01', isActive: false };
    jest.spyOn(component.save, 'emit');
    fixture.detectChanges();
    await fixture.whenStable();

    await clickClientActionButton(0);

    const firstInput = host.querySelector<HTMLInputElement>('input[id="firstName"]')!;
    firstInput.value = '';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const submitBtn = host.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    expect(submitBtn).toBeTruthy();
    submitBtn!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.save.emit).not.toHaveBeenCalled();

    const firstFieldError = host.querySelector('.field input#firstName')!.parentElement!.querySelector('.error');
    expect(firstFieldError).toBeTruthy();
    expect(firstFieldError!.textContent).toContain('First name is required');
  });

  it('should not emit save and should show future-date error when birthdate is in the future', async () => {
    component.client = { id: 3, firstName: 'Future', lastName: 'Person', birthdate: '1990-01-01', isActive: false };
    jest.spyOn(component.save, 'emit');
    fixture.detectChanges();
    await fixture.whenStable();

    await clickClientActionButton(0); 

    const birthInput = host.querySelector<HTMLInputElement>('input[id="birthdate"]')!;
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const tomorrow = t.toISOString().split('T')[0];

    birthInput.value = tomorrow;
    birthInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const submitBtn = host.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    expect(submitBtn).toBeTruthy();
    submitBtn!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.save.emit).not.toHaveBeenCalled();

    const err = host.querySelector('.client-edit .error');
    expect(err).toBeTruthy();
    expect(err!.textContent).toContain('Birthdate cannot be in the future');
  });

  it('should emit remove when Delete clicked and user confirms', async () => {
    component.client = { id: 4, firstName: 'Del', lastName: 'Me', birthdate: '1990-01-01', isActive: false };
    jest.spyOn(component.remove, 'emit');
    fixture.detectChanges();
    await fixture.whenStable();

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    await clickClientActionButton(1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(confirmSpy).toHaveBeenCalled();
    expect(component.remove.emit).toHaveBeenCalledWith(component.client);

    confirmSpy.mockRestore();
  });
});