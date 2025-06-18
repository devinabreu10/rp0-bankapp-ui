import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { UserAuth } from '../user-auth.model';
import { environment } from '../../../../environments/environment';
import { RegisterAuth } from '../register-auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly currentUserSubject = new BehaviorSubject<UserAuth | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router,
  ) {}

  login(credentials: { username: string; password: string }): Observable<UserAuth> {
    return this.http.post<UserAuth>(`${this.authUrl}/login`, credentials).pipe(
      tap((user) => this.setAuthUser(user)),
      catchError(this.handleError),
    );
  }

  register(registerAuth: RegisterAuth): Observable<UserAuth> {
    return this.http.post<UserAuth>(`${this.authUrl}/register`, registerAuth).pipe(
      tap((user) => this.setAuthUser(user)),
      catchError(this.handleError),
    );
  }

  getCurrentUser(): Observable<UserAuth> {
    return this.http.get<UserAuth>(`${this.authUrl}/user`).pipe(
      tap({
        next: (user) => this.setAuthUser(user),
        error: () => this.purgeAuthUser(),
      }),
      shareReplay(1),
    );
  }

  logout(): void {
    this.purgeAuthUser();
    this.router.navigate(['/login']);
  }

  setAuthUser(user: UserAuth): void {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuthUser(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

  getUsername(): string {
    return this.currentUserSubject.value ? this.currentUserSubject.value.username : '';
  }

  getUserId(): number {
    return this.currentUserSubject.value ? this.currentUserSubject.value.id : -1;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Client-side error: ${error.error.message}` // Client-side or network error
        : `Server-side error: ${error.status} - ${error.message}`; // Backend error

    console.error('An error occurred:', errorMessage);

    return throwError(() => new Error('Error has occurred; please try again later.'));
  }
}
