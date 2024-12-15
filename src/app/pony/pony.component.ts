import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  imports: [],
  templateUrl: './pony.component.html',
  styleUrl: './pony.component.css'
})
export class PonyComponent {
  @Input({ required: true }) ponyModel!: PonyModel;
  @Input() isRunning = false;

  @Output() ponyClicked = new EventEmitter<PonyModel>();
  public readonly ponyImageUrl = computed(() => `images/pony-${this.ponyModel.color.toLowerCase()}${this.isRunning ? '-running' : ''}.gif`);

  clicked() {
    this.ponyClicked.emit(this.ponyModel);
  }
}
