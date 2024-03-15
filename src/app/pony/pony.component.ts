import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  standalone: true,
  imports: [],
  templateUrl: './pony.component.html',
  styleUrl: './pony.component.css'
})
export class PonyComponent {
  @Input({ required: true }) ponyModel!: PonyModel;
  @Output() ponyClicked = new EventEmitter<PonyModel>();

  getPonyImageUrl(): string {
    let img = '';
    switch (this.ponyModel.color.toLowerCase()) {
      case 'purple':
        img = 'assets/images/pony-purple.gif';
        break;
      case 'orange':
        img = 'assets/images/pony-orange.gif';
        break;
      case 'yellow':
        img = 'assets/images/pony-yellow.gif';
        break;
      case 'green':
        img = 'assets/images/pony-green.gif';
        break;
      case 'blue':
        img = 'assets/images/pony-blue.gif';
        break;
    }

    return img;
  }

  clicked() {
    this.ponyClicked.emit(this.ponyModel);
  }
}
