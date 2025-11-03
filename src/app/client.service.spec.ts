import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService],
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getClients should call GET /clients and return array', (done) => {
    const mock = [{ id: 1, firstName: 'A' }];

    service.getClients().subscribe((res: any) => {
      expect(Array.isArray(res)).toBe(true);
      expect(res).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url.includes('/clients'));
    expect(req).toBeTruthy();
    req.flush(mock);
  });

  it('createClient should POST to /clients', (done) => {
    const payload = { firstName: 'New' };
    const returned = { id: 99, ...payload };

    service.createClient(payload).subscribe((res: any) => {
      expect(res).toEqual(returned);
      done();
    });

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url.includes('/clients'));
    expect(req.request.body).toEqual(payload);
    req.flush(returned);
  });
});