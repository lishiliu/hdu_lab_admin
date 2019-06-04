import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared.module';
import {ShowStudentSignRecordComponent} from './showStudentSignRecord.component';


@NgModule({
  declarations: [ShowStudentSignRecordComponent],
  imports: [SharedModule],
  exports: [ShowStudentSignRecordComponent]
})

export class ShowStudentSignRecordModule {

}
