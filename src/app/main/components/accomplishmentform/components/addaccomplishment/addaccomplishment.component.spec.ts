import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddaccomplishmentComponent } from './addaccomplishment.component';

describe('AddaccomplishmentComponent', () => {
  let component: AddaccomplishmentComponent;
  let fixture: ComponentFixture<AddaccomplishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddaccomplishmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddaccomplishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
