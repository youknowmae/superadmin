import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataService } from '../../../services/data.service';

import { saveAs } from 'file-saver';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-filetemplate',
  templateUrl: './filetemplate.component.html',
  styleUrl: './filetemplate.component.scss'
})
export class FiletemplateComponent {
  pdfSource: SafeResourceUrl | null = null
  templates: any = []
  selectedTemplate: number = 1;

  downloadOptionOpen: boolean = false
  currentTemplate: any
  isDownloading: boolean = false

  constructor(
    private ds: DataService,
    private sanitizer: DomSanitizer,
    private gs: GeneralService
  ) {
    // this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8000/storage/templates/pdf/Guardian Waver.pdf' );
  }

  ngOnInit() {
    this.getTemplates()
  }
  
  onTemplateChange() {
    let template = this.templates.find((template: any) => template.id == this.selectedTemplate)
    console.log(template)
    if(!template) {
      this.pdfSource = null
      console.log('no template found')
      return
    }
    
    this.currentTemplate = template
    this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(template.pdf + '#toolbar=0&navpanes=0&scrollbar=0')
  }

  getTemplates() {
    this.ds.get('templates').subscribe(
      templates => {
        this.templates = templates
        console.log(this.templates)
        this.onTemplateChange()
      },
      error => {
        console.error(error)
      }
    )
  }

  downloadDocx() {
    let template = this.currentTemplate

    if(!template || this.isDownloading) {
      return
    }

    this.isDownloading = true

    let url = 'templates/docx/'

    //if the file has no docx file, download pdf
    if(template.has_docx == 0) {
      url = 'templates/pdf/'
    }
    
    this.ds.download(url, template.id).subscribe(
      (response: Blob) => {
        saveAs(response, template.name);
        this.isDownloading = false
      },
      error => {
        this.gs.errorAlert('Error!', 'Something went wrong. Please try again later.')
        console.error(error)
        this.isDownloading = false

      }
    )
    
    this.downloadOptionOpen = false
  }

  downloadPrefilledDocx() {
    let template = this.currentTemplate

    if(!template || this.isDownloading) {
      return
    }

    this.isDownloading = true
    
    this.ds.download('templates/autofill/', template.id).subscribe(
      (response: Blob) => {
        saveAs(response, template.name);
        this.isDownloading = false
      },
      error => {
        this.gs.errorAlert('Error!', 'Something went wrong. Please try again later.')
        console.error(error)
        this.isDownloading = false

      }
    )
    this.downloadOptionOpen = false
  }
  toggleDownloadOptions(event: Event) {
    event.stopPropagation()

    this.downloadOptionOpen = !this.downloadOptionOpen
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.download');
    if (!clickedInside) {
      this.downloadOptionOpen = false;
    }
  }

  downloadWithDetail() {

  }
}
