import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera } from '@ionic-native/camera';
import { SMS } from '@ionic-native/sms/ngx';
import { Volunteer } from 'src/app/core/model/volunteer.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})

/**
 * Component that handles the send message page functionality
 */
export class SendMessageComponent implements OnInit {

  /**
   * A list of selected volunteers' phone numbers
   */
  private phoneNumbers: string[] = [];

  /**
   * The form that contains the message
   */
  messageForm: FormGroup;

  /**
   * Codification of the image that will be sent
   */
  public base64Image: string;

  /**
   * @param sms Provider for sending SMS messages
   * @param router Provider for router navigation
   * @param location Provider for url location navigation
   */
  constructor(private sms: SMS,
              private router: Router,
              private location: Location) { }

  /**
   * Page initialisation: the volunteer id needs to be retrieved from the url
   */
  ngOnInit() {
      const navigation = this.router.getCurrentNavigation();

      if (navigation && navigation.extras && navigation.extras.state) {
        const volunteers = navigation.extras.state.volunteers;

        volunteers.forEach((volunteer: Volunteer) => this.phoneNumbers.push(volunteer.phone));
      }

      this.messageForm = new FormGroup({
        message: new FormControl('', [Validators.required])
        });
  }

  /**
   * Adds an image from camera to the app and uses base64 codification to convert it into a string
   */
  addImage() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }

  /**
   * Sends the message and image to the selected volunteer/s
   */
  sendMessage() {
    const options = {
        replaceLineBreaks: false,
        android: {
            intent: 'INTENT'
        }
    };
    this.sms.send(this.phoneNumbers, this.messageForm.value.message, options);
    this.location.back();
  }

  /**
   * Checks for SMS permission, if granted sends the SMS
   */
  checkPemission() {
    this.sms.hasPermission();
    if (this.sms.hasPermission()) {
      this.sendMessage();
    }
  }
}
