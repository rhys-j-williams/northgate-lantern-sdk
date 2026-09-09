import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LanternModule } from '@northgate/lantern-sdk';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AccountComponent } from './account.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, AccountComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LanternModule.forRoot({
      writeKey: 'wk_scratch',
      scriptUrl: 'http://localhost:4607/lantern.min.js',
      sessionHeaderUrlPrefixes: ['/api/'],
      appName: 'lantern-host15',
      appVersion: '0.0.0'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
