// Copyright (C) 2017 Nokia

import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
    selector: 'cf-countdown',
    template: `<span class="text-muted2">
                  <i class="fa fa-refresh pointer" title="Refresh" (click)="manualRefresh()"></i> Refresh In: {{value}}
               </span>
            <div ngbDropdown [autoClose]="'outside'">
                <button class="btn btn-link" [class.text-muted2]="!paused" ngbDropdownToggle></button>
                <div ngbDropdownMenu>
                  <form role="form">
                    <div class="form-check abc-checkbox abc-checkbox-primary">
                      <input type="checkbox" class="form-check-input" id="f1" [checked]="paused" (change)="togglePause()"/>
                      <label class="form-check-label" for="f1">{{paused ? 'Paused' : 'Pause'}}</label>
                    </div>
                  </form>
                </div>
            </div>
    `,
    styles: [
        `[ngbDropdownToggle] {
            padding: 0;
            padding-left: 3px;
        }
        
        form > div {
            margin: 0;
            padding: .5rem 1rem;
        }`
    ]
})
export class CountdownComponent implements OnInit, OnDestroy {
    private timeout = null;
    protected value: number = 0;
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

    tick() {
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
