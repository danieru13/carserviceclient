import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../shared/owner/owner.service';
import { CarService } from '../shared/car/car.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit, OnDestroy {
  owner: any = {};
  cars: Array<any>;

  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ownerService: OwnerService,
              private carService: CarService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const dni = params['dni'];
      if (dni) {
        this.ownerService.get(dni).subscribe((owner: any) => {
          if (owner) {
            this.owner = owner[0];
            this.owner.href = this.ownerService.OWNER_API + '/' + this.owner.id;
          } else {
            console.log(`Owner with dni '${dni}' not found, returning to list`);
            this.gotoList();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  save(form: NgForm) {
    this.ownerService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  remove(href) {
    let dni = this.owner.dni;
    this.removeOwnerFromCar(dni);
    this.ownerService.remove(href).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));

  }

  removeOwnerFromCar(dni){
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const car of this.cars) {
        if(car.ownerDni === dni) {
          car.ownerDni = null;
          this.carService.save(car).subscribe( result => {

          }, error => console.error(error));
        }
      }
  });
  }
}
