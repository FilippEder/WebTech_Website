import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RetailMarketplaceService } from '../../../../services/retail/retail-marketplace.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;

  constructor(
    private route: ActivatedRoute,
    private retailMarketplaceService: RetailMarketplaceService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(productId);
  }

  loadProduct(productId: number): void {
    this.retailMarketplaceService.getProductById(productId).subscribe({
      next: (response) => {
        this.product = response;
      },
      error: (err) => {
        console.error('Fehler beim Laden des Produkts:', err);
      }
    });
  }

  getPictureUrl(pic: any): string {
    return pic.pictureURL;
  }
}
