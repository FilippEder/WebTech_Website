import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchBrowserComponent } from './product-search-browser.component';

describe('ProductSearchBrowserComponent', () => {
  let component: ProductSearchBrowserComponent;
  let fixture: ComponentFixture<ProductSearchBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSearchBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
