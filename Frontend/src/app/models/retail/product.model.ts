import { ProductPicture } from "./product-picture.model";
import { ProductAttribute } from "./product-attribute.model";

export interface Product {
    productId: number;
    user_id: number;
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    delivery_method?: string;
    condition?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    pictures?: ProductPicture[];
    productAttributes?: ProductAttribute[];
  }

