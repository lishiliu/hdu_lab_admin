///<reference path="../../../../../node_modules/@angular/forms/src/model.d.ts"/>
///<reference path="../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {EditComputerService} from './editComputer.service';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.service';

@Component({
  selector: 'editCourse',
  templateUrl: 'editComputer.component.html',
  styleUrls: ['./editComputer.component.less'],
  providers: [EditComputerService]
})
export class EditComputerComponent implements OnInit {
    validateForm: FormGroup;
    loadStatus: boolean;
    submitBtn = '提交';
    curl = [
        'computer/updateComputer', // 0 编辑课程
        'semester/getNowSemester', // 1获取当前学期
        'lab/getLabById', /*2 获取实验室*/
    ];
    constructor(private _storage: SessionStorageService, private fb: FormBuilder, private router: Router,
                private editComputerService: EditComputerService, private confirmServ: NzModalService) {
    }
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    labName;
    computerInfo;
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
            title: '编辑成功',
            content: '1秒后回到课程管理'
        });
        this._storage.remove('computer');
        const Route = this.router;
        setTimeout(function () {
            modal.destroy();
            Route.navigate(['/computer']);
        }, 1000);
    }
    _submitForm() {
        let data = {
            id: this.computerInfo.id,
            computerIp: this.computerInfo.computerIp, // IP
            computerNum: this.computerInfo.computerNum, // 座号
            software: this.computerInfo.software, // 软件
            systemType: this.computerInfo.systemType, // 操作系统类型
            type: this.computerInfo.type // 设备类型
        };
        this.editComputerService.executeHttp(this.curl[0], data)
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.success();
                } else if (res['result'] === 'repeat') {
                    this.info('警告', res['msg'] );
                } else {
                    this.info('警告', '修改失败,请检查后重试！');
                    return;
                }
            });
    }
    private getData() {
        // 获取学期
        this.editComputerService.executeGET(this.curl[1])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
        // 获取实验室
        this.editComputerService.executeHttp(this.curl[2], {labId: this._storage.get('labId')})
            .then((result: any) => {
                this.labName = JSON.parse(result['_body'])['lab']['labName'];
            });
        // 获取设备
        this.computerInfo = JSON.parse(this._storage.get('computer'));
    }
    ngOnInit() {
        this.getData();
        this.validateForm = this.fb.group({
            computerIp: [this.computerInfo.computerIp, [Validators.required]],
            computerNum: [this.computerInfo.computerNum, [Validators.required]],
            software: [this.computerInfo.software, [Validators.required]],
            systemType: [this.computerInfo.systemType, [Validators.required]],
            computerType: [this.computerInfo.type, [Validators.required]],
        });
    }
}
