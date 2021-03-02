import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return something', () => {
    service.getUser('2').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/customers/2'
    );
    req.flush('something');
  });

  it('getUsers should return a list of users', () => {
    service.getUsers().subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/customers'
    );
    req.flush('something');
  });
});
