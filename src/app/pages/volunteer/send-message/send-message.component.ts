import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  /**
   * The id of the volunteer that will receive the message
   */
  private volunteerId: string;
  private volunteer: Volunteer;

  /**
   * The message that gets sent
   */
  public message = '';

  /**
   * Codification of the image that will be sent
   */
  public base64Image: string;

  /**
   * 
   * @param route Provider for current route
   * @param sms Provider for sending SMS messages
   */
  constructor(private route: ActivatedRoute,
    private sms: SMS,
    private volunteerService: VolunteerService) { }

  /**
   * Page initialisation: the volunteer id needs to be retrieved from the url
   */
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.volunteerId = params['id'];
      this.volunteerService.getVolunteerById(this.volunteerId).subscribe((response) => {
        this.volunteer = response.docs[0]
      });
    });
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
      this.base64Image = "data:image/jpeg;base64," + imageData;
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
    this.sms.send(this.volunteer.phone, this.message, options);
  }

  /**
   * Checks for SMS permission, if granted sends the SMS
   */
  checkPemission(){
    this.sms.hasPermission();
    if(this.sms.hasPermission()) {
      this.sendMessage();
    }
  }
}
