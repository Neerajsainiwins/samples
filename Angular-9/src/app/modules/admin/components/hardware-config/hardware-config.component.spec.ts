import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareConfigComponent } from './hardware-config.component';

describe('HardwareConfigComponent', () => {
  let component: HardwareConfigComponent;
  let fixture: ComponentFixture<HardwareConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
