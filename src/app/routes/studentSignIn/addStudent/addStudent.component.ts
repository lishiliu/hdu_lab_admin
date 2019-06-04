///<reference path="../../../../../node_modules/@angular/forms/src/model.d.ts"/>
///<reference path="../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AddStudentService} from './addStudent.service';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'AddStudent',
    templateUrl: 'addStudent.component.html',
    styleUrls: ['./addStudent.component.less'],
    providers: [AddStudentService]
})
export class AddStudentComponent implements OnInit {
    validateForm: FormGroup;
    loadStatus: boolean;
    submitBtn = '提交';
    curl = [
        'studentSignIn/addStudent', // 0 添加课程
        'semester/getNowSemester' // 1获取当前学期
    ];
    constructor(private _storage: SessionStorageService, private fb: FormBuilder, private router: Router,
                private addStudentService: AddStudentService, private confirmServ: NzModalService) {
    }
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    addStudentCourse;
    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    info(title, contentTpl) {
        this.confirmServ.info({
            title: title,
            content: contentTpl
        });
    }
    success = () => {
        const modal = this.confirmServ.success({
            title: '添加成功',
            content: '1秒后回到学生签到管理'
        });
        const Route = this.router;
        setTimeout(function () {
            modal.destroy();
            Route.navigate(['/studentSignIn']);
        }, 1000);
    }
    _submitForm() {
        let addClassId = '', addStudentId = '', addStudentName = '';
        addClassId = this.validateForm.controls['addClassId'].value;
        addStudentId = this.validateForm.controls['addStudentId'].value;
        addStudentName = this.validateForm.controls['addStudentName'].value;
        const data = {
            teacherId: this._storage.get('username'),
            classId: addClassId,
            studentId: addStudentId,
            studentName: addStudentName
        };
        this.addStudentService.executeHttp(this.curl[0], data)
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.success();
                } else {
                    this.info('警告', '添加失败,请检查后重试！');
                    return;
                }
            });
    }
    private getData() {
        // 获取学期
        this.addStudentService.executeGET(this.curl[1])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
    }
    private _getData = () => {
        // 获取课程c
        this.addStudentCourse = JSON.parse(this._storage.get('addStudentClass'));
    }
    ngOnInit() {
        this.getData();
        this._getData();
        this.validateForm = this.fb.group({
            addClassId: [null, [Validators.required]],
            addClassName: [null, [Validators.required]],
            addStudentId: [null, [Validators.required]],
            addStudentName: [null, [Validators.required]],
        });
    }
}
