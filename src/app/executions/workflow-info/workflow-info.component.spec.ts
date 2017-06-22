import {By} from "@angular/platform-browser";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {WorkflowInfoComponent} from "./workflow-info.component";
import {SharedModule} from "../../shared/shared.module";
import {MistralService} from "../../engines/mistral/mistral.service";
import {MistralServiceMock} from "../../engines/mistral/mistral.service.mock";
import {CodeMirrorComponent} from "../../shared/components/codemirror/codemirror.component";


describe('WorkflowInfoComponent', () => {
    let component: WorkflowInfoComponent;
    let fixture: ComponentFixture<WorkflowInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, NgbModule.forRoot()],
            declarations: [WorkflowInfoComponent],
            providers: [{provide: MistralService, useValue: MistralServiceMock}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkflowInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('should display the properties of the execution', () => {
        it('should display headers', () => {
            const headers = fixture.debugElement.queryAll(By.css('h6'));
            expect(headers.length).toBeGreaterThan(0);
        });

        it('should display some properties', () => {
           const workflow_id = fixture.debugElement.query(By.css("#workflow-execution-property-workflow_id")).nativeElement;
           expect(workflow_id.textContent).toContain("abcd-efg");

           const execution_id = fixture.debugElement.query(By.css("#workflow-execution-property-id")).nativeElement;
           expect(execution_id.textContent).toContain("xyz-uvw");
        });

        it('should display codemirror instance for "code" objects', () => {
            const input = fixture.debugElement.query(By.css("#workflow-execution-property-input"));
            const codeMirrorElement = input.query(By.directive(CodeMirrorComponent));
            const codeMirrorInstance = codeMirrorElement.injector.get(CodeMirrorComponent) as CodeMirrorComponent;
            expect(codeMirrorInstance.input).toEqual({param1: 1});
        });
    });


});
