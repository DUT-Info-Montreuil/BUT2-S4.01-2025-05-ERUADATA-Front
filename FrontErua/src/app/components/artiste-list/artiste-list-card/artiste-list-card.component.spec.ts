import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArtisteListCardComponent} from './artiste-list-card.component';

describe('ArtisteListCardComponent', () => {
    let component: ArtisteListCardComponent;
    let fixture: ComponentFixture<ArtisteListCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArtisteListCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ArtisteListCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
