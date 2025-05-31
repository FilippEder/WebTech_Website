import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealEstateService } from '../../../../services/real-estate/real-estate.service';
import { CommonModule } from '@angular/common';
import { RealEstate } from '../../../../models/real-estate/real-estate.model';
import { categories, types, cities, provinces } from '../../../../models/real-estate/data/data';

@Component({
  selector: 'app-add-real-estate',
  templateUrl: './add-real-estate.component.html',
  styleUrls: ['./add-real-estate.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
  ],
  standalone: true
})
/**
 * @class AddRealEstateComponent
 * @remarks
 * Facilitates the creation of a new real estate listing by collecting input data and images.
 */
export class AddRealEstateComponent {
  newRealEstate: RealEstate = {} as RealEstate;

  categories = categories;
  types = types;
  cities = cities;
  provinces = provinces;

  constructor(private realEstateService: RealEstateService) {}
  /**
   * @method addRealEstate (AddRealEstateComponent)
   * @remarks
   * Gathers the input data and submits it to the backend to create a new listing.
   */
  addRealEstate() {
    if (!this.newRealEstate.type_attributes) {
      this.newRealEstate.type_attributes = {};
    }
    this.newRealEstate.property_address = `${this.newRealEstate.city_name}, ${this.newRealEstate.province_name}`;
    const formData = new FormData();
    formData.append('real_estate', JSON.stringify(this.newRealEstate));

    if (this.newRealEstate.pictures && this.newRealEstate.pictures.length > 0) {
      this.newRealEstate.pictures.forEach((file: File) => {
        formData.append('pictures', file, file.name);
      });
    }

    this.realEstateService.createListing(formData).subscribe({
      next: (response) => {
        console.log('Listing successfully created:', response);
      },
      error: (err) => {
        console.error('Error creating listing:', err);
      }
    });
  }
  /**
   * @method createPictureArray (AddRealEstateComponent)
   * @remarks
   * Processes the file input event to convert selected images into an array of File objects.
   */
  createPictureArray(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.newRealEstate.pictures = Array.from(fileList);
    }
  }
  /**
   * @method getPictureUrl (AddRealEstateComponent)
   * @remarks
   * Provides a URL for previewing an image, distinguishing between File objects and existing URLs.
   */

  // Hilfsmethode für die Bildvorschau
  getPictureUrl(pic: File | string): string {
    return pic instanceof File ? URL.createObjectURL(pic) : pic;
  }
}
