import {NgModule} from '@angular/core';
import {AddStudentComponent} from './addStudent.component';
import {SharedModule} from '../../../shared.module';

@NgModule({
  declarations: [AddStudentComponent],
  imports: [SharedModule],
  exports: [AddStudentComponent]
})

export class AddStudentModule {

}
