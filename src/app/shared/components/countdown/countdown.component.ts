// Copyright (C) 2017 Nokia

import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
    selector: 'cf-countdown',
    templateUrl: "./countdown.component.html",
    styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
    private timeout = null;
    protected value = 0;
    private INTERVAL_SEC = 31;
    private _paused = false;

    @Output() done = new EventEmitter<any>();

    get paused() {
        return this._paused;
    }

    private clearTimeout() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    ngOnInit() {
        this.value = this.INTERVAL_SEC;
        this.tick();
    }

    restart() {
        this.clearTimeout();
        this.value = this.INTERVAL_SEC;
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
            this.value--;
            this.timeout = setTimeout(() => this.tick(), 1 * 1000);
        } else {
            this.manualRefresh();
        }
    }

    manualRefresh() {
        this.clearTimeout();
        this.value = 0;
        this.done.emit();
    }
}
