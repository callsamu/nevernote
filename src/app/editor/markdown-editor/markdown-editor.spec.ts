import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownEditor } from './markdown-editor';

describe('MarkdownEditor', () => {
  let component: MarkdownEditor;
  let fixture: ComponentFixture<MarkdownEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
