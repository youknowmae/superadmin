import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterTextPipe } from '../pipes/semester-text.pipe';

@NgModule({
  declarations: [SemesterTextPipe],
  exports: [SemesterTextPipe],
  imports: [CommonModule],
})
export class SharedModule {}
