import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTransportComponent } from './reg-transport.component';

describe('RegTransportComponent', () => {
  let component: RegTransportComponent;
  let fixture: ComponentFixture<RegTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegTransportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
