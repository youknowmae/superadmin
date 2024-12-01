import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field'
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from '@angular/material/icon'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

const var_modules = [
    MatFormFieldModule,
    MatLabel,
    MatHint,
    FormsModule,
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatTabsModule
]

@NgModule({
    imports: var_modules,
    exports: var_modules
})

export class MaterialsModules {}