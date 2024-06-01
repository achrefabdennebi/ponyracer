import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pr-birth-year-input',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BirthYearInputComponent),
      multi: true
    }
  ],
  templateUrl: './birth-year-input.component.html',
  styleUrl: './birth-year-input.component.css'
})
export class BirthYearInputComponent implements ControlValueAccessor {
  value: number | null = null;
  year: number | null = null;
  disabled = false;

  onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  @Input({ required: true }) inputId!: number;

  onBirthYearChange(event: Event): void {
    const value = (<HTMLInputElement>event.target).valueAsNumber;
    if (isNaN(value)) {
      this.year = null;
      this.onChange(null);
    }
  }

  private computeYear(value: number) {
    if (value < 0 || value === null) return null;
    if (value > 100) {
      return value;
    }
    const lastTwoDigitsOfTheCurrentYear = new Date().getFullYear() % 100;
    const firstTwoDigitsOfTheCurrentYear = Math.floor(new Date().getFullYear() / 100);
    if (value > lastTwoDigitsOfTheCurrentYear) {
      return (firstTwoDigitsOfTheCurrentYear - 1) * 100 + value;
    } else {
      return firstTwoDigitsOfTheCurrentYear * 100 + value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(value: boolean): void {
    this.disabled = value;
  }

  writeValue(value: number): void {
    this.value = value;
    this.year = this.computeYear(value);
  }
}