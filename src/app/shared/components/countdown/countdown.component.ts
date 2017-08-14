import {Component} from '@angular/core';

/**
 * Temporary don't use a fancy countdown but this inline "Auto Refresh" span.
 * Most of the defined parameters here are not in use (besides 'value').
 */
@Component({
    selector: 'cf-countdown',
    template: `<span class="countdown-text text-muted2"><i class="fa fa-refresh"></i> Auto Refresh: {{value}}</span>`,
})
export class CountdownComponent {
    private initValue = 30;
    private readonly counterCircleInit = 113; // must match the css value of stroke-dasharray attribute

    value = 0;
    strokeValue = 113;

    setInitValue(value: number) {
        this.initValue = value;
    }

    setValue(tick: number) {
        this.value = tick;
        this.strokeValue = (this.initValue - tick) * (this.counterCircleInit / this.initValue);
    }

}
