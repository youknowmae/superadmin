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
  allSkills: string[] = [];
  skills: any[] = [];

  newSkills: string[] = ['']; // Start with one empty input
  isSubmitting: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = true;

  constructor(
    private ds: DataService,
    private us: UserService,
    private fb: FormBuilder,
    private gs: GeneralService
  ) {}

  ngOnInit() {
    this.getSkills();
  }

  search(value: string) {
    const searchTerm = value.toLowerCase();
    this.skills = this.allSkills.filter((skill) =>
      skill.toLowerCase().includes(searchTerm)
    );
  }

  getSkills() {
    const technicalSkills = this.us.getTechnicalSkillsData();

    if (technicalSkills) {
      this.allSkills = [...technicalSkills];
      this.skills = [...this.allSkills];
      this.isLoading = false;
      return;
    }

    this.ds.get('technical-skills').subscribe((response) => {
      this.allSkills = response
        .map((item: any) => item.skills)
        .flat()
        .sort((a: string, b: string) => a.localeCompare(b));

      this.skills = [...this.allSkills];
      this.isLoading = false;

      this.us.setTechnicalSkillsData(this.allSkills);
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
          this.skills = [...nonEmpty].sort((a: string, b: string) =>
            a.localeCompare(b)
          );
          this.allSkills = [...this.skills];
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
    this.newSkills = [...this.allSkills];
    if (this.newSkills.length === 0) {
      this.newSkills.push('');
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
