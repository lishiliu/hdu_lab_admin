///<reference path="../../../../../node_modules/@angular/forms/src/model.d.ts"/>
///<reference path="../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AddComputerService} from './addComputer.service';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'AddComputer',
    templateUrl: 'addComputer.component.html',
    styleUrls: ['./addComputer.component.less'],
    providers: [AddComputerService]
})
export class AddComputerComponent implements OnInit {
    validateForm: FormGroup;
    loadStatus: boolean;
    submitBtn = '提交';
    curl = [
        'computer/addComputer', // 0 添加课程
        'semester/getNowSemester', // 1获取当前学期
        'lab/getLabById', /*2 获取实验室*/
    ];
    constructor(private _storage: SessionStorageService, private fb: FormBuilder, private router: Router,
                private addcourseService: AddComputerService, private confirmServ: NzModalService) {
    }
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    labName;
   /* computerIp;
    computerNum;
    software;
    systemType;
    computerType;*/
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
            content: '1秒后回到课程管理'
        });
        const Route = this.router;
        setTimeout(function () {
            modal.destroy();
            Route.navigate(['/computer']);
        }, 1000);
    }
    _submitForm() {
        let computerIp = '', computerNum = '', software = '', systemType = '', computerType = '';
        computerIp = this.validateForm.controls['computerIp'].value;
        computerNum = this.validateForm.controls['computerNum'].value;
        software = this.validateForm.controls['software'].value;
        systemType = this.validateForm.controls['systemType'].value;
        computerType = this.validateForm.controls['computerType'].value;
        const data = {
            labId: this._storage.get('labId'),
            computerIp: computerIp, // IP
            computerNum: computerNum, // 座号
            software: software, // 软件
            systemType: systemType, // 操作系统类型
            type: computerType // 设备类型
        };
        this.addcourseService.executeHttp(this.curl[0], data)
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.success();
                } else if (res['result'] === 'repeat') {
                    this.info('警告', res['msg'] );
                } else {
                    this.info('警告', '添加失败');
                    return;
                }
            });
    }
    private getData() {
        // 获取学期
        this.addcourseService.executeGET(this.curl[1])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
        // 获取实验室
        this.addcourseService.executeHttp(this.curl[2], {labId: this._storage.get('labId')})
            .then((result: any) => {
                this.labName = JSON.parse(result['_body'])['lab']['labName'];
            });
    }
    ngOnInit() {
        this.getData();
        this.validateForm = this.fb.group({
            computerIp: [null, [Validators.required]],
            computerNum: [null, [Validators.required]],
            software: [null, [Validators.required]],
            systemType: [null, [Validators.required]],
            computerType: [null, [Validators.required]],
        });
    }
}
