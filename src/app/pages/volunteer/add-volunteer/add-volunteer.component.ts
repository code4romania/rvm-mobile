import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { OrganizationService,
  VolunteerService,
  LocationsService,
  CourseService } from 'src/app/core/service';

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
  courses = [];

  constructor(private formBuilder: FormBuilder,
              private locationsService: LocationsService,
              private volunteerService: VolunteerService,
              private organizationService: OrganizationService,
              private courseService: CourseService) { }

  ngOnInit() {
    this.createForm();
    this.getCountyList();   
    this.getOrganizations();
    this.getCourses();
  }

  private createForm() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      ssn: ['', Validators.required],
      organization: ['', Validators.required],
      county: new FormControl({value: '', disabled: false}, Validators.required),
      city: new FormControl({value: '', disabled: true}, Validators.required),
      course: ['', Validators.required],
    });
  }

  submit() {
    this.volunteerService.createVolunteer(
      this.addForm.value.name, 
      this.addForm.value.ssn, 
      this.addForm.value.county, 
      this.addForm.value.city, 
      this.addForm.value.organization, 
      this.addForm.value.course);
      // todo add organization id and course id
    
    // todo replace this with something else
    location.reload();
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
    this.organizationService.getOrganizations((result) => {
      result.forEach(row => {
        this.organizations.push(row.doc);
      });
    });
  }

  getCourses() {
    this.courseService.getCourses((result) => {
      result.forEach(row => {
        this.courses.push(row.doc);
      });
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

  courseSelectionChanged(event) {
    this.addForm.controls['course'].setValue(event.detail.value);
  }
}
