import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBrowserComponent } from './search-browser.component';

describe('SearchBrowserComponent', () => {
  let component: SearchBrowserComponent;
  let fixture: ComponentFixture<SearchBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
