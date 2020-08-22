import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberloginPage } from './memberlogin.page';

const routes: Routes = [
  {
    path: '',
    component: MemberloginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberloginPageRoutingModule {}
