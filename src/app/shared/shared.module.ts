import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../atoms/button.component';
import { NewClientFormComponent } from '../organisms/new-client-form.component';
import { ClientFilterComponent } from '../organisms/client-filter.component';
import { ClientCardComponent } from '../molecules/client-card.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent, 
    NewClientFormComponent,
    ClientFilterComponent,
    ClientCardComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    NewClientFormComponent,
    ClientFilterComponent,
    ClientCardComponent,
  ],
})
export class SharedModule {}