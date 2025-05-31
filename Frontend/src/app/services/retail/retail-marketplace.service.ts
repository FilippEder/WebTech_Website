import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class RetailMarketplaceService {
    private readonly BASE_URL = 'http://localhost:3000';
    private readonly PRODUCT_ENDPOINT = '/api/product';
    private readonly CATEGORY_ENDPOINT = '/api/category';
  
    constructor(private http: HttpClient) {}
  
    // 🔍 Alle Produkte mit optionalen Filtern abrufen
    getAllProductsByCriteria(criteria: any = {}): Observable<any> {
      let params = new HttpParams();
      Object.keys(criteria).forEach(key => {
        if (criteria[key] != null && criteria[key] !== '') {
          params = params.set(key, criteria[key]);
        }
      });
      return this.http.get<any>(`${this.BASE_URL}${this.PRODUCT_ENDPOINT}`, { params });
    }
  
    // 📦 Einzelnes Produkt nach ID abrufen
    getProductById(id: number): Observable<any> {
      return this.http.get<any>(`${this.BASE_URL}${this.PRODUCT_ENDPOINT}/${id}`);
    }
  
    // ➕ Neues Produkt erstellen
    createProduct(data: any): Observable<any> {
      return this.http.post<any>(`${this.BASE_URL}${this.PRODUCT_ENDPOINT}`, data);
    }
  
    // ✏️ Produkt aktualisieren
    updateProduct(data: any): Observable<any> {
      return this.http.put<any>(`${this.BASE_URL}${this.PRODUCT_ENDPOINT}/${data.productId}`, data);
    }
  
    // 🗑️ Produkt löschen
    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.BASE_URL}${this.PRODUCT_ENDPOINT}/${id}`);
    }
  
    // 📂 Kategorien laden (Oberkategorien)
    getMainCategories(): Observable<any> {
      return this.http.get<any>(`${this.BASE_URL}${this.CATEGORY_ENDPOINT}`);
    }
  
    // 📂 Unterkategorien einer Oberkategorie
    getSubcategories(parentId: number): Observable<any> {
      return this.http.get<any>(`${this.BASE_URL}${this.CATEGORY_ENDPOINT}/${parentId}/subcategories`);
    }
      // Beispiel: Anfrage an den Verkäufer senden
    createRequest(productId: number): Observable<any> {
      return this.http.post<any>(`${this.BASE_URL}${this.PRODUCT_ENDPOINT}/${productId}/request`, {});
    }
  }
  