import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * @class RealEstateService
 * @remarks
 * Provides CRUD operations for real estate listings and manages related requests.
 */
export class RealEstateService {
  // Gemeinsamer Nenner: Basis-URL der API
  private readonly BASE_URL = 'http://localhost:3000';
  // Spezifische Endpunkte
  private readonly REAL_ESTATE_ENDPOINT = '/api/immobilien';
  private readonly REQUESTS_ENDPOINT = '/api/immobilien/requests';
  private  readonly REAL_ESTATE_DETAIL = 'detail';

  constructor(private http: HttpClient) {}
  /**
   * @method getAllListingsByCriteria (RealEstateService)
   * @remarks
   * Retrieves listings that match the specified filter criteria.
   */
  // Neue Methode: Alle Listings anhand optionaler Filterkriterien abrufen.
  getAllListingsByCriteria(criteria: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(criteria).forEach(key => {
      if (criteria[key] !== null && criteria[key] !== '' && criteria[key] !== undefined) {
        params = params.set(key, criteria[key]);
      }
    });
    return this.http.get<any>(`${this.BASE_URL}${this.REAL_ESTATE_ENDPOINT}`, { params });
  }

  /**
   * @method getAllRequestsByRequester (RealEstateService)
   * @remarks
   * Retrieves all requests submitted by the current user.
   */

  // Anfragen (Requests) abrufen: nun über den neuen Endpunkt /requester/:requesterId
  getAllRequestsByRequester(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${this.REQUESTS_ENDPOINT}/requester`);
  }

  /**
   * @method getAllListingsByOwner (RealEstateService)
   * @remarks
   * Retrieves all listings associated with a specific property owner.
   */

  // Alle Listings eines bestimmten Eigentümers abrufen
  getAllListingsByOwner(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${this.REQUESTS_ENDPOINT}/owner`);
  }
  /**
   * @method getListingByUserId (RealEstateService)
   * @remarks
   * Retrieves a single listing based on the user ID, typically used for owner listings.
   */
  // Ein einzelnes Listing anhand der ID abrufen
  getListingByUserId(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${this.REAL_ESTATE_ENDPOINT}/speziel`);
  }
  /**
   * @method getListingByRealEstateId (RealEstateService)
   * @remarks
   * Retrieves detailed information for a listing based on its unique real estate ID.
   */
// Ein einzelnes Listing anhand der ID abrufen
  getListingByRealEstateId(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}${this.REAL_ESTATE_ENDPOINT}/${this.REAL_ESTATE_DETAIL}/${id}`);
  }
  /**
   * @method createListing (RealEstateService)
   * @remarks
   * Submits new real estate data to the backend to create a listing.
   */
  // Neues Listing erstellen
  createListing(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}${this.REAL_ESTATE_ENDPOINT}`, data);
  }
  /**
   * @method updateListing (RealEstateService)
   * @remarks
   * Updates existing real estate data in the backend.
   */
  // Bestehendes Listing aktualisieren
  updateListing(data: any): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}${this.REAL_ESTATE_ENDPOINT}/${data.listing_id}`, data);
  }
  /**
   * @method deleteListing (RealEstateService)
   * @remarks
   * Deletes a listing from the backend based on its ID.
   */
  // Listing löschen
  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}${this.REAL_ESTATE_ENDPOINT}/${id}`);
  }
  /**
   * @method createRequest (RealEstateService)
   * @remarks
   * Creates a new request for a real estate listing.
   */
  createRequest(realEstateId: number): Observable<any> {
    const payload = {
      listing_id: realEstateId,
      listing_type: 'RealEstate'
    };

    return this.http.post<any>(`${this.BASE_URL}${this.REQUESTS_ENDPOINT}`, payload);
  }
}
