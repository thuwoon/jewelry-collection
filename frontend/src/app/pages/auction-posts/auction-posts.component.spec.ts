import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPostsComponent } from './auction-posts.component';

describe('AuctionPostsComponent', () => {
  let component: AuctionPostsComponent;
  let fixture: ComponentFixture<AuctionPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuctionPostsComponent]
    });
    fixture = TestBed.createComponent(AuctionPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
