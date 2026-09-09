import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<button id="pay" lanternTrack="transfer.submit" [lanternProps]="{ amountBand: 'low' }">Send</button>`
})
export class HomeComponent {}
