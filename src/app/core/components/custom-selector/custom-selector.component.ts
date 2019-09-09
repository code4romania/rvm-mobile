import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from '../../local-storage.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-custom-selector',
  templateUrl: './custom-selector.component.html',
  styleUrls: ['./custom-selector.component.scss'],
})

export class CustomSelectorComponent implements OnInit, OnDestroy {
  /**
   * Data sent to the modal to reprezent the selections
   */
  @Input() items: any[];

  /**
   * Stores a subscription to the back button event; it will be subscribed on page initialisation
   * and unsubscribed on page destroy
   */
  subscription: any;

  /**
   * Page constructor
   * @param modalCtrl Modal Controller reference for modal view related operations
   * @param localStorageService LocalStorage service reference for store/clear on local storage
   */
  constructor(private modalCtrl: ModalController,
              private localStorageService: LocalStorageService) { }

  /**
   * Triggered when a user selects an entry; it closes the modal and returns to the calling page
   * the selected value
   * @param entry User selected entry
   */
  changeSelectedEntry(entry: any) {
    this.modalCtrl.dismiss(entry);
  }

  /**
   * Page initialisation, sets the subscription for the back-button event and
   * sets a value in the local storage in order to know when the pop-up is open
   */
  ngOnInit() {
    this.localStorageService.setItem('prevent_back', true);

    const event = fromEvent(document, 'backbutton');
    this.subscription = event.subscribe(async () => {
        const modal = await this.modalCtrl.getTop();
        if (modal) {
            modal.dismiss();
        }
    });
  }

  /**
   * Unsubscribes from the back-button listener and clears the local storage
   */
  ngOnDestroy() {
    this.localStorageService.clearItem('prevent_back');
    this.subscription.unsubscribe();
  }

  /**
   * Closes the modal view
   */
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
