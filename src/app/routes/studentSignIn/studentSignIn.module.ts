import {NgModule} from '@angular/core';
import {StudentSignInComponent} from './studentSignIn.component';
import {SharedModule} from '../../shared.module';
import {AddStudentComponent} from './addStudent/addStudent.component';
import {ShowStudentSignRecordComponent} from './showStudentSignRecord/showStudentSignRecord.component';
import {HistoricalRecordsComponent} from './historicalRecords/historicalRecords.component';

@NgModule({
  declarations: [StudentSignInComponent, AddStudentComponent, ShowStudentSignRecordComponent, HistoricalRecordsComponent],
  imports: [SharedModule],
  exports: [StudentSignInComponent]
})

export class StudentSignInModule {

}
