import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterTextPipe } from '../pipes/semester-text.pipe';
import { CourseShortToFullPipe } from '../pipes/course-short-to-full.pipe';
import { RomanNumeralPipe } from '../pipes/roman-numeral.pipe';

@NgModule({
  declarations: [SemesterTextPipe, CourseShortToFullPipe, RomanNumeralPipe],
  exports: [SemesterTextPipe, CourseShortToFullPipe, RomanNumeralPipe],
  imports: [CommonModule],
})
export class SharedModule {}
