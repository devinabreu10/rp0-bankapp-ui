import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: jasmine.SpyObj<Router>;
  let eventsSubject: Subject<any>;
  let windowScrollToSpy: jasmine.Spy;

  beforeEach(async () => {
    // Create a subject to simulate router events
    eventsSubject = new Subject<any>();

    router = jasmine.createSpyObj(
      'Router',
      ['createUrlTree', 'navigate', 'navigateByUrl', 'serializeUrl', 'parseUrl'],
      {
        events: eventsSubject.asObservable(),
      },
    );

    // Spy on window.scrollTo
    windowScrollToSpy = spyOn(window, 'scrollTo');

    await TestBed.configureTestingModule({
    imports: [AppComponent],
    providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to top when NavigationEnd event occurs', () => {
    // Simulate a NavigationEnd event
    eventsSubject.next(new NavigationEnd(1, 'test', 'test'));

    // Check if window.scrollTo was called with the correct parameters
    expect(windowScrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('should not scroll to top for non-NavigationEnd events', () => {
    windowScrollToSpy.calls.reset();

    // Simulate a non-NavigationEnd event
    eventsSubject.next({ id: 1, url: 'test' });

    // Check that window.scrollTo was not called
    expect(windowScrollToSpy).not.toHaveBeenCalled();
  });

  it('should handle multiple NavigationEnd events', () => {
    // Simulate multiple NavigationEnd events
    eventsSubject.next(new NavigationEnd(1, 'test1', 'test1'));
    eventsSubject.next(new NavigationEnd(2, 'test2', 'test2'));

    // Check if window.scrollTo was called twice
    expect(windowScrollToSpy).toHaveBeenCalledTimes(2);
    expect(windowScrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('should handle subscription completion', () => {
    eventsSubject.complete();

    // Verify the method doesn't throw errors when the observable completes
    expect(() => {
      // Try to emit another event
      eventsSubject.next(new NavigationEnd(3, 'test3', 'test3'));
    }).not.toThrow();
  });
});
