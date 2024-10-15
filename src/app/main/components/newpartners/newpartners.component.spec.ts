import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpartnersComponent } from './newpartners.component';

describe('NewpartnersComponent', () => {
  let component: NewpartnersComponent;
  let fixture: ComponentFixture<NewpartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewpartnersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewpartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
