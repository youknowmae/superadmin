import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { GeneralService } from '../../../services/general.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-technicalskills',
  templateUrl: './technicalskills.component.html',
  styleUrls: ['./technicalskills.component.scss'],
})
export class TechnicalskillsComponent {
  skills: any[] = [];

  newSkills: string[] = ['']; // Start with one empty input
  isSubmitting: boolean = false;
  isEditing: boolean = false;

  constructor(
    private ds: DataService,
    private us: UserService,
    private fb: FormBuilder,
    private gs: GeneralService
  ) {}

  ngOnInit() {
    this.getSkills();
  }

  getSkills() {
    const technicalSkills = this.us.getTechnicalSkillsData();

    if (technicalSkills) {
      this.skills = technicalSkills;
      return;
    }

    this.ds.get('technical-skills').subscribe((response) => {
      this.skills = response.map((item: any) => item.skills);
      this.us.setTechnicalSkillsData(this.skills);
      console.log(this.skills);
    });
  }

  addInput() {
    this.newSkills.push('');
  }

  removeInput(index: number) {
    if (this.newSkills.length > 1) {
      this.newSkills.splice(index, 1);
    }
  }

  saveSkills() {
    const hasEmpty = this.newSkills.some((s) => s.trim() === '');

    if (hasEmpty) {
      this.gs.makeAlert(
        'Invalid Input!',
        'Please fill in all skill inputs before saving.',
        'error'
      );
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const nonEmpty = this.newSkills.map((s) => s.trim());

    this.ds
      .post('superadmin/technical-skills', '', { skills: nonEmpty })
      .subscribe({
        next: (res) => {
          this.skills = [...nonEmpty];
          this.us.setTechnicalSkillsData(this.skills);

          this.newSkills = [''];
          this.gs.makeToast('Skills updated!', 'success');
        },
        error: (err) => {
          if (err.status === 422) {
            this.gs.makeAlert(
              err.error.title || 'Error!',
              err.error.message || 'Failed to update skills.',
              'error'
            );
          }
          this.gs.makeAlert('Error!', 'Failed to update skills.', 'error');
          console.error(err);
        },
        complete: () => {
          this.isSubmitting = false;
          this.isEditing = false;
        },
      });
  }

  cancel() {
    this.isEditing = false;
    this.gs.makeToast('Changes Cancelled!', 'error');
  }

  editSkills() {
    this.isEditing = true;
    this.newSkills = [...this.skills];
    if (this.newSkills.length === 0) {
      this.newSkills.push('');
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
