// Copyright (C) 2017 Nokia

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ExecutionsComponent} from "./executions.component";
import {ExecutionsListComponent} from './executions-list/executions-list.component';
import {ExecutionComponent} from "./execution/execution.component";
import {WorkflowInfoComponent} from "./workflow-info/workflow-info.component";
import {TaskInfoComponent} from "./task-info/task-info.component";

const routes: Routes = [
    {
        path: '',
        component: ExecutionsComponent,
        children: [
            {
                path: '',
                component: ExecutionsListComponent
            },
            {
                path: ':id',
                component: ExecutionComponent,
                children: [
                    {
                        path: '',
                        component: WorkflowInfoComponent
                    },
                    {
                        path: 'tasks/:taskId',
                        component: TaskInfoComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExecutionsRouteModule {
}
