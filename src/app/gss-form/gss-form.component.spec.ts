import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GssFormComponent } from './gss-form.component';

describe('GssFormComponent', () => {
  let component: GssFormComponent;
  let fixture: ComponentFixture<GssFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GssFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GssFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
