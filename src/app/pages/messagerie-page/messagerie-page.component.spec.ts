import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageriePageComponent } from './messagerie-page.component';

describe('MessageriePageComponent', () => {
  let component: MessageriePageComponent;
  let fixture: ComponentFixture<MessageriePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageriePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageriePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
