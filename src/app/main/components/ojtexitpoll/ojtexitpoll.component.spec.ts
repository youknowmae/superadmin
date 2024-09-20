import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OjtexitpollComponent } from './ojtexitpoll.component';

describe('OjtexitpollComponent', () => {
  let component: OjtexitpollComponent;
  let fixture: ComponentFixture<OjtexitpollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OjtexitpollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OjtexitpollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
