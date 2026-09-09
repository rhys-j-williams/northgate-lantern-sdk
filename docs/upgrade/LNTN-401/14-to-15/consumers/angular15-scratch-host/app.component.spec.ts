import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  LanternModule,
  LanternRouterTracker,
  LanternService,
  LanternSessionInterceptor,
  LanternTrackDirective,
  LanternVendorApi,
  LanternWindow
} from '@northgate/lantern-sdk';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AccountComponent } from './account.component';

describe('lantern-host15 (Angular 15.2 scratch consumer of @northgate/lantern-sdk 5.0.0)', () => {
  const win = window as LanternWindow;
  let vendor: jasmine.SpyObj<LanternVendorApi>;

  beforeEach(async () => {
    vendor = jasmine.createSpyObj<LanternVendorApi>('Lantern', ['load', 'track', 'page', 'identify']);
    win.Lantern = vendor;
    document.querySelectorAll('script[data-lantern-sdk]').forEach((s) => s.remove());
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomeComponent, data: { lanternPage: 'home' } },
          { path: 'accounts/:id', component: AccountComponent }
        ]),
        HttpClientTestingModule,
        LanternModule.forRoot({
          writeKey: 'wk_scratch',
          scriptUrl: 'http://localhost:4607/lantern.min.js',
          sessionHeaderUrlPrefixes: ['/api/']
        })
      ],
      declarations: [AppComponent, HomeComponent, AccountComponent]
    }).compileComponents();
    TestBed.inject(LanternModule);
  });

  afterEach(() => {
    delete win.Lantern;
  });

  it('LanternModule.forRoot initialises the 5.0.0 SDK and injects the vendor script', () => {
    expect(vendor.load).toHaveBeenCalledWith('wk_scratch', jasmine.objectContaining({}));
    expect(document.querySelectorAll('script[data-lantern-sdk="5.0.0"]').length).toBe(1);
    expect(TestBed.inject(LanternService).enabled).toBeTrue();
    expect(TestBed.inject(LanternRouterTracker)).toBeTruthy();
  });

  it('router page tracking fires page events and masks account ids', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await router.navigateByUrl('/');
    await router.navigateByUrl('/accounts/ACC-12345678?tab=x');
    expect(TestBed.inject(Location).path()).toBe('/accounts/ACC-12345678?tab=x');
    expect(vendor.page).toHaveBeenCalledWith('home', jasmine.objectContaining({ path: '/', routeName: 'home' }));
    expect(vendor.page).toHaveBeenCalledWith(
      '/accounts/:id',
      jasmine.objectContaining({ path: '/accounts/:id', referrerPath: '/', routeName: null })
    );
    expect(vendor.page).not.toHaveBeenCalledWith(jasmine.stringMatching(/ACC-12345678/), jasmine.anything());
  });

  it('lanternTrack directive compiles in a host template and tracks clicks', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button#pay') as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(fixture.debugElement.query((de) => !!de.injector.get(LanternTrackDirective, null))).toBeTruthy();
    button.click();
    expect(vendor.track).toHaveBeenCalledWith(
      'transfer.submit',
      jasmine.objectContaining({ amountBand: 'low', elementTag: 'button', elementId: 'pay', sdk: '@northgate/lantern-sdk@5.0.0' })
    );
  });

  it('session interceptor is registered by forRoot and stamps X-Analytics-Session on /api/ calls only', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptors.some((i) => i instanceof LanternSessionInterceptor)).toBeTrue();
    const http = TestBed.inject(HttpClient);
    const ctrl = TestBed.inject(HttpTestingController);
    http.get('/api/accounts').subscribe();
    http.get('https://third.party.example/x').subscribe();
    const api = ctrl.expectOne('/api/accounts');
    const third = ctrl.expectOne('https://third.party.example/x');
    expect(api.request.headers.get('X-Analytics-Session')).toBe(TestBed.inject(LanternService).sessionId());
    expect(third.request.headers.has('X-Analytics-Session')).toBeFalse();
    api.flush({});
    third.flush({});
    ctrl.verify();
  });
});
