import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OeuvreDetailComponent} from './oeuvre-detail-component';

describe('OeuvreDetailComponent', () => {
    let component: OeuvreDetailComponent;
    let fixture: ComponentFixture<OeuvreDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OeuvreDetailComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OeuvreDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
