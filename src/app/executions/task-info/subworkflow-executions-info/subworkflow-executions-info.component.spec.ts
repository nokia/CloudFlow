// Copyright (C) 2017 Nokia

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SimpleChange} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";

import {SubworkflowExecutionsInfoComponent} from './subworkflow-executions-info.component';
import {MistralService} from "../../../engines/mistral/mistral.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {SharedModule} from "../../../shared/shared.module";
import {InfoItemComponent} from "../../info-item/info-item.component";
import {RouterTestingModule} from "@angular/router/testing";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {By} from "@angular/platform-browser";

describe('SubworkflowExecutionsInfoComponent', () => {
    let component: SubworkflowExecutionsInfoComponent;
    let fixture: ComponentFixture<SubworkflowExecutionsInfoComponent>;
    const response = [{
        workflow_name: 'test_wf',
        state: 'SUCCESS',
        id: '012345',
        input: {param1: 1},
        output: {param2: 2}
    }];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, RouterTestingModule, HttpClientModule, NgbModule.forRoot()],
            declarations: [SubworkflowExecutionsInfoComponent, InfoItemComponent],
            providers: [MistralService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubworkflowExecutionsInfoComponent);
        spyOn(fixture.debugElement.injector.get(MistralService), 'wfExecutionsByTaskExecutionId')
            .and.returnValue(Observable.of(response));
        component = fixture.componentInstance;
        component.taskExecId = "_task_id_";
        component.ngOnChanges({'taskExecId': {previousValue: '', currentValue: component.taskExecId} as SimpleChange});
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should generate link to sub workflow execution', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const links = fixture.debugElement.queryAll(By.css("button[title='Go to this Workflow Execution']"));
            expect(links.length).toBeGreaterThan(0);
        });
    }));

    it('should render info-items', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const badge = fixture.debugElement.query(By.css(".badge"));
            expect(badge.nativeElement.textContent).toEqual("SUCCESS");
        });
    }));

    it('should render input/output items', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const headers = fixture.nativeElement.querySelector("div[role='tab'] > a > div");
            headers.click();
            fixture.detectChanges();

            const infoItems = fixture.debugElement.queryAll(By.directive(InfoItemComponent));
            expect(infoItems.length).toEqual(2);
            expect(infoItems[0].componentInstance.prop.renderType).toEqual("code");
        });
    }));
});
