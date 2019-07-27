import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonSelect } from '@ionic/angular';

import { OrganisationService,
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
  counties = [];
  cities = [];
  organisations = [];
  courses = [];
  organisationNone = false;
  addNewOrganisation = false;
  acreditedOrganisations = [];
  selectedCourse: any;
  selectedOrganisation: any;
  newOrganisation = '';
  @ViewChild('acreditedOrganisation') acreditedOrganisationSelect: IonSelect;

  constructor(private formBuilder: FormBuilder,
              private locationsService: LocationsService,
              private volunteerService: VolunteerService,
              private organisationService: OrganisationService,
              private courseService: CourseService) { }

  ngOnInit() {
    this.createForm();
    this.getCountyList();   
    this.getOrganisations();
    this.getCourses();
  }

  private createForm() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      ssn: ['', Validators.required],
      organisation: ['', Validators.required],
      county: new FormControl({value: '', disabled: false}, Validators.required),
      city: new FormControl({value: '', disabled: true}, Validators.required),
      course: ['', Validators.required],
      acreditedOrganisation: ['', Validators.required],
    });
  }

  submit() {
    if(this.newOrganisation) {
      this.organisationService.createOrganisation(this.newOrganisation).subscribe((data: any) => {   
        this.organisationService.getOrganisationById(data.id).subscribe((result: any) => {
          this.selectedOrganisation = result.docs[0];
          this.createVolunteer();
        });
      });
    }

    if(this.organisationNone) {
      this.selectedOrganisation = null;
      this.addForm.controls['organisation'].setValue('');
      this.createVolunteer();
    }

    if(!this.newOrganisation && !this.organisationNone) {
      this.createVolunteer();
    }
  }

  createVolunteer() {
    this.volunteerService.createVolunteer(
      this.addForm.value.name, 
      this.addForm.value.ssn.toString(), 
      this.addForm.value.county, 
      this.addForm.value.city, 
      this.selectedOrganisation,
      this.selectedCourse).subscribe(() => {
        location.reload();
      });
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

  getOrganisations() {
    this.organisationService.getOrganisations().subscribe((result: any) =>{
      result.rows.forEach(row => {
        this.organisations.push(row.doc);
      });
    });
  }

  getCourses() {
    this.courseService.getCourses().subscribe((response: any) =>{
      const data = response.rows.filter(item => item.doc.language !== 'query');
     
      this.courses = data.map(item => item.doc.name).filter((value, index, self) => self.indexOf(value) === index);
    });
  }

  citySelectionChanged(event) {
    this.addForm.controls['city'].setValue(event.detail.value);
  }

  countySelectionChanged(event) {
    this.addForm.controls['county'].setValue(event.detail.value);
    this.getCityList(this.addForm.value.county);
  }

  organisationSelectionChanged(event) {
    if (this.addForm.value.organisation === 'new') {
      this.addForm.value.organisation === '';
      this.addNewOrganisation = true;      
    } else {
      this.selectedOrganisation = this.organisations.find(organisation => organisation._id === event.detail.value);
      this.addNewOrganisation = false;
    }
  }

  acreditedOrganisationSelectionChanged(event) {
    this.selectedCourse = this.acreditedOrganisations.find(acreditor => acreditor._id === event.detail.value);
  }

  courseSelectionChanged() {   
    this.courseService.getCourseByName(this.addForm.value.course).subscribe((response: any) => {
      this.acreditedOrganisations = response.docs;
    });
    this.acreditedOrganisationSelect.open();
  }
}
