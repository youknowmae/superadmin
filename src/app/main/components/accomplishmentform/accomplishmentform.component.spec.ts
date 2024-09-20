import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomplishmentformComponent } from './accomplishmentform.component';

describe('AccomplishmentformComponent', () => {
  let component: AccomplishmentformComponent;
  let fixture: ComponentFixture<AccomplishmentformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccomplishmentformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccomplishmentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
