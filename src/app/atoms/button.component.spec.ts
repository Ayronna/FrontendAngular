import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    buttonEl = fixture.nativeElement.querySelector('button');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(buttonEl).toBeInstanceOf(HTMLButtonElement);
  });

  it('should emit "clicked" when the button is pressed', () => {
    jest.spyOn(component.clicked, 'emit');
    buttonEl.click();
    fixture.detectChanges();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should not emit "clicked" when disabled is true', () => {
    jest.spyOn(component.clicked, 'emit');
    component.disabled = true;
    fixture.detectChanges();

    buttonEl.click();
    fixture.detectChanges();
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });

  it('should apply variant/size/block classes and map "add" to primary', () => {
    component.variant = 'add';
    component.size = 'large';
    component.block = true;
    fixture.detectChanges();

    const classes = Array.from(buttonEl.classList);
    expect(classes).toContain('app-button--primary'); 
    expect(classes).toContain('app-button--size-large');
    expect(classes).toContain('app-button--block');
  });

  it('should set aria attributes from inputs', () => {
    component.ariaLabel = 'my-label';
    component.ariaHidden = true;
    fixture.detectChanges();

    expect(buttonEl.getAttribute('aria-label')).toBe('my-label');
    expect(buttonEl.getAttribute('aria-hidden')).toBe('true');
  });
});