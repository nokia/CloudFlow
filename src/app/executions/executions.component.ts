// Copyright (C) 2017 Nokia

import {Component} from "@angular/core";

@Component({
    selector: 'cf-executions',
    template: `<router-outlet></router-outlet>`,
    styles: [`
        :host{
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    `]
})
export class ExecutionsComponent {

}
