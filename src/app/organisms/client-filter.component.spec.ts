import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFilterComponent } from './client-filter.component';

describe('ClientFilterComponent', () => {
  let fixture: ComponentFixture<ClientFilterComponent>;
  let component: ClientFilterComponent;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFilterComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should reflect @Input values in the DOM', async () => {
    component.filterText = 'Bob';
    component.filterActive = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const textInput = host.querySelector<HTMLInputElement>('input[type="text"]')!;
    const checkbox = host.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

    expect(textInput).toBeTruthy();
    expect(textInput.value).toBe('Bob');

    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
  });

  it('should emit nameChange when typing in the text input', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const textInput = host.querySelector<HTMLInputElement>('input[type="text"]')!;
    const spy = jest.spyOn(component.nameChange, 'emit');

    textInput.value = 'Alice';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith('Alice');
  });

  it('should emit activeChange when toggling the checkbox', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const checkbox = host.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    const spy = jest.spyOn(component.activeChange, 'emit');

    // simulate checking
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(true);

    // simulate unchecking
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(false);
  });
});