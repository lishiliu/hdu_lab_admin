import {NgModule} from '@angular/core';
import {AddComputerComponent} from './addComputer.component';
import {SharedModule} from '../../../shared.module';

@NgModule({
  declarations: [AddComputerComponent],
  imports: [SharedModule],
  exports: [AddComputerComponent]
})

export class AddComputerModule {

}
