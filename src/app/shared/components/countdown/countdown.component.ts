// Copyright (C) 2017 Nokia

import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
    selector: 'cf-countdown',
    templateUrl: "./countdown.component.html",
    styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
    private timeout = null;
    private INTERVAL_SEC = 30;
    private _paused = false;
    private _value = 0;

    @Output() done = new EventEmitter<any>();

    get paused() {
        return this._paused;
    }

    get value() {
        return this._value;
    }

    private clearTimeout() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    ngOnInit() {
        this._value = this.INTERVAL_SEC;
        this.tick();
    }

    restart() {
        this.clearTimeout();
        this._value = this.INTERVAL_SEC;
        this.tick();
    }

    ngOnDestroy() {
        this.clearTimeout();
    }

    private pause() {
        this._paused = true;
        this.clearTimeout();
    }

    togglePause() {
        if (this.paused) {
            this.tick();
        } else {
            this.pause();
        }
    }

    private tick() {
        if (this.value > 0) {
            this._paused = false;
            this._value--;
            this.timeout = setTimeout(() => this.tick(), 1 * 1000);
        } else {
            this.manualRefresh();
        }
    }

    manualRefresh() {
        this.clearTimeout();
        this._value = 0;
        this.done.emit();
    }
}
