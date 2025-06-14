import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArtisteDetailComponent} from './artiste-detail-component';

describe('ArtisteDetailComponent', () => {
    let component: ArtisteDetailComponent;
    let fixture: ComponentFixture<ArtisteDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArtisteDetailComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ArtisteDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
