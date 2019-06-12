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
        'http://www.mrzhao14.cn/LabManager/semester/getNowSemester',
        'http://www.mrzhao14.cn/LabManager/studentSignIn/getSignRecordToTeacherByWeek', /*1获取签到信息*/
        'http://www.mrzhao14.cn/LabManager/studentSignIn/getSignCountToTeacher', /*2获取签到人数信息*/
        // 1
    ];

    WEEK = ['日', '一', '二', '三', '四', '五', '六', '日'];
    _value = ''; /*搜索内容*/
    choice = 'all';
    signRecords = [];
    data = [];
    signInCourse;
    undoCount;
    doCount;
    nowSemester;
    thisWeek;
    week;
    searchFlag=false;
    searchSemester = this._storage.get('historyCourses');
    searchWeek = this._storage.get('selectWeek');
    private getSemester() {
        this.showStudentSignRecordService.executeGET(this.apiUrl[0])
            .then((result: any) => {
                let res = JSON.parse(result['_body'])['NowSemester'];
                this.nowSemester = res['nowSemester'];
                this.thisWeek = res['thisWeek'];
            });
    }
    private _getData = () => {
        // 获取当前学期信息
        this.getSemester();
        // 获取课程c
        this.signInCourse = JSON.parse(this._storage.get('signInCourse'));
        const flag = this._storage.get('historyOrThisWeek');
        if(flag==0){
            this.week = this._storage.get('thisWeek');
        }
        if(flag==1){
            this.week = this._storage.get('selectWeek');
            this.searchFlag = true;
        }
        let data = {
            classId: this.signInCourse.classId,
            teacherId: this.signInCourse.userName,
            selectWeek: this.week
        }
        this.showStudentSignRecordService.executeHttp(this.apiUrl[1], data)
            .then((result: any) => {
                this.signRecords = JSON.parse(result['_body'])['studentSignInfoToTeacherList'];
            });
        this.showStudentSignRecordService.executeHttp(this.apiUrl[2], data)
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
