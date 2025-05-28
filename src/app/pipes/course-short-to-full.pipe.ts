import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseShortToFull',
})
export class CourseShortToFullPipe implements PipeTransform {
  transform(course: string): string {
    switch (course) {
      case 'BSIT':
        return 'Bachelor of Science in Information Technology (BSIT)';
      case 'BSCS':
        return 'Bachelor of Science in Computer Science (BSCS)';
      case 'ACT':
        return 'Associate in Computer Technology (ACT)';
      case 'BSEMC':
        return 'Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)';
      default:
        return course;
    }
  }
}
