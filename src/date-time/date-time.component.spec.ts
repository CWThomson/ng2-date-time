/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { DateTimeComponent } from './date-time.component';

describe('Component: DateTime', () => {
  it('should create an instance', () => {
    let component = new DateTimeComponent();
    expect(component).toBeTruthy();
  });
});
