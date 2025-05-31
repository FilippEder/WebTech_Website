import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RealEstateService } from '../../../../services/real-estate/real-estate.service';

@Component({
  selector: 'app-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
/**
 * @class DetailedViewComponent
 * @remarks
 * Displays detailed information about a selected real estate listing.
 */
export class DetailedViewComponent implements OnInit {
  listing: any = null;

  constructor(
    private route: ActivatedRoute,
    private realEstateService: RealEstateService
  ) {}
  /**
   * @method ngOnInit (DetailedViewComponent)
   * @remarks
   * Extracts the listing ID from the URL and loads the corresponding listing details.
   */
  ngOnInit(): void {
    // Hole die Listing-ID aus der URL (zum Beispiel über /tenant/details/:id)
    const listingId = this.route.snapshot.paramMap.get('id');
    if (listingId) {
      this.realEstateService.getListingByRealEstateId(+listingId).subscribe({
        next: (data) => {
          this.listing = data;
          console.log(data)
        },
        error: (error) => {
          console.error('Error fetching listing details:', error);
        }
      });
    }
  }
}
