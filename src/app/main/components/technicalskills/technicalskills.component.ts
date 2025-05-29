import { Component } from '@angular/core';

@Component({
  selector: 'app-technicalskills',
  templateUrl: './technicalskills.component.html',
  styleUrls: ['./technicalskills.component.scss'],
})
export class TechnicalskillsComponent {
  skills: string[] = ['HTML', 'CSS', 'JavaScript'];

  newSkills: string[] = ['']; // Start with one empty input

  addInput() {
    this.newSkills.push('');
  }

  removeInput(index: number) {
    if (this.newSkills.length > 1) {
      this.newSkills.splice(index, 1);
    }
  }

saveSkills() {
  const nonEmpty = this.newSkills.filter((s) => s.trim() !== '');
  if (nonEmpty.length > 0) {
    // I-append lang yung bagong skills na wala pa sa list
    nonEmpty.forEach(skill => {
      if (!this.skills.includes(skill)) {
        this.skills.push(skill);
      }
    });
  }
  this.newSkills = [''];
}

  editSkills() {
    this.newSkills = [...this.skills];
    if (this.newSkills.length === 0) {
      this.newSkills.push('');
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
