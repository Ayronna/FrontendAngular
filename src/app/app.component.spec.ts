import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from "./app.component";
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let nativeEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it("should create the app component", () => {
    expect(component).toBeTruthy();
  });

  it("should render header with logo image", () => {
    const img = nativeEl.querySelector('header.header img') as HTMLImageElement | null;
    expect(img).toBeTruthy();
    expect(img!.alt).toBe('gerimedica logo');
    expect(img!.src).toContain('gerimedica-logo.png');
  });

  it("should render navigation links for Home and Clients", () => {
    const links = Array.from(nativeEl.querySelectorAll('header nav a'));
    expect(links.length).toBeGreaterThanOrEqual(2);
    const texts = links.map(l => (l.textContent || '').trim());
    expect(texts).toContain('Home');
    expect(texts).toContain('Clients');

    const hrefs = links.map(l => (l as HTMLAnchorElement).getAttribute('href') || '');
    expect(hrefs.some(h => h.includes('/clients'))).toBeTruthy();
    expect(hrefs.some(h => h === '/' || (h.includes('/') && !h.includes('clients')))).toBeTruthy();
  });

  it("should include a router-outlet in the template", () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
