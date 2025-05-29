import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../services/data.service';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { PdfPreviewComponent } from '../../../components/pdf-preview/pdf-preview.component';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent {
  displayedColumns: string[] = ['name', 'actions'];

  dataSource: any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialog,
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private gs: GeneralService
  ) {
    this.paginator = new MatPaginator(
      this.paginatorIntl,
      this.changeDetectorRef
    );
  }

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates() {
    this.ds.get('superadmin/templates').subscribe((templates) => {
      this.dataSource.data = templates;
      this.dataSource.paginator = this.paginator;
    });
  }

  addTemplate() {
    var modal = this.dialogRef.open(AddTemplateComponent, {
      disableClose: true,
    });

    modal.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.dataSource.data = [...this.dataSource.data, result];
    });
  }

  previewTemplate(template: any) {
    if (!template.pdf) {
      this.gs.makeAlert(
        'Error!',
        'This file has no pdf preview file.',
        'error'
      );
      return;
    }

    this.dialogRef.open(PdfPreviewComponent, {
      data: { name: template.name, pdf: template.pdf },
      disableClose: true,
    });
  }

  editTemplate(template: any) {
    var modal = this.dialogRef.open(EditTemplateComponent, {
      data: template,
      disableClose: true,
    });

    modal.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.dataSource.data = this.dataSource.data.map((template: any) =>
        template.id === result.id ? result : template
      );
    });
  }

  async deleteTemplate(id: number) {
    const res = await this.gs.confirmationAlert(
      'Delete?',
      'Are you sure you want to delete this template?',
      'warning',
      'Yes',
      'destructive'
    );

    if (!res) return;

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.ds.get(`superadmin/templates/${id}/delete`).subscribe(
      (result) => {
        this.isSubmitting = false;
        this.dataSource.data = this.dataSource.data.filter(
          (template: any) => template.id !== id
        );
        this.gs.makeAlert('Success', 'Template has been deleted.', 'success');
      },
      (error) => {
        this.isSubmitting = false;
        // console.error(error)
        if (error.status == 409) {
          this.gs.makeAlert('Error', error.error, 'error');
        } else {
          this.gs.makeAlert(
            'Oops!',
            'Something went wrong. Please try again later.',
            'error'
          );
        }
      }
    );
  }
}
