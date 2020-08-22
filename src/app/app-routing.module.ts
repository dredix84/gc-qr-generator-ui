import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home/qrcode/:id',
    loadChildren: () => import('./qrcode/qrcode.module').then( m => m.QrcodePageModule)
  },
  {
    path: 'home/qrcode/:id/:token',
    loadChildren: () => import('./qrcode/qrcode.module').then( m => m.QrcodePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'memberlogin',
    loadChildren: () => import('./memberlogin/memberlogin.module').then( m => m.MemberloginPageModule)
  },
  {
    path: 'member/:memberId',
    loadChildren: () => import('./member/member.module').then( m => m.MemberPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
