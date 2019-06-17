///<reference path="../../../../node_modules/@angular/forms/src/model.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {ComputerService} from './computer.service';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.module';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'courses',
  templateUrl: 'computer.component.html',
  styleUrls: ['./computer.component.less'],
  providers: [ComputerService]
})
export class ComputerComponent implements OnInit {
    constructor(private computerService: ComputerService, private confirmServ: NzModalService, private  router: Router,
                private _storage: SessionStorageService, private fb: FormBuilder) {
    }
    validateForm: FormGroup;
    apiUrl = [
        'computer/getComputerByLabId', /*0获取课程*/
        'computer/deleteComputer', /*1删除课程*/
        'semester/getNowSemester', // 2
        'lab/getLabById', /*3 获取实验室*/
        'computer/getComputerCount', /*4获取设备数量*/
    ];
    computers = [];
    data = [];
    // 获取学期
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    labName;
    undoCount;
    doCount;
    private getSemester() {
        this.computerService.executeGET(this.apiUrl[2])
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
        // 获取设备
        this.computerService.executeHttp(this.apiUrl[0], {labId: this._storage.get('labId')})
            .then((result: any) => {
                this.computers = JSON.parse(result['_body'])['computerList'];
            });
        // 获取实验室
        this.computerService.executeHttp(this.apiUrl[3], {labId: this._storage.get('labId')})
            .then((result: any) => {
                this.labName = JSON.parse(result['_body'])['lab']['labName'];
            });
        this.computerService.executeHttp(this.apiUrl[4], {labId: this._storage.get('labId')})
            .then((result: any) => {
                this.undoCount = JSON.parse(result['_body'])['undoCount'];
                this.doCount = JSON.parse(result['_body'])['doCount'];
            });
    }
    // 编辑设备
    editComputer(data: any) {
        const str = JSON.stringify(data);
        this._storage.set('computer', str);
        this.router.navigate(['/computer/edit']);
    }
    // 删除设备
    private delComputer(data: any) {
        this.computerService.executeHttp(this.apiUrl[1], data)
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 1) {
                    this.success();
                    this._getData();
                }
            });
    }
    success = () => {
        const modal = this.confirmServ.success({
            title: '删除成功',
            content: '1秒后刷新'
        });
        const Route = this.router;
        setTimeout(function () {
            modal.destroy();
        }, 1000);
    }
    ngOnInit(): void {
        this._getData();
    }

}
