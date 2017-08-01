// Copyright (C) 2017 Nokia

import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";

import {Injectable} from "@angular/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {TaskInfoComponent} from "./task-info.component";
import {InfoItemComponent} from "../info-item/info-item.component";
import {MistralService} from "../../engines/mistral/mistral.service";
import {TaskDef, TaskExec} from "../../shared/models/";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {SubworkflowExecutionsInfoComponent} from "./subworkflow-executions-info/subworkflow-executions-info.component";
import {ActionExecutionsInfoComponent} from "./action-executions-info/action-executions-info.component";
import {CopyableModule} from "../../shared/components/copyable/copyable.module";

@Injectable()
class MistralServiceMock {
    selectedTask = new BehaviorSubject<{task: TaskExec, taskDef: TaskDef}>(null);

    patchTaskExecutionResult(...args) {
        return Observable.of(null);
    }
}

describe('TaskInfoComponent', () => {
    let component: TaskInfoComponent;
    let fixture: ComponentFixture<TaskInfoComponent>;
    let service: MistralServiceMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbModule.forRoot(), SharedModule, RouterTestingModule, CopyableModule],
            declarations: [TaskInfoComponent, SubworkflowExecutionsInfoComponent, ActionExecutionsInfoComponent, InfoItemComponent],
            providers: [{provide: MistralService, useClass: MistralServiceMock}]
        });
            // .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskInfoComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(MistralService);
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should display task info', () => {
        service.selectedTask.next({task: {name: 'task name'} as TaskExec, taskDef: '' as TaskDef});

        fixture.detectChanges();
        const h6 = fixture.debugElement.queryAll(By.css("h6"));
        expect(h6.length).toBeGreaterThan(0);

        const taskName = fixture.debugElement.query(By.css("#info-item-property-name"));
        expect(taskName.nativeElement.textContent).toContain("task name");
    });
});
