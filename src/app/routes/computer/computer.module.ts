import {NgModule} from '@angular/core';
import {ComputerComponent} from './computer.component';
import {SharedModule} from '../../shared.module';
import {AddComputerComponent} from './addComputer/addComputer.component';
import {EditComputerComponent} from './editComputer/editComputer.component';

@NgModule({
  declarations: [ComputerComponent, AddComputerComponent, EditComputerComponent],
  imports: [SharedModule],
  exports: [ComputerComponent]
})

export class ComputerModule {

}
