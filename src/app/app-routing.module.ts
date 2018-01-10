// Copyright (C) 2017 Nokia

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "search",
        component: SearchComponent
    },
    {
        path: "executions",
        loadChildren: "app/executions/executions.module#ExecutionsModule"
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {
}
