// Copyright (C) 2017 Nokia

import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {CopyableModule} from "../shared/components/copyable/copyable.module";
import {ExecutionsListComponent} from "./executions-list/executions-list.component";
import {ExecutionsRouteModule} from "./executions-routing.module";
import {ExecutionsComponent} from "./executions.component";
import {ExecutionComponent} from "./execution/execution.component";
import {WorkflowInfoComponent} from "./workflow-info/workflow-info.component";
import {WorkflowGraphComponent} from "./workflow-graph/workflow-graph.component";
import {TaskInfoComponent} from "./task-info/task-info.component";
import {InfoItemComponent} from "./info-item/info-item.component";
import {ActionExecutionsInfoComponent} from "./task-info/action-executions-info/action-executions-info.component";
import {SubworkflowExecutionsInfoComponent} from "./task-info/subworkflow-executions-info/subworkflow-executions-info.component";
import {ExecutionHeaderComponent} from "./execution/execution-header/execution-header.component";
import {TasksRuntimeComponent} from './tasks-runtime/tasks-runtime.component';

@NgModule({
    imports: [
        SharedModule,
        ExecutionsRouteModule,
        CopyableModule,
    ],
    declarations: [
        ExecutionsComponent,
        ExecutionsListComponent,
        ExecutionComponent,
        WorkflowInfoComponent,
        WorkflowGraphComponent,
        TaskInfoComponent,
        InfoItemComponent,
        ActionExecutionsInfoComponent,
        SubworkflowExecutionsInfoComponent,
        ExecutionHeaderComponent,
        TasksRuntimeComponent,
    ],
    exports: [
        ExecutionsComponent
    ]
})
export class ExecutionsModule {
}
