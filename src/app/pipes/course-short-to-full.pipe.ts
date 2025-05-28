import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseShortToFull',
})
export class CourseShortToFullPipe implements PipeTransform {
  transform(course: string): string {
    switch (course) {
      case 'BSIT':
        return 'Bachelor of Science in Information Technology';
      case 'BSCS':
        return 'Bachelor of Science in Computer Science';
      case 'ACT':
        return 'Associate in Computer Technology';
      case 'BSEMC':
        return 'Bachelor of Science in Entertainment and Multimedia Computing';
      default:
        return course;
    }
  }
}
