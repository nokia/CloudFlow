// Copyright (C) 2017 Nokia

import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {ExecutionsListComponent} from './executions-list/executions-list.component';
import {ExecutionsRouteModule} from "./executions-routing.module";
import {ExecutionsComponent} from "./executions.component";
import {ExecutionComponent} from './execution/execution.component';
import { WorkflowInfoComponent } from './workflow-info/workflow-info.component';
import { WorkflowGraphComponent } from './workflow-graph/workflow-graph.component';
import { TaskInfoComponent } from './task-info/task-info.component';

@NgModule({
    imports: [
        SharedModule,
        ExecutionsRouteModule,
    ],
    declarations: [
        ExecutionsComponent,
        ExecutionsListComponent,
        ExecutionComponent,
        WorkflowInfoComponent,
        WorkflowGraphComponent,
        TaskInfoComponent
    ],
    exports: [
        ExecutionsComponent
    ]
})
export class ExecutionsModule {
}
