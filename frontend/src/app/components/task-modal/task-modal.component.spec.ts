import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskModelComponent } from './task-modal.component';

describe('TaskModelComponent', () => {
  let component: TaskModelComponent;
  let fixture: ComponentFixture<TaskModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
