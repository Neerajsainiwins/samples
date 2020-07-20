import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEprojectcreensComponent } from './add-edit-screens.component';

describe('AddEprojectcreensComponent', () => {
  let component: AddEprojectcreensComponent;
  let fixture: ComponentFixture<AddEprojectcreensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEprojectcreensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEprojectcreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
