import { TestBed } from '@angular/core/testing';

import { NotebookStore } from './notebook-store';

describe('NotebookStore', () => {
  let service: NotebookStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotebookStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
