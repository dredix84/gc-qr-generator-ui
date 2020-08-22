import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberloginPageRoutingModule } from './memberlogin-routing.module';

import { MemberloginPage } from './memberlogin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberloginPageRoutingModule
  ],
  declarations: [MemberloginPage]
})
export class MemberloginPageModule {}
