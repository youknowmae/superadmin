import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiletemplateComponent } from './filetemplate.component';

describe('FiletemplateComponent', () => {
  let component: FiletemplateComponent;
  let fixture: ComponentFixture<FiletemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiletemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiletemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
