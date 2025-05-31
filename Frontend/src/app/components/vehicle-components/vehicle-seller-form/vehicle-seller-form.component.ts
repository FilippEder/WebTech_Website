import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Mark} from '../../../models/vehicle-models/Mark';
import {Model} from '../../../models/vehicle-models/Model';
import {Type} from '../../../models/vehicle-models/Type';
import {MarkService} from '../../../services/mark/mark.service';
import {ModelService} from '../../../services/model/model.service';
import {TypeService} from '../../../services/type/type.service';
import {Picture} from '../../../models/vehicle-models/Picture';
import {VehicleService} from '../../../services/vehicle/vehicle.service';

@Component({
  selector: 'app-vehicle-seller-form',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './vehicle-seller-form.component.html',
  styleUrl: './vehicle-seller-form.component.css'
})
export class VehicleSellerFormComponent implements OnInit{
  @Input() form!: FormGroup;
  @Input() submitButtonText: string =''
  @Input() updatingImages: Picture[] = []
  @Output() formSubmit = new EventEmitter<void>()

  constructor(private readonly vehicleService:VehicleService,
              private readonly markService:MarkService,
              private readonly modelService:ModelService,
              private readonly typeService:TypeService) {
  }
  isValid:boolean = true

  marks: Mark[] =[]
  models: Model[] =[]
  types: Type[] = []
  selectedFiles: any[] = []
  previews: string[] = []
  maxFiles:number = 5;
  //Max MB size for all car images
  maxImagesSize:number = 15;

  ngOnInit() {
    let formValues = this.form.value
    this.getMarks(formValues.category);
    this.getTypes(formValues.category);
    if(formValues.mark!=""){
      this.getModels(formValues.mark)
    } else {
      this.form.get('model')?.disable()
    }
  }

  getMarks(categoryId:string){
    if(categoryId!="")
    this.markService.getMark(categoryId).subscribe({
      next: (response)=>{
        this.marks = response;
      },
      error:(err)=>{
        console.error('Error',err)
      }
    })
  }

  getModels(markId:string){
    if(markId!="")
      this.modelService.getModel(markId).subscribe({
        next: (response) =>{
          this.models = response;
          this.checkModels()
        },
        error:(err)=>{
          console.error('Error',err)
        }
      })
  }

  getTypes(categoryId:string){
    if(categoryId!="")
    this.typeService.getType(categoryId).subscribe({
      next: (response) =>{
        this.types = response;
      },
      error:(err)=>{
        console.error('Error',err)
      }
    })
  }

  onCategoryChange(event:Event){
    let categoryId=(event.target as HTMLInputElement).value
    this.getMarks(categoryId)
    this.getTypes(categoryId)
    this.form.get('model')?.disable()
    this.clearSelection('mark')
    this.clearSelection('model')
    this.clearSelection('type')
  }

  onMarkChange(event:Event){
    let markId=(event.target as HTMLInputElement).value
    this.clearSelection('model')
    this.getModels(markId)
  }

  onSubmit(): void{
    if(this.form.valid){
      this.isValid = true;
      if(this.selectedFiles) {
        this.form.value.images = this.selectedFiles
      }
      this.formSubmit.emit();
    }else{
      this.isValid = false;
    }
  }

  checkModels(){
    if(this.models.length != 0) {
      this.form.get('model')?.enable()
    }else{
      this.form.get('model')?.disable()
    }
  }

  clearSelection(selectId:string){
    const selectedElement:HTMLInputElement = (document.getElementById(selectId)as HTMLInputElement)
    selectedElement.value = "";
    this.form.get(selectId)?.setValue("")
  }

  async onFilesSelected(event:Event){
    let input = event.target as HTMLInputElement;
    let totalSize = 0;
    const maxSize = this.maxImagesSize * 1024 * 1024

    if(input.files) {
      for (const element of input.files) {
        totalSize += element.size
      }

      for (const element of this.selectedFiles){
        totalSize += element.size
      }

      const backendImageSize = await Promise.all(
        this.updatingImages.map(async (element)=>{
          return await this.getImageSize(`http://localhost:3000/${element.picture_url}`)
        })
      )

      backendImageSize.forEach(size =>{
        totalSize += size;
      })

      if(totalSize >= maxSize){
        alert(`Total size of files exceeds ${this.maxImagesSize}MB limit`)
        return;
      }

      const files = Array.from(input.files)

      if(files.length + this.selectedFiles.length > this.maxFiles){
        alert(`You can only upload ${this.maxFiles} images`)
        return;
      }

      this.selectedFiles.push(...files)

      files.forEach(file =>{this.previews.push(URL.createObjectURL(file))})
      this.previews.push()
    }
  }

  deleteImageFromBackend(index:number,picture_id:number){
    this.vehicleService.deletePicture(picture_id).subscribe({
      next: (res)=>{
        this.updatingImages.splice(index,1)
        console.log(res)
      },
      error:(err)=>{
        console.error('Error',err)
      }
    })
  }

  removeLocalImage(index :number,fileInput:HTMLInputElement){
    this.selectedFiles.splice(index,1);
    this.previews.splice(index,1)

    fileInput.value = '';

    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach(file => dataTransfer.items.add(file))
    fileInput.files = dataTransfer.files
  }

  async getImageSize(url:string){
    const response = await fetch(url, {method: 'HEAD'});

    if(response.ok){
      const contentLength = response.headers.get('Content-Length');
      return contentLength ? parseInt(contentLength, 10):0;
    }else{
      throw new Error('Failed to fetch image headers')
    }
  }

  preventSigns(event: KeyboardEvent){
    if(event.key === '-' || event.key === '+'){
      event.preventDefault()
    }
  }
}
