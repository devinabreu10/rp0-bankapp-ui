import { Injectable } from '@angular/core';

/**
 * JWT Token management service.
 * 
 * This service provides methods to get, save, and delete the JWT token 
 * stored in the local storage.
 */
@Injectable({ providedIn: 'root' })
export class JwtService {
  /**
   * Retrieves the JWT token from the local storage.
   *
   * @returns {string} The JWT token.
   */
  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  /**
   * Saves the JWT token to the local storage.
   *
   * @param {string} token - The JWT token to save.
   */
  saveToken(token: string): void {
    window.localStorage['jwtToken'] = token;
  }

  /**
   * Deletes the JWT token from the local storage.
   */
  destroyToken(): void {
    window.localStorage.removeItem('jwtToken');
  }
}
