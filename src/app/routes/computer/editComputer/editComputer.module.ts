import {NgModule} from '@angular/core';
import {EditComputerComponent} from './editComputer.component';
import {SharedModule} from '../../../shared.module';

@NgModule({
  declarations: [EditComputerComponent],
  imports: [SharedModule],
  exports: [EditComputerComponent]
})

export class EditComputerModule {

}
