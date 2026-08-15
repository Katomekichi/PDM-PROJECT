import { describe, it, expect } from 'vitest';

// Placeholder test to establish the pattern - full RTK Query + MSW mocked-API tests for
// PractitionerFormPage arrive alongside the real component test setup in Milestone 1b.
describe('Practitioner NPI validation', () => {
  it('accepts a 10-digit NPI', () => {
    expect(/^\d{10}$/.test('1234567890')).toBe(true);
  });

  it('rejects a non-10-digit NPI', () => {
    expect(/^\d{10}$/.test('12345')).toBe(false);
  });
});
