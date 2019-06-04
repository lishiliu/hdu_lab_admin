import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.module';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ShowStudentSignRecordService} from './showStudentSignRecord.service';

@Component({
    selector: 'app-ShowStudentSignRecord',
    templateUrl: 'showStudentSignRecord.component.html',
    styleUrls: ['./showStudentSignRecord.component.less'],
    providers: [ShowStudentSignRecordService]
})

export class ShowStudentSignRecordComponent implements OnInit {
    constructor(private showStudentSignRecordService: ShowStudentSignRecordService, private confirmServ: NzModalService, private  router: Router,
                private _storage: SessionStorageService, private fb: FormBuilder) {
    }
    validateForm: FormGroup;
    apiUrl = [
        'http://localhost:8080/LabManager/studentSignIn/getSignRecordToTeacher', /*0获取签到信息*/
        'http://localhost:8080/LabManager/studentSignIn/getSignCountToTeacher', /*0获取签到人数信息*/
        'http://localhost:8080/LabManager/semester/getNowSemester', // 1
    ];

    WEEK = ['日', '一', '二', '三', '四', '五', '六', '日'];
    _value = ''; /*搜索内容*/
    choice = 'all';
    signRecords = [];
    data = [];
    signInCourse;
    undoCount;
    doCount;
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    private getSemester() {
        this.showStudentSignRecordService.executeGET(this.apiUrl[2])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
    }
    private _getData = () => {
        // 获取当前学期信息
        this.getSemester();
        // 获取课程c
        this.signInCourse = JSON.parse(this._storage.get('signInCourse'));
        this.showStudentSignRecordService.executeHttp(this.apiUrl[0], this.signInCourse)
            .then((result: any) => {
                this.signRecords = JSON.parse(result['_body'])['studentSignInfoToTeacherList'];
            });
        this.showStudentSignRecordService.executeHttp(this.apiUrl[1], this.signInCourse)
            .then((result: any) => {
                this.undoCount = JSON.parse(result['_body'])['undoCount'];
                this.doCount = JSON.parse(result['_body'])['doCount'];
            });
    }
    onSearch(event: string): void {
        console.log(event);
    }
    ngOnInit(): void {
        this._getData();
        }
}
