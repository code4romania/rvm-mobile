import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { OrganisationService,
  VolunteerService,
  StaticsService,
  CourseService } from 'src/app/core/service';
import { Router } from '@angular/router';
import { SsnValidation } from 'src/app/core/validators/ssn-validation';
import { PhoneValidation } from 'src/app/core/validators/phone-validation';
import { ModalController } from '@ionic/angular';
import { CustomSelectorComponent } from 'src/app/core/components/custom-selector/custom-selector.component';

@Component({
  selector: 'app-add-volunteer',
  templateUrl: './add-volunteer.component.html',
  styleUrls: ['./add-volunteer.component.scss']
})

export class AddVolunteerComponent implements OnInit {
  /**
   * Form for a new volunteer
   */
  addForm: FormGroup;

  /**
   * List of all available counties
   */
  counties = [];

  /**
   * List of all available cities
   */
  cities = [];

  /**
   * List of all available organisations
   */
  organisations = [];

  /**
   * List of all available courses
   */
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
   * Boolean value that contains the value of the volunteer's organisation's status:
   * belongs to an existing one (false) or belongs to a new organisation (true)
   */
  addNewOrganisation = false;

  selectedCourse: any = {};
  selectedOrganisation: any;

  /**
   * New organisation's name
   */
  newOrganisation = '';

  /**
   *
   * @param formBuilder Provider for reactive form creation
   * @param staticsService Provider for location selection
   * @param volunteerService Provider for volunteer related operations
   * @param organisationService Provider for organisation related operations
   * @param courseService Provider for course related operations
   * @param router Provider for route navigation
   * @param modalController Controller for modal operations
   */
  constructor(private formBuilder: FormBuilder,
              private staticsService: StaticsService,
              private volunteerService: VolunteerService,
              private organisationService: OrganisationService,
              private courseService: CourseService,
              private router: Router,
              public modalController: ModalController) { }

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
      ssn: ['', [Validators.required, SsnValidation.ssnValidation]],
      phone: ['', [Validators.required, PhoneValidation.phoneValidation]],
      organisation: ['', Validators.required],
      county: new FormControl({value: '', disabled: false}, Validators.required),
      city: new FormControl({value: '', disabled: true}, Validators.required),
      course: new FormControl({value: '', disabled: false}, Validators.required)
    });
  }

  /**
   * Form submittion;
   * It prepares the values that are going to be sent to the volunteer service
   */
  submit() {
    if (this.organisationNone) {
      this.addForm.controls['organisation'].setValue('');
      this.selectedOrganisation = null;
      this.createVolunteer();
    } else {
      if (this.newOrganisation) {
        this.organisationService.createOrganisation(this.newOrganisation).subscribe((data: any) => {
          this.organisationService.getOrganisationById(data._id).subscribe((result: any) => {
            this.selectedOrganisation = result.docs[0];
            this.createVolunteer();
          });
        });
      } else {
        this.selectedOrganisation = this.addForm.value.organisation;
        this.selectedCourse = this.addForm.value.course;
        this.createVolunteer();
      }
    }
  }

  /**
   * Sends the proper values to the volunteer service
   */
  private createVolunteer() {
    if (this.courseNone) {
      this.addForm.controls['course'].setValue('');
      this.selectedCourse = null;
    }

    this.volunteerService.createVolunteer(
      this.addForm.value.name,
      String(this.addForm.value.ssn),
      this.addForm.value.phone,
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
    this.staticsService.getCountyList().subscribe((response) => {
      this.counties = response.rows.map(x => x.doc);

      if (this.counties[0]) {
        this.staticsService.getCityList(this.counties[0]._id).subscribe((res) => {
          this.cities = res.rows
            .map(x => ({
              _id: x.id,
              name: x.value
            }));
        });
      }
    });
  }

  /**
   * Retrieves the list of organisations from the organisations service
   */
  private getOrganisations() {
    this.organisationService.getOrganisations().subscribe((result: any) => {
      result.docs.forEach(doc => {
        this.organisations.push(doc);
      });
    });
    this.organisations.push({_id: 'new', name: 'Adaugă organizație nouă'});
  }

  /**
   * Retrieves the list of courses from the courses service
   */
  private getCourses() {
    this.courseService.getCourseNames().subscribe((response: any) => {
      this.courses = response.docs;
    });
  }

  /**
   * When a county is selected, the form's value is updated
   * @param event Changing event, triggered when a change is detected on an element
   */
  countySelectionChanged(event: any) {
    this.addForm.controls['county'].setValue(event.detail.value);

    const countyId = this.addForm.value.county._id;
    this.staticsService.getCityList(countyId).subscribe((response) => {
      this.cities = response.rows
        .map(x => ({
          _id: x.id,
          name: x.value
        }));
      this.addForm.controls['city'].reset('');
      this.addForm.controls['city'].enable();
    });
  }

  /**
   * When an organisation is selected, the UI will be changed to the selection
   * @param event Changing event, triggered when a change is detected on an element
   */
  organisationSelectionChanged(event: any) {
    if (event.detail && event.detail.value && event.detail.value._id === 'new') {
      this.addForm.value.organisation = '';
      this.addNewOrganisation = true;
    } else {
      this.selectedOrganisation = this.organisations.find(organisation => organisation._id === event.detail.value);
      this.addNewOrganisation = false;
    }
  }

  /**
   * When a course is selected, the acreditor organisations pop-up select is automatically triggered,
   * Containing the organisations that are acreditors for the selected course
   */
  courseSelectionChanged() {
    this.selectedCourse = this.addForm.value.course;
  }

  /**
   * Checks if the given ssn code exists in the local database and invalidates the form if the ssn already exists in database
   * @param event Current event that triggered the function call
   */
  ssnExists(event: any) {
    const ssn = event.detail.value;
    this.volunteerService.getVolunteerBySsn(ssn.trim()).subscribe((response) => {
      if (response.docs.length > 0) {
        this.addForm.controls['ssn'].setErrors({'ssn': 'CNP introdus există deja.'});
      }
    });
  }

  /**
   * Triggered when 'Neafiliat' option is selected; updates the form so that organisation is no longer required
   */
  organisationNoneChanged() {
    if (this.organisationNone) {
      this.addForm.controls['organisation'].clearValidators();
      this.addForm.controls['organisation'].updateValueAndValidity();
    } else {
      this.addForm.controls['organisation'].setValidators([Validators.required]);
      this.addForm.controls['organisation'].updateValueAndValidity();
    }
  }

 /**
  * Triggered when 'Fără acreditare' option is selected; updates the form so that course and acreditedOrganisation is no longer required
  */
  courseNoneChanged() {
    if (this.courseNone) {
      this.addForm.controls['course'].clearValidators();
      this.addForm.controls['course'].updateValueAndValidity();
    } else {
      this.addForm.controls['course'].setValidators([Validators.required]);
      this.addForm.controls['course'].updateValueAndValidity();
    }
  }

  /**
   * Prompts a scrollable modal view to replace the ion-selects; it is used in order
   * to optimize the view for a large group of datas
   * @param items The list of elements that will represent user's choices in the modal
   * @param controlName The name of the control that the modal replaces
   * @param event The event that triggered the function call
   */
  async presentModal(items: any, controlName: string, event: any) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.cancelBubble = true;
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: CustomSelectorComponent,
      componentProps: {
        items
      }
    });

    modal.onDidDismiss()
      .then(res => {
        this.addForm.controls[controlName].setValue(res.data);
    });

    return await modal.present();
  }
}
