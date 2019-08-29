import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Camera } from '@ionic-native/camera';
import { SMS } from '@ionic-native/sms/ngx';
import { VolunteerService } from 'src/app/core';
import { Volunteer } from 'src/app/core/model/volunteer.model';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, OnDestroy {
  /**
   * Route subscription, used for retriving parameters inserted in url route
   */
  private routeSub: Subscription;

  private phoneNumbers: string[] = [];

  /**
   * The message that gets sent
   */
  public message = '';

  /**
   * Codification of the image that will be sent
   */
  public base64Image: string;

  /**
   * @param sms Provider for sending SMS messages
   * @param router Provider for router navigation
   */
  constructor(private sms: SMS,
              private router: Router) { }

  /**
   * Page initialisation: the volunteer id needs to be retrieved from the url
   */
  ngOnInit() {
      const navigation = this.router.getCurrentNavigation();

      if (navigation && navigation.extras && navigation.extras.state) {
        const volunteers = navigation.extras.state.volunteers;

        volunteers.forEach((volunteer: Volunteer) => this.phoneNumbers.push(volunteer.phone));
      }
  }

  /**
   * Triggered when page is removed, unsubscribes from the route changes
   */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
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
   * Sends the message and image to the selected volunteer
   */
  sendMessage() {
    const options = {
        replaceLineBreaks: false,
        android: {
            intent: 'INTENT'
        }
    };
    this.sms.send(this.phoneNumbers, this.message, options);
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
