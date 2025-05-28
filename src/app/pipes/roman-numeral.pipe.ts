import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'romanNumeral',
})
export class RomanNumeralPipe implements PipeTransform {
  transform(value: number | string): string {
    switch (+value) {
      case 1:
        return 'I';
      case 2:
        return 'II';
      case 3:
        return 'III';
      case 4:
        return 'IV';
      default:
        return value?.toString() || '';
    }
  }
}
