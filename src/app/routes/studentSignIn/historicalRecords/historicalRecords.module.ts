import {NgModule} from '@angular/core';
import {HistoricalRecordsComponent} from './historicalRecords.component';
import {SharedModule} from '../../../shared.module';


@NgModule({
  declarations: [HistoricalRecordsComponent],
  imports: [SharedModule],
  exports: [HistoricalRecordsComponent]
})

export class HistoricalRecordsModule {

}
