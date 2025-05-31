import { Routes } from '@angular/router';
import {VehicleSellerComponent} from './components/vehicle-components/vehicle-seller/vehicle-seller.component';
import {UpdateVehicleComponent} from './components/vehicle-components/update-vehicle/update-vehicle.component';
import {VehicleBuyerComponent} from './components/vehicle-components/vehicle-buyer/vehicle-buyer.component';
import {
  VehicleDescriptionViewComponent
} from './components/vehicle-components/vehicle-description-view/vehicle-description-view.component';
import {RegisterComponent} from './components/login-register-components/register/register.component';
import {LoginComponent} from './components/login-register-components/login/login.component';
import {authGuard} from './middleware/guard/auth.guard';
import {loginGuard} from './middleware/guard/login.guard';
import {ChatPageComponent} from './components/chat/chat-page/chat-page.component';
import {
  ListingOverviewComponent
} from './components/real-estate/owner/listing-uebersicht/listing-uebersicht.component';
import {
  RequestUebersichtComponent
} from './components/real-estate/owner/request-uebersicht/request-uebersicht.component';
import {
  DetailedViewComponent
} from './components/real-estate/tenant/detailed-view/detailed-view.component';
import {
  AddRealEstateComponent
} from './components/real-estate/owner/add-real-estate/add-real-estate.component';
import {
  EditRealEstateComponent
} from './components/real-estate/owner/edit-real-estate/edit-real-estate.component';
import {
  SearchBrowserComponent
} from './components/real-estate/tenant/search-browser/search-browser.component';
import {
  RequestOverviewComponentOwner
} from './components/real-estate/tenant/request-overview-owner/request-overview-owner.component';
import {
  ChangePasswordComponent
} from './components/login-register-components/change-password/change-password.component';
import {ChangeEmailComponent} from './components/login-register-components/change-email/change-email.component';
import { ListProductComponent } from './components/retail/owner/list-product/list-product.component';
import {ProductSearchBrowserComponent} from './components/retail/buyer/product-search-browser/product-search-browser.component';
import { ProductDetailComponent } from './components/retail/buyer/product-detail/product-detail.component';

export const routes: Routes = [
  {path: 'vehicle-seller', component: VehicleSellerComponent, canActivate:[authGuard]},
  {path: 'update-vehicle/:id', component: UpdateVehicleComponent, canActivate:[authGuard]},
  {path: 'vehicle-buyer', component:VehicleBuyerComponent, canActivate:[authGuard]},
  {path: 'vehicle-description/:id', component:VehicleDescriptionViewComponent, canActivate:[authGuard]},
  {path: 'register',component:RegisterComponent, canActivate:[loginGuard]},
  {path: 'login',component:LoginComponent, canActivate:[loginGuard]},
  {path: 'change-password',component:ChangePasswordComponent, canActivate:[authGuard]},
  {path: 'change-email', component:ChangeEmailComponent, canActivate:[authGuard]},
  { path: 'chat/:requestId', component: ChatPageComponent, canActivate:[authGuard] },
  { path: 'owner/listings', component: ListingOverviewComponent, canActivate:[authGuard] },
  { path: 'owner/add', component: AddRealEstateComponent , canActivate:[authGuard] },
  { path: 'owner/edit/:id', component: EditRealEstateComponent , canActivate:[authGuard]},
  { path: 'tenant/requests', component: RequestUebersichtComponent , canActivate:[authGuard]},
  { path: 'owner/requests', component: RequestOverviewComponentOwner , canActivate:[authGuard]},
  { path: 'tenant/search', component: SearchBrowserComponent , canActivate:[authGuard]},
  { path: 'tenant/details/:id', component: DetailedViewComponent , canActivate:[authGuard]},
  { path: 'chat/:requestId', component: ChatPageComponent , canActivate:[authGuard]},
  {path: 'real-estate-add', component: AddRealEstateComponent , canActivate:[authGuard]},
  {path: 'real-estate-edit', component: EditRealEstateComponent , canActivate:[authGuard]},
  {path: 'real-estate-browser', component: SearchBrowserComponent , canActivate:[authGuard]},
  {path: 'retail-add', component: ListProductComponent, canActivate:[authGuard]},
  {path: 'retail-browser', component: ProductSearchBrowserComponent, canActivate:[authGuard]},
  {path: 'product-detail/:id', component: ProductDetailComponent, canActivate: [authGuard]}
];
