///<reference path="../../../../node_modules/@angular/forms/src/model.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {StudentSignInService} from './studentSignIn.service';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.module';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'studentSignIn',
  templateUrl: 'studentSignIn.component.html',
  styleUrls: ['./studentSignIn.component.less'],
  providers: [StudentSignInService]
})
export class StudentSignInComponent implements OnInit {
    constructor(private studentSignInService: StudentSignInService, private confirmServ: NzModalService, private  router: Router,
                private _storage: SessionStorageService, private fb: FormBuilder) {
    }
    validateForm: FormGroup;
    apiUrl = [
        'class/lab/getClassByLabId', /*0获取本周课程*/
        'studentSignIn/updateStatus', /*1删除课程*/
        'semester/getNowSemester', // 2
        'user/getUserByUserName',
    ];
    options = [
        { value: '2016', label: '2016' },
        { value: '2017', label: '2017' },
        { value: '2018', label: '2018' },
        { value: '2019', label: '2019' },
    ];
    WEEK = ['日', '一', '二', '三', '四', '五', '六', '日'];
    _value = ''; /*搜索内容*/
    choice = 'all';
    courses = [];
    data = [];
    // 获取学期
    nowSemester;
    thisWeek;
    private getSemester() {
        this.studentSignInService.executeGET(this.apiUrl[2])
            .then((result: any) => {
                let res = JSON.parse(result['_body'])['NowSemester'];
                this.nowSemester = res['nowSemester'];
                this.thisWeek = res['thisWeek'];
            });
    }
    private getAllHours(courses: any) {
        let hours = 0;
        for (let course of courses) {
            hours += course.classNum.length * course.classWeek.length;
        }
        return hours;
    }
    private getWeekHours(courses: any) {
        let hours = 0;
        for (let course of courses) {
            hours += course.classNum.length;
        }
        return hours;
    }
    private getHours(course: any) {
        return course.classNum.length * course.classWeek.length;
    }
    private _getData = () => {
        // 获取当前学期信息
        this.getSemester();
        // 获取课程
        this.studentSignInService.executeHttp(this.apiUrl[0], {labId: this._storage.get('labId')})
            .then((result: any) => {
                const data = JSON.parse(result['_body'])['course'];
                for (let i of data) {
                    i.expand = false;
                    // 获取教师信息
                    this.studentSignInService.executeHttp(this.apiUrl[3], {userName: i.userName})
                        .then((res: any) => {
                            let temp = JSON.parse(res['_body'])['User1'];
                            i.userNickname = temp.userNickname;
                            i.email = temp.email;
                            i.phone = temp.phone;
                        });
                }
                this.courses = data;
            });
    }
    // 查看学生记录
    showRecords(data: any) {
        const str = JSON.stringify(data);
        this._storage.set('signInCourse', str);
        this._storage.set('historyOrThisWeek', '0');
        this._storage.set('thisWeek', this.thisWeek);
        this.router.navigate(['/studentSignIn/show']);
    }
    // 获取历史课程
    currentModal;
    showModalForTemplate(titleTpl, contentTpl, footerTpl) {
        const form = this.validateForm;
        let _storage = this._storage;
        const Route = this.router;
        this.currentModal = this.confirmServ.open({
            title       : titleTpl,
            content     : contentTpl,
            footer      : footerTpl,
            onOk() {
                const str = form.controls['fy'].value.value + '-' +
                    form.controls['sy'].value.value + '-' + form.controls['type'].value;
                _storage.set('historyCourses', str);
                _storage.set('selectWeek', form.controls['weekNo'].value);
                Route.navigate(['/studentSignIn/history']);
            },
            onCancel() {
            },
        });
    }
    handleCancel(e) {
        this.currentModal.destroy('onCancel');
        this.currentModal = null;
    }
    isConfirmLoading = false;
    handleOk(e) {
        this.isConfirmLoading = true;
        setTimeout(() => {
            this.currentModal.destroy('onOk');
            this.isConfirmLoading = false;
            this.currentModal = null;
        }, 1000);
    }
    onSearch(event: string): void {
        console.log(event);
    }
    ngOnInit(): void {
        this.validateForm = this.fb.group({
            fy: [null, this.validateForm],
            sy: [null, this.validateForm],
            type: [null, this.validateForm],
            weekNo: [null, this.validateForm]
        });
        this._getData();
    }

}
