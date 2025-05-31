import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RetailMarketplaceService } from '../../../../services/retail/retail-marketplace.service';
import { Product } from '../../../../models/retail/product.model';
import { ProductAttribute } from '../../../../models/retail/product-attribute.model';
import { ProductPicture } from '../../../../models/retail/product-picture.model';
import { Attribute } from '../../../../models/retail/attribute.model';
import { DynamicCategorySelectorComponent } from '../../dynamic-category-selector/dynamic-category-selector.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
  imports: [FormsModule, CommonModule, DynamicCategorySelectorComponent],
  standalone: true
})
export class ListProductComponent implements OnInit {
  // Neues Produkt, das erstellt werden soll
  newProduct: Product = {} as Product;

  // Verfügbare Attribute, die basierend auf der finalen Kategorie angezeigt werden
  availableAttributes: Attribute[] = [];
  // Zwischenspeicher für eingegebene Attributwerte – Schlüssel: attributeId
  productAttributes: { [key: number]: number } = {};

  // Zugriff auf die DynamicCategorySelector-Komponente
  @ViewChild('catSelector') catSelector!: DynamicCategorySelectorComponent;

  constructor(
    private retailMarketplaceService: RetailMarketplaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Weitere Initialisierungen falls nötig
  }

  /**
   * Wird aufgerufen, wenn der DynamicCategorySelector das finale Kategorieobjekt ausgibt.
   * Hier extrahieren wir, falls vorhanden, die zugeordneten Attribute.
   */
  onFinalCategorySelected(finalCategory: any): void {
    if (!finalCategory) {
      console.error('Keine Kategorie ausgewählt!');
      return;
    }
    this.newProduct.categoryId = finalCategory.categoryId;
    // Falls das Kategorieobjekt direkt die zugeordneten Attribute enthält:
    if (finalCategory.categoryAttributes && finalCategory.categoryAttributes.length) {
      // Wir nehmen an, dass jedes Element in categoryAttributes ein Feld "categoryAttribute" mit den eigentlichen Attributdaten enthält.
      this.availableAttributes = finalCategory.categoryAttributes.map((ca: any) => ca.categoryAttribute);
    } else {
      this.availableAttributes = [];
    }
  }

  /**
   * Verarbeitet den File-Input: speichert die File-Objekte und erstellt Bildvorschauen.
   */
  createPictureArray(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      (this.newProduct as any).pictureFiles = Array.from(fileList);
      this.newProduct.pictures = Array.from(fileList).map((file: File) => ({
        pictureID: 0,
        productId: 0,
        pictureURL: URL.createObjectURL(file)
      })) as ProductPicture[];
    }
  }

  /**
   * Fügt das Produkt hinzu:
   * - Die finale Kategorie wird aus dem DynamicCategorySelector ermittelt.
   * - Die eingegebenen Attributwerte werden in ein Array vom Typ ProductAttribute umgewandelt.
   * - Das Produkt wird als JSON-String in einem FormData versendet.
   */
  addProduct(): void {
    const finalCategory = this.catSelector.getFinalCategorySelection();
    if (!finalCategory) {
      console.error('Keine Kategorie ausgewählt!');
      return;
    }
    this.newProduct.categoryId = finalCategory.categoryId;

    if (!this.newProduct.status) {
      this.newProduct.status = 'Open';
    }
    if (!this.newProduct.name || this.newProduct.price == null) {
      console.error('Produktname oder Preis fehlt.');
      return;
    }
    console.log('Produkt-Daten vor dem POST:', JSON.stringify(this.newProduct, null, 2));

    const productAttributesArray: ProductAttribute[] = [];
    for (const attrId in this.productAttributes) {
      if (this.productAttributes.hasOwnProperty(attrId)) {
        productAttributesArray.push({
          productId: 0, // Backend wird hier die korrekte ID setzen
          attributeId: Number(attrId),
          attributeValue: this.productAttributes[attrId]
        });
      }
    }
    this.newProduct.productAttributes = productAttributesArray;

    const formData = new FormData();
    formData.append('product', JSON.stringify(this.newProduct));

    if ((this.newProduct as any).pictureFiles && (this.newProduct as any).pictureFiles.length > 0) {
      (this.newProduct as any).pictureFiles.forEach((file: File) => {
        formData.append('pictures', file, file.name);
      });
    }

    this.retailMarketplaceService.createProduct(formData).subscribe({
      next: (response: any) => {
        console.log('Produkt erfolgreich erstellt:', response);
        this.router.navigate(['/edit-product', response.productId]);
      },
      error: (err: any) => {
        console.error('Fehler beim Erstellen des Produkts:', err);
      }
    });
  }

  /**
   * Gibt die URL eines Bildes für die Vorschau zurück.
   */
  getPictureUrl(pic: ProductPicture | File): string {
    if (pic instanceof File) {
      return URL.createObjectURL(pic);
    }
    return pic.pictureURL;
  }
}
