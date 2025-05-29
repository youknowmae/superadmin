import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalskillsComponent } from './technicalskills.component';

describe('TechnicalskillsComponent', () => {
  let component: TechnicalskillsComponent;
  let fixture: ComponentFixture<TechnicalskillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicalskillsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicalskillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
