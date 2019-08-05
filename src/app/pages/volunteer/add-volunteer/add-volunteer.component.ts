import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonSelect } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { OrganisationService,
  VolunteerService,
  LocationsService,
  CourseService } from 'src/app/core/service';
import { Router } from '@angular/router';

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

  /**
   * Boolean value that contains the status of the new volunteer: affiliated to an organisation (false) or not (true)
   */
  organisationNone = false;

    /**
   * Boolean value that contains the status of the new volunteer: has a course (false) or not (true)
   */
  courseNone = false;

  /**
   * Boolean value that contains the value of the volunteer's organisation's status: belongs to an existing one (false) or belongs to a new organisation (true)
   */
  addNewOrganisation = false;

  /**
   * Boolean value that contains the value of the volunteer's acredited organisation's status for the selected course: belongs to an existing one (false) or belongs to a new organisation (true)
   */
  addNewAcreditedOrganisation = false;

  /**
   * Array with the list of all organisations that have acreditations for a selected course
   */
  acreditedOrganisations = [];

  selectedCourse: any;
  selectedOrganisation: any;

  /**
   * New organisation's name
   */
  newOrganisation = '';
  
  /**
   * 
   * @param formBuilder Provider for reactive form creation
   * @param locationsService Provider for location selection
   * @param volunteerService Provider for volunteer related operations
   * @param organisationService Provider for organisation related operations
   * @param courseService Provider for course related operations
   * @param datePicker Provider for date selection
   * @param router Provider for route navigation
   */
  constructor(private formBuilder: FormBuilder,
              private locationsService: LocationsService,
              private volunteerService: VolunteerService,
              private organisationService: OrganisationService,
              private courseService: CourseService,
              private datePicker: DatePicker,
              private router: Router) { }

  /**
  * Page initialisation
  */
  ngOnInit() {
    this.createForm();
    this.getCountyList();   
    this.getOrganisations();
    this.getCourses();
  }

  /**
   * Form initialisation
   */
  private createForm() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      ssn: ['', Validators.required],
      phone: ['', Validators.required],
      organisation: ['', Validators.required],
      county: new FormControl({value: '', disabled: false}, Validators.required),
      city: new FormControl({value: '', disabled: true}, Validators.required),
      course: new FormControl({value: '', disabled: false}),
      acreditedOrganisation: new FormControl({value: '', disabled: false})
    });
  }

  /**
   * Form submittion;
   * It prepares the values that are going to be sent to the volunteer service
   */
  submit() {
    this.computeSelectedOrganisation();
    
    if(this.courseNone) {
      this.addForm.controls['course'].setValue('');
      this.selectedCourse = null;
    }

    this.createVolunteer();
  }

  /**
   * Computes the selected organisation
   */
  computeSelectedOrganisation() {
    if(this.organisationNone) {
      this.addForm.controls['organisation'].setValue('');
      this.selectedOrganisation = null;
    }
    
    if(this.newOrganisation) {
      this.organisationService.createOrganisation(this.newOrganisation).subscribe((data: any) => {   
      this.organisationService.getOrganisationById(data.id).subscribe((result: any) => {
        this.selectedOrganisation = result.docs[0];
        });
      });
     }
  }

  /**
   * Sends the proper values to the volunteer service
   */
  private createVolunteer() {
    this.volunteerService.createVolunteer(
      this.addForm.value.name, 
      this.addForm.value.ssn.toString(), 
      this.addForm.value.phone.toString(), 
      this.addForm.value.county, 
      this.addForm.value.city, 
      this.selectedOrganisation,
      this.selectedCourse).subscribe(() => {
        this.router.navigate(['/home'], {
          replaceUrl: true
        });
      });
  }

  /**
   * Retrives the list of counties from the locations service
   */
  private getCountyList() {
    this.locationsService.getCountyList().subscribe((response) => {
      this.counties = response;
    });
  }

  /**
   * Retrives the list of cities from a selected county from the locations service
   */
  private getCityList(county) {
    this.locationsService.getCityList().subscribe((response) => {
      this.cities = response.filter(city => city.county === county);
      if(this.cities.length > 0){
        this.addForm.controls['city'].enable();
      }
    });
  }

  /**
   * Retrieves the list of organisations from the organisations service
   */
  private getOrganisations() {
    this.organisationService.getOrganisations().subscribe((result: any) =>{
      result.rows.forEach(row => {
        this.organisations.push(row.doc);
      });
    });
  }

  /**
   * Retrieves the list of courses from the courses service
   */
  private getCourses() {
    // this.courseService.getCourses().subscribe((response: any) =>{
    //   const data = response.rows.filter(item => item.doc.language !== 'query');
     
    //   this.courses = data.map(item => item.doc.name).filter((value, index, self) => self.indexOf(value) === index);
    // });
    this.courses = ['prim-ajutor', 'constructii'];
  }

  /**
   * When a city is selected, the form's value is updated
   * @param event Changing event, triggered when a change is detected on an element
   */
  citySelectionChanged(event) {
    this.addForm.controls['city'].setValue(event.detail.value);
  }

  /**
   * When a county is selected, the form's value is updated and starts retriving the list of cities from that county
   * @param event Changing event, triggered when a change is detected on an element
   */
  countySelectionChanged(event) {
    this.addForm.controls['county'].setValue(event.detail.value);
    this.getCityList(this.addForm.value.county);
  }

  /**
   * When an organisation is selected, the UI will be changed to the selection
   * @param event Changing event, triggered when a change is detected on an element
   */
  organisationSelectionChanged(event) {
    if (this.addForm.value.organisation === 'new') {
      this.addForm.value.organisation === '';
      this.addNewOrganisation = true;      
    } else {
      this.selectedOrganisation = this.organisations.find(organisation => organisation._id === event.detail.value);
      this.addNewOrganisation = false;
    }
  }

  /**
   * When an acreditor organisation is selected, the selection is updated as well
   * @param event Changing event, triggered when a change is detected on an element
   */
  acreditedOrganisationSelectionChanged(event) {
    if(this.addForm.value.acreditedOrganisation === 'new'){
      this.addNewAcreditedOrganisation = true;
    } else {
      this.addNewAcreditedOrganisation = false;
    }
  }

  /**
   * When a course is selected, the acreditor organisations pop-up select is automatically triggered, 
   * Containing the organisations that are acreditors for the selected course
   */
  courseSelectionChanged() {   
    this.selectedCourse = {
      name: this.addForm.value.course
    };
    this.courseService.getCourseByName(this.addForm.value.course).subscribe((response: any) => {
      this.acreditedOrganisations = response.docs;
    });
  }

  /**
   * Checks if the given ssn code exists in the local database and invalidates the form if the ssn already exists in database
   */
  ssnExists(event) {
    const ssn = event.detail.value;
    this.volunteerService.getVolunteerBySsn(ssn.trim()).subscribe((response) => {
      if(response.docs.length > 0){
        this.addForm.controls['ssn'].setErrors({'incorrect': true});
        this.addForm.setErrors({'incorrect-ssn': true});
      }
    });
  }

  /**
   * Triggers a date picker pop-up after a course is added in order to take the course acreditation date
   */
  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        this.selectedCourse.obtained = date;
      },
      err => {
        this.selectedCourse.obtained = new Date();
      }
    );
  }
}
