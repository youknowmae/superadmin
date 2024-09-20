import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustrypartnersComponent } from './industrypartners.component';

describe('IndustrypartnersComponent', () => {
  let component: IndustrypartnersComponent;
  let fixture: ComponentFixture<IndustrypartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndustrypartnersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndustrypartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
