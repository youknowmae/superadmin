import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddseminarComponent } from './addseminar.component';

describe('AddseminarComponent', () => {
  let component: AddseminarComponent;
  let fixture: ComponentFixture<AddseminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddseminarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddseminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
