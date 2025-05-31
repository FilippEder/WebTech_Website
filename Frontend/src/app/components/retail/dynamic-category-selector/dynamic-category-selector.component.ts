import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RetailMarketplaceService } from '../../../services/retail/retail-marketplace.service';
@Component({
  selector: 'app-dynamic-category-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-category-selector.component.html',
  styleUrls: ['./dynamic-category-selector.component.scss']
})
export class DynamicCategorySelectorComponent implements OnInit {
  form: FormGroup;
  // Für jede Ebene speichern wir die verfügbaren Kategorien
  categoryOptions: { [level: number]: any[] } = {};

  // Sendet das finale (ausgewählte) Kategorieobjekt an den Parent
  @Output() finalCategorySelected = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private retailMarketplaceService: RetailMarketplaceService
  ) {
    this.form = this.fb.group({
      categorySelections: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addCategoryControl();
    this.loadCategories(0, null);
  }

  get categorySelections(): FormArray {
    return this.form.get('categorySelections') as FormArray;
  }

  addCategoryControl(): void {
    this.categorySelections.push(this.fb.control(null));
  }

  loadCategories(level: number, parentCategoryId: number | null): void {
    if (parentCategoryId === null) {
      this.retailMarketplaceService.getMainCategories().subscribe({
        next: (categories: any[]) => {
          this.categoryOptions[level] = categories;
        },
        error: (err: any) => console.error('Fehler beim Laden der Hauptkategorien', err)
      });
    } else {
      this.retailMarketplaceService.getSubcategories(parentCategoryId).subscribe({
        next: (subcategories: any[]) => {
          this.categoryOptions[level] = subcategories;
        },
        error: (err: any) => console.error('Fehler beim Laden der Unterkategorien', err)
      });
    }
  }

  onCategoryChange(level: number): void {
    const selectedCategory = this.categorySelections.at(level).value;
    // Entferne alle Einträge, die tiefer als die aktuelle Ebene liegen
    while (this.categorySelections.length > level + 1) {
      this.categorySelections.removeAt(this.categorySelections.length - 1);
      delete this.categoryOptions[this.categorySelections.length];
    }
    if (selectedCategory) {
      this.loadCategories(level + 1, selectedCategory.categoryId);
      this.addCategoryControl();
    }
    // Nach kurzer Verzögerung ermitteln wir die finale Kategorie und senden sie
    setTimeout(() => {
      const finalCat = this.getFinalCategorySelection();
      this.finalCategorySelected.emit(finalCat);
    }, 100);
  }

  getFinalCategorySelection(): any {
    const selections = this.categorySelections.value;
    let finalCategory = null;
    for (const sel of selections) {
      if (sel) {
        finalCategory = sel;
      }
    }
    return finalCategory;
  }
}
