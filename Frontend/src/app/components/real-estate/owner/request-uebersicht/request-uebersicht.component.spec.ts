import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUebersichtComponent } from './request-uebersicht.component';

describe('RequestUebersichtComponent', () => {
  let component: RequestUebersichtComponent;
  let fixture: ComponentFixture<RequestUebersichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestUebersichtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestUebersichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
