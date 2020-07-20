import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeComponentsComponent } from './code-components.component';

describe('CodeComponentsComponent', () => {
  let component: CodeComponentsComponent;
  let fixture: ComponentFixture<CodeComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
