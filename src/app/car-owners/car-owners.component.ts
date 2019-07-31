import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car/car.service';
import { OwnerService } from '../shared/owner/owner.service';
import { GiphyService } from '../shared/giphy/giphy.service';

@Component({
  selector: 'app-car-owners',
  templateUrl: './car-owners.component.html',
  styleUrls: ['./car-owners.component.css']
})
export class CarOwnersComponent implements OnInit {
  cars: Array<any>;
  owners: Array<any>;
  carOwners: Array<any> = [];


  constructor(private carService: CarService, private giphyService: GiphyService, private ownerService: OwnerService) { }

  async ngOnInit() {
    
    this.ownerService.getAll().subscribe(data => {
      this.owners = data._embedded.owners;
      });

    this.carService.getAll().subscribe(data => {
        this.cars = data;
        for (const car of this.cars) {
          if(car.ownerDni !== null){
            this.ownerService.get(car.ownerDni).subscribe((owner: any) => {
              const car_name = car.name;
              let owner_name = null;
              if (owner[0] !== undefined){
                owner_name = owner[0].name;
              }
              this.giphyService.get(car.name).subscribe(url => {
                this.carOwners.push({
                  "owner_name": owner_name,
                  "car_name": car_name,
                  "giphyUrl": url
                });
              });      
            });
          }
        }
      })
    
      

      

    console.log(this.carOwners);
  }
}
