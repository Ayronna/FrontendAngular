import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../atoms/button.component';
import { NewClientFormComponent } from '../organisms/new-client-form.component';
import { ClientFilterComponent } from '../organisms/client-filter.component';

@NgModule({
  // Standalone components must NOT be declared in an NgModule.
  // Import them instead so they can be re-exported.
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent, // import standalone component
    NewClientFormComponent,
    ClientFilterComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonComponent, // re-export for consumers of SharedModule
    NewClientFormComponent,
    ClientFilterComponent,
  ],
})
export class SharedModule {}