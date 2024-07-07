import { TestBed } from '@angular/core/testing';

import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtService);
    localStorage.clear(); // Clear localStorage before each test
  });

  afterEach(() => {
    localStorage.clear(); // Clear localStorage after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the JWT token from local storage', () => {
    const token = 'testToken';
    localStorage.setItem('jwtToken', token); // Set token in localStorage
    const result = service.getToken();
    expect(result).toBe(token); // Check if the service retrieves the token correctly
  });

  it('should return undefined if no JWT token is in local storage', () => {
    const result = service.getToken();
    expect(result).toBeUndefined();
  });

  it('should save the JWT token to local storage', () => {
    const token = 'testToken';
    service.saveToken(token);
    const storedToken = localStorage.getItem('jwtToken');
    expect(storedToken).toBe(token); // Check if the token is saved correctly
  });

  it('should remove the JWT token from local storage', () => {
    localStorage['jwtToken'] = 'testToken'; // Set token in localStorage
    service.destroyToken();
    const storedToken = localStorage.getItem('jwtToken');
    expect(storedToken).toBeNull(); // Check if the token is removed correctly
  });
});
