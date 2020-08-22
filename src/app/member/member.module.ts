import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberPageRoutingModule } from './member-routing.module';

import { MemberPage } from './member.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [MemberPage]
})
export class MemberPageModule {}
