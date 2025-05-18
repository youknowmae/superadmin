import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'semesterText',
})
export class SemesterTextPipe implements PipeTransform {
  transform(semester: number): string {
    if (semester === 1) {
      return '1st Semester';
    } else if (semester === 2) {
      return '2nd Semester';
    } else if (semester === 3) {
      return 'Midterm';
    } else {
      return 'Invalid Semester';
    }
  }
}
