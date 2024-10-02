import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomplishmentreportComponent } from './accomplishmentreport.component';

describe('AccomplishmentreportComponent', () => {
  let component: AccomplishmentreportComponent;
  let fixture: ComponentFixture<AccomplishmentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccomplishmentreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccomplishmentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
