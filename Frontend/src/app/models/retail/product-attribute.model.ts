import { Attribute } from "@angular/core";

export interface ProductAttribute {
    productId: number;
    attributeId: number;
    attributeValue: number;
    attribute?: Attribute;
  }
  