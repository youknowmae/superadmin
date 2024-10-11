import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIndustryPartnerComponent } from './edit-industry-partner.component';

describe('EditIndustryPartnerComponent', () => {
  let component: EditIndustryPartnerComponent;
  let fixture: ComponentFixture<EditIndustryPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditIndustryPartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditIndustryPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
