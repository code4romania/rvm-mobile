import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocationsService } from 'src/app/core/service/locations.service';

@Component({
  selector: 'app-add-volunteer',
  templateUrl: './add-volunteer.component.html',
  styleUrls: ['./add-volunteer.component.scss'],
})
export class AddVolunteerComponent implements OnInit {
  addForm: FormGroup;
  addNewOrganization = false;
  counties = [];
  cities = [];
  organizations = [];
  specializations = [];

  constructor(private formBuilder: FormBuilder,
              private locationsService: LocationsService) { }

  ngOnInit() {
    this.createForm();
    this.getCountyList();   
    this.getOrganizations();
    this.getSpecializations();
  }

  private createForm() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      cnp: ['', Validators.required],
      organization: ['', Validators.required],
      county: new FormControl({value: '', disabled: false}, Validators.required),
      city: new FormControl({value: '', disabled: true}, Validators.required),
      specialization: ['', Validators.required],
    });
  }

  submit() {
    console.log('volunteer added');
  }

  getCountyList() {
    this.locationsService.getCountyList().subscribe((response) => {
      this.counties = response;
    });
  }

  getCityList(county) {
    this.locationsService.getCityList().subscribe((response) => {
      this.cities = response.filter(city => city.county === county);
      if(this.cities.length > 0){
        this.addForm.controls['city'].enable();
      }
    });
  }

  getOrganizations() {
    this.organizations.push({
      id:'1',
      name:'Crucea Roșie'
    });
    
    this.organizations.push({id: '2',
    name: 'Habitat for Humanity'
    });
  }

  getSpecializations() {
    this.specializations.push({
      id:'1',
      name:'prim ajutor'
    });

    this.specializations.push({id: '2',
    name: 'constructii'
    });
  }

  citySelectionChanged(event) {
    this.addForm.controls['city'].setValue(event.detail.value);
  }

  countySelectionChanged(event) {
    this.addForm.controls['county'].setValue(event.detail.value);
    this.getCityList(this.addForm.value.county);
  }

  organizationSelectionChanged(event) {
    if (this.addForm.value.organization === 'new') {
      this.addNewOrganization = true;
      this.addForm.controls['organization'].setValue('');
    } else {
      this.addNewOrganization = false;
      this.addForm.controls['organization'].setValue(event.detail.value);
    }
  }

  specializationSelectionChanged(event) {
    this.addForm.controls['specialization'].setValue(event.detail.value);
  }
}
