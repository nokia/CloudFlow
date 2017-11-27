// Copyright (C) 2017 Nokia

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CountdownComponent} from './countdown.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {By} from "@angular/platform-browser";

describe('Countdown Component', () => {
    let component: CountdownComponent;
    let fixture: ComponentFixture<CountdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbModule.forRoot()],
            declarations: [CountdownComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
        expect(component.paused).toBeFalsy();
    });

    it("should toggle to pause and then resume", () => {
        // pause
        component.togglePause();
        fixture.detectChanges();
        const inputLabel = fixture.debugElement.query(By.css(`label[for="pause"]`));
        expect(inputLabel.nativeElement.textContent).toEqual("Paused");

        // resume
        component.togglePause();
        fixture.detectChanges();
        expect(inputLabel.nativeElement.textContent).toEqual("Pause");
    });

    it("should emit when manual refresh is clicked", () => {
        const emitSpy = spyOn(component.done, "emit");
        component.manualRefresh();
        expect(emitSpy).toHaveBeenCalled();
    });

    it("should test value decrements after 1 second", (done) => {
        const span = fixture.debugElement.query(By.css(`span`));
        const toNumber = (el: string) => parseInt(el.match(/[\D]+(\d+)/)[1], 10);
        const initialValue = toNumber(span.nativeElement.textContent);

        setTimeout(() => {
            fixture.detectChanges();
            expect(toNumber(span.nativeElement.textContent)).toBeLessThan(initialValue);
            done();
        }, 1500);
    });
});
