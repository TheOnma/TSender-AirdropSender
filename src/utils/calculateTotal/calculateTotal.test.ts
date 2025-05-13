// calculateTotal.test.ts
import { describe, expect, it } from 'vitest';
import { calculateTotal } from './calculateTotal'; // Update the import path

describe('calculateTotal', () => {
  it('should return 0 for empty input', () => {
    expect(calculateTotal('')).toBe(0);
    expect(calculateTotal('   ')).toBe(0);
  });

  it('should work with newlines', () => {
    expect(calculateTotal('100')).toBe(100);
    expect(calculateTotal('100,200')).toBe(300);
    expect(calculateTotal('100\n200')).toBe(300);
    expect(calculateTotal('100, 200\n300')).toBe(600);
  });

  it('should handle different whitespace scenarios', () => {
    expect(calculateTotal(' 100 ')).toBe(100);
    expect(calculateTotal(' 150 , 250 ')).toBe(400);
    expect(calculateTotal('\t200\n 300 \n')).toBe(500);
  });

  it('should filter out invalid entries', () => {
    expect(calculateTotal('abc')).toBe(0);
    expect(calculateTotal('100, invalid, 200')).toBe(300);
    expect(calculateTotal('10.5, foo\n20.3')).toBe(30.8);
    expect(calculateTotal('12three\n45')).toBe(57);
  });

  it('should handle decimal numbers', () => {
    expect(calculateTotal('10.5\n20.3')).toBe(30.8);
    expect(calculateTotal('5.5,5.5')).toBe(11);
  });

  it('should handle mixed delimiters', () => {
    expect(calculateTotal('100,,200\n\n300')).toBe(600);
    expect(calculateTotal(',100,,200,')).toBe(300);
    expect(calculateTotal('\n\n100\n200\n\n')).toBe(300);
  });

  it('should handle complex combinations', () => {
    const input = `
      100, 200
      300,
      400
      ,500, invalid
      600.5
      seven
    `;
    expect(calculateTotal(input)).toBe(100 + 200 + 300 + 400 + 500 + 600.5);
  });

  it('should handle very large numbers', () => {
    expect(calculateTotal('1000000,2000000')).toBe(3000000);
    expect(calculateTotal('1e6\n2e6')).toBe(3000000);
  });

  it('should handle negative numbers', () => {
    expect(calculateTotal('-100,200')).toBe(100);
    expect(calculateTotal('100,-200')).toBe(-100);
    expect(calculateTotal('-50,-50')).toBe(-100);
  });
});