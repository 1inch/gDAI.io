import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GDaiComponent } from './g-dai.component';

describe('GDaiComponent', () => {
  let component: GDaiComponent;
  let fixture: ComponentFixture<GDaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GDaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GDaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
