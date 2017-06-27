// Copyright (C) 2017 Nokia

import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {InfoItemComponent} from "./info-item.component";
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {By} from "@angular/platform-browser";
import {CopyableComponent} from "../../shared/components/copyable.component";
import {CodeMirrorExpandComponent} from "../../shared/components/codemirror/codemirror-expand.component";

describe('InfoItemComponent', () => {
    let component: InfoItemComponent;
    let fixture: ComponentFixture<InfoItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, NgbModule.forRoot()],
            declarations: [InfoItemComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoItemComponent);
    });

    describe('test property with default renderer', () => {
        beforeEach(() => {
            component = fixture.componentInstance;
            component.prop = {display: 'A Property', key: 'a_property', value: 'a_value'};
            fixture.detectChanges();
        });

        it('should be created', () => {
            expect(component).toBeTruthy();
        });

        it('should render property data', () => {
            const header = fixture.debugElement.query(By.css("h6"));
            expect(header.nativeElement.textContent).toEqual("A Property:");
        });

        it('should render copyable directive', () => {
            const copyable = fixture.debugElement.query(By.directive(CopyableComponent));
            const copyableInstance = copyable.injector.get(CopyableComponent) as CopyableComponent;
            expect(copyableInstance.content).toEqual('a_value');
        });

        it('should not render codemirror component', () => {
            expect(fixture.debugElement.query(By.directive(CodeMirrorExpandComponent))).toBeNull();
        });
    });

    describe('test property with badge renderer', () => {
        beforeEach(() => {
            component = fixture.componentInstance;
            component.prop = {display: 'A Property', key: 'a_property', value: 'SUCCESS', renderType: 'badge'};
            fixture.detectChanges();
        });

        it('should have a badge', () => {
            const badge = fixture.debugElement.query(By.css(".badge"));
            expect(badge).not.toBeNull();
            expect(badge.nativeElement.textContent).toEqual('SUCCESS');
        });
    });

    describe('text property with codemirror renderer', () => {
        beforeEach(() => {
            component = fixture.componentInstance;
            component.prop = {display: 'A Property', key: 'a_property',
                value: {hello: 'world'}, renderType: 'code', mode: 'json'};
            fixture.detectChanges();
        });

        it('should have a codemirror expand component', () => {
            const cmexpand = fixture.debugElement.query(By.directive(CodeMirrorExpandComponent));
            expect(cmexpand).not.toBeNull();
            const cmexpandInstance = cmexpand.injector.get(CodeMirrorExpandComponent) as CodeMirrorExpandComponent;
            expect(cmexpandInstance.title).toEqual('A Property');
            expect(cmexpandInstance.input).toEqual({hello: 'world'});
        });
    })
});
