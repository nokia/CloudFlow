// Copyright (C) 2017 Nokia

import {Component, Input} from "@angular/core";

export interface InfoItemProperty {
    key: string;
    display: string;
    value?: any;
    renderType?: string;
    mode?: string;
    instance?: string;
}

export function getPropTimeout(prop: InfoItemProperty): number {
    switch (prop.renderType) {
        case 'code':
            return 500;
        default:
            return 0;
    }
}

@Component({
    selector: 'cf-info-item',
    templateUrl: './info-item.component.html',
    styleUrls: ['./info-item.component.scss']
})
export class InfoItemComponent {

    @Input() prop: InfoItemProperty;

}
