import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HidroComponent } from './hidro.component';

describe('SolarComponent', () => {
  let component: HidroComponent;
  let fixture: ComponentFixture<HidroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HidroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HidroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
