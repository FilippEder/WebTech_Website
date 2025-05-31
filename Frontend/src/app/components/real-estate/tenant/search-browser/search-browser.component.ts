import { Component, OnInit } from '@angular/core';
import { RealEstateService } from '../../../../services/real-estate/real-estate.service'; // Importiere den Service
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { categories, types, cities, provinces } from '../../../../models/real-estate/data/data';

@Component({
  selector: 'app-search-browser',
  templateUrl: './search-browser.component.html',
  styleUrls: ['./search-browser.component.scss'],
  imports: [
    CommonModule,
    FormsModule,

  ],
  standalone: true
})
/**
 * @class SearchBrowserComponent
 * @remarks
 * This component allows tenants to search for real estate listings using various filter criteria.
 */
export class SearchBrowserComponent implements OnInit {
  listings: any[] = [];
  filteredListings: any[] = [];

  filter: any = {
    searchText: '',
    category: '',
    type: '',
    priceMin: null,
    priceMax: null,
    rentalPeriod: null,
    province: '',
    city: '',
    immediateAvailability: '',
    // Neue Felder:
    floorArea: null,
    garden: '',
    floorLevel: null,
    balcony: '',
    roofTerrace: '',
    luxury: ''
  };


  categories = categories;
  types = types;
  cities = cities;
  provinces = provinces;

  constructor(
    private realEstateService: RealEstateService,
    private router: Router
  ) {}
  /**
   * @method ngOnInit (SearchBrowserComponent)
   * @remarks
   * Initializes the component and loads all available listings for the search browser.
   */
  ngOnInit() {
    this.getAllListingsForSearchBrowser();
  }
  /**
   * @method getAllListingsForSearchBrowser (SearchBrowserComponent)
   * @remarks
   * Retrieves all listings from the service based on the current filter criteria.
   */

  getAllListingsForSearchBrowser() {
    this.realEstateService.getAllListingsByCriteria(this.filter).subscribe({
      next: (response) => {
        // Nur Listings mit Status "Open" übernehmen
        const openListings = response.filter((listing: any) => listing.status === 'Open');
        this.listings = openListings;
        this.filteredListings = openListings;
      },
      error: (err) => {
        console.error('Error fetching listings:', err);
      }
    });
  }


  /**
   * @method applyFilter (SearchBrowserComponent)
   * @remarks
   * Applies the specified filter criteria to the list of listings.
   */
  applyFilter() {
    this.filteredListings = this.listings.filter((listing: any) => {
      const searchTextMatch = this.filter.searchText ?
        (listing.property_name.toLowerCase().includes(this.filter.searchText.toLowerCase()) ||
          listing.description.toLowerCase().includes(this.filter.searchText.toLowerCase())) : true;

      const categoryMatch = this.filter.category ? listing.category_name === this.filter.category : true;
      const typeMatch = this.filter.type ? listing.type_name === this.filter.type : true;
      const priceMatch = (this.filter.priceMin == null || listing.rental_price >= this.filter.priceMin) &&
        (this.filter.priceMax == null || listing.rental_price <= this.filter.priceMax);
      const periodMatch = this.filter.rentalPeriod == null || listing.rental_period === this.filter.rentalPeriod;
      const provinceMatch = this.filter.province ? listing.province_name === this.filter.province : true;
      const cityMatch = this.filter.city ? listing.city_name === this.filter.city : true;
      const availabilityMatch = this.filter.immediateAvailability !== '' ?
        String(listing.immediate_availability) === this.filter.immediateAvailability : true;

      return searchTextMatch && categoryMatch && typeMatch && priceMatch &&
        periodMatch && provinceMatch && cityMatch && availabilityMatch;
    });
  }

  /**
   * @method getPictureUrl (SearchBrowserComponent)
   * @remarks
   * Returns the URL of the first available image for a listing, used for display purposes.
   */
  getPictureUrl(listing: any) {
    if (listing.incoming_picture_urls && listing.incoming_picture_urls.length > 0) {
      return listing.incoming_picture_urls[0];
    }
  }

  /**
   * @method viewDetails (SearchBrowserComponent)
   * @remarks
   * Navigates to the detailed view of a selected real estate listing.
   */
  viewDetails(listingId: number) {
    this.router.navigate(['/tenant/details', listingId]);
  }
  /**
   * @method sendRequest (SearchBrowserComponent)
   * @remarks
   * Sends a request for a listing using the associated real estate service.
   */
  sendRequest(realEstateId: number) {
    this.realEstateService.createRequest(realEstateId)
        .subscribe(
            response => {
              console.log('Request erfolgreich gesendet:', response);
            },
            error => {
              console.error('Fehler beim Senden des Requests:', error);
            }
        );
  }

}
