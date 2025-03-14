import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomListsComponent } from './custom-lists.component';

describe('CustomListsComponent', () => {
  let component: CustomListsComponent;
  let fixture: ComponentFixture<CustomListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
