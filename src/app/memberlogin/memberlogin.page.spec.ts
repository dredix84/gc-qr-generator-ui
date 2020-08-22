import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberloginPage } from './memberlogin.page';

describe('MemberloginPage', () => {
  let component: MemberloginPage;
  let fixture: ComponentFixture<MemberloginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberloginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
