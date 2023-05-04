import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPWComponent } from './forget-pw.component';

describe('ForgetPWComponent', () => {
  let component: ForgetPWComponent;
  let fixture: ComponentFixture<ForgetPWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgetPWComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
