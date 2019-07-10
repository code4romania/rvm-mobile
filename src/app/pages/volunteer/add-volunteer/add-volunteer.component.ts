import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-volunteer',
  templateUrl: './add-volunteer.component.html',
  styleUrls: ['./add-volunteer.component.scss'],
})
export class AddVolunteerComponent implements OnInit {
  addForm: FormGroup;
  addNewOrganization = false;

  constructor( private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      cnp: ['', Validators.required],
      organization: ['', Validators.required],
      city: ['', Validators.required],
      county: ['', Validators.required],
      speciality: ['', Validators.required],
    });
  }

  submit() {
    console.log('volunteer added');
  }

  selectOrganization() {
    if (this.addForm.value.organization === 'new') {
      this.addNewOrganization = true;
      this.addForm.controls['organization'].setValue('');
    } else {
      this.addNewOrganization = false;
    }
  }
}
