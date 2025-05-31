import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RetailMarketplaceService } from '../../../../services/retail/retail-marketplace.service';
import { Router } from '@angular/router';
import { DynamicCategorySelectorComponent } from '../../dynamic-category-selector/dynamic-category-selector.component';


@Component({
  selector: 'app-product-search-browser',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicCategorySelectorComponent],
  templateUrl: './product-search-browser.component.html',
  styleUrls: ['./product-search-browser.component.scss']
})
export class ProductSearchBrowserComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  // Filter-Kriterien
  filter: any = {
    //searchText: '',
    category_id: null,
    price_min: null,
    price_max: null,
    attributeFilters: {}  // Schlüssel = attributeId, Wert = Filterwert
  };

  // Dynamisch geladene Attribute der ausgewählten Kategorie (zur Filterung)
  availableAttributes: any[] = [];
  finalCategory: any = null;

  constructor(
    private retailMarketplaceService: RetailMarketplaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.retailMarketplaceService.getAllProductsByCriteria(this.filter).subscribe({
      next: (response) => {
        this.products = response;
        this.filteredProducts = response;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Produkte:', err);
      }
    });
  }

  // Wird vom DynamicCategorySelector ausgelöst
  onFinalCategorySelected(finalCategory: any): void {
    if (!finalCategory) {
      console.error('Keine Kategorie ausgewählt!');
      return;
    }
    this.finalCategory = finalCategory;
    this.filter.categoryId = finalCategory.categoryId;
    // Extrahiere zugeordnete Attribute aus dem Kategorieobjekt (sofern vorhanden)
    if (finalCategory.categoryAttributes && finalCategory.categoryAttributes.length) {
      this.availableAttributes = finalCategory.categoryAttributes.map((ca: any) => ca.categoryAttribute);
    } else {
      this.availableAttributes = [];
    }
  }

  applyFilter(): void {
    // Erstelle ein neues Kriterien-Objekt
    const criteria: any = {
      searchText: this.filter.searchText,
      price_min: this.filter.price_min,  // Achte auf den gleichen Schlüssel wie im Template
      price_max: this.filter.price_max,
      // Falls vorhanden: weitere Felder
    };

    // Konvertiere den Inhalt von attributeFilters in einzelne Parameter
    if (this.filter.attributeFilters) {
      for (const attrId in this.filter.attributeFilters) {
        if (this.filter.attributeFilters.hasOwnProperty(attrId)) {
          const value = this.filter.attributeFilters[attrId];
          // Falls du nur einen exakten Wert filterst, verwandle ihn in einen Bereichsstring:
          criteria[`attribute_${attrId}`] = `${value}-${value}`;
        }
      }
    }

    console.log('Filter-Kriterien:', criteria);

    this.retailMarketplaceService.getAllProductsByCriteria(criteria).subscribe({
      next: (response) => {
        this.filteredProducts = response;
      },
      error: (err) => {
        console.error('Fehler beim Anwenden des Filters:', err);
      }
    });
  }


  viewDetails(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  sendRequest(productId: number): void {
    this.retailMarketplaceService.createRequest(productId).subscribe({
      next: (response) => {
        console.log('Anfrage erfolgreich gesendet:', response);
      },
      error: (err) => {
        console.error('Fehler beim Senden der Anfrage:', err);
      }
    });
  }

  getPictureUrl(product: any): string {
    if (product.pictures && product.pictures.length > 0) {
      return product.pictures[0].pictureURL;
    }
    return 'assets/default-image.jpg';
  }
}
