import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AccountComponent } from './account.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { lanternPage: 'home' } },
  { path: 'accounts/:id', component: AccountComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
