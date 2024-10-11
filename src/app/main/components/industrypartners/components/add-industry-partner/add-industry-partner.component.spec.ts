import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndustryPartnerComponent } from './add-industry-partner.component';

describe('AddIndustryPartnerComponent', () => {
  let component: AddIndustryPartnerComponent;
  let fixture: ComponentFixture<AddIndustryPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIndustryPartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddIndustryPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
