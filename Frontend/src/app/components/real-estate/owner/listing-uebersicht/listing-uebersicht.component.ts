import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RealEstateService } from '../../../../services/real-estate/real-estate.service';

@Component({
  selector: 'app-listing-overview',
  templateUrl: 'listing-uebersicht.component.html',
  styleUrls: ['./listing-uebersicht.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
/**
 * @class ListingOverviewComponent
 * @remarks
 * Displays an overview of the owner’s real estate listings and supports various management actions.
 */
export class ListingOverviewComponent implements OnInit {
  listings: any[] = [];

  constructor(
    private readonly realEstateService: RealEstateService,
    private readonly router: Router
  ) {}
  /**
   * @method ngOnInit (ListingOverviewComponent)
   * @remarks
   * Initializes the component and loads the list of listings for the owner.
   */
  ngOnInit(): void {
    this.loadListings();
  }
  /**
   * @method loadListings (ListingOverviewComponent)
   * @remarks
   * Retrieves all real estate listings for the current owner from the backend.
   */
  // Lädt alle Listings aus dem Backend
  loadListings(): void {
    // Hier könntest du später die owner_id dynamisch aus dem JWT holen
    this.realEstateService.getListingByUserId().subscribe({
      next: (data) => {
        this.listings = data;
      },
      error: (err) => console.error('Fehler beim Laden der Listings:', err)
    });
  }
  /**
   * @method deleteListing (ListingOverviewComponent)
   * @remarks
   * Deletes a selected listing and refreshes the listings overview.
   */
  // Löscht ein Listing und lädt die Übersicht neu
  deleteListing(listingId: number): void {
    this.realEstateService.deleteListing(listingId).subscribe({
      next: () => {
        console.log('Listing gelöscht:', listingId);
        this.loadListings();
      },
      error: (err) => console.error('Fehler beim Löschen des Listings:', err)
    });
  }
  /**
   * @method goToChat (ListingOverviewComponent)
   * @remarks
   * Placeholder for navigating to the chat functionality related to a listing.
   */
  // Platzhalter: Leitet zur Chat-Komponente weiter (noch zu implementieren)
  goToChat(listingId: number): void {
    console.log('Chat für Listing', listingId);
    // Beispiel: this.router.navigate(['/chat', requestId]);
  }
  /**
   * @method editListing (ListingOverviewComponent)
   * @remarks
   * Navigates to the edit view for the selected listing to modify its details.
   */
  // Leitet zur Edit-Komponente weiter und lädt die Detailwerte des Listings
  editListing(listingId: number): void {
    this.router.navigate(['/owner/edit', listingId]);
  }
  /**
   * @method toggleStatus (ListingOverviewComponent)
   * @remarks
   * Toggles the status of a listing between "Open" and "Rented" and updates it in the backend.
   */
  toggleStatus(listing: any): void {
    // Status toggeln
    listing.status = listing.status === 'Open' ? 'Rented' : 'Open';

    // FormData erstellen und das geänderte Listing unter dem Key "real_estate" anhängen
    const formData = new FormData();
    formData.append('real_estate', JSON.stringify(listing));

    // updateListing mit nur einem Argument (FormData) aufrufen – analog zur Edit-Methode
    this.realEstateService.updateListing(formData).subscribe({
      next: (response) => console.log('Status successfully updated for listing:', listing.real_estate_id),
      error: (error) => console.error('Error updating status:', error)
    });
  }


  /**
   * @method getPictureUrl (ListingOverviewComponent)
   * @remarks
   * Returns the URL of the first image for a listing, used for preview purposes.
   */
  // Hilfsmethode: Gibt die URL des ersten Bildes zurück (oder einen Platzhalter)
  getPictureUrl(listing: any) {
    if (listing.incoming_picture_urls && listing.incoming_picture_urls.length > 0) {
      return listing.incoming_picture_urls[0];
    }
  }
}
