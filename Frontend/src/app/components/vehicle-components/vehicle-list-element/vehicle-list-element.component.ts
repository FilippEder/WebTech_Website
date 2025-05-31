import {Component, Input} from '@angular/core';
import {Vehicle} from '../../../models/vehicle-models/Vehicle';
import {DatePipe} from '@angular/common';
import {Picture} from '../../../models/vehicle-models/Picture';

@Component({
  selector: 'app-vehicle-list-element',
  imports: [
    DatePipe
  ],
  templateUrl: './vehicle-list-element.component.html',
  styleUrl: './vehicle-list-element.component.css'
})
export class VehicleListElementComponent {
  @Input() vehicle!:Vehicle
  @Input() image?: Picture
}
