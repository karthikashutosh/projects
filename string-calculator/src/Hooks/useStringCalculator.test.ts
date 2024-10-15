import { renderHook, act } from '@testing-library/react';
import { useStringCalculator } from './useStringCalculator';
import '@testing-library/jest-dom';

describe('useStringCalculator', () => {
  it('should return 0 for an empty string', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('');
    });
    expect(result.current.result).toBe(0);
  });

  it('should return the number for a single number', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('1');
    });
    expect(result.current.result).toBe(1);
  });

  it('should return the sum of two numbers', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('1,2');
    });
    expect(result.current.result).toBe(3);
  });

  it('should handle unknown amount of numbers', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('1,2,3,4,5');
    });
    expect(result.current.result).toBe(15);
  });

  it('should handle new lines between numbers', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('1\n2,3');
    });
    expect(result.current.result).toBe(6);
  });

  it('should support different delimiters', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('//;\n1;2');
    });
    expect(result.current.result).toBe(3);
  });

  it('should throw an exception for negative numbers', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('1,-2,3,-4');
    });
    expect(result.current.error).toBe('Negatives not allowed: -2, -4');
  });

  it('should ignore numbers bigger than 1000', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('2,1001');
    });
    expect(result.current.result).toBe(2);
  });

  it('should handle multiple delimiters', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('//[*][%]\n1*2%3');
    });
    expect(result.current.result).toBe(6);
  });

  it('should handle delimiters with length longer than one char', () => {
    const { result } = renderHook(() => useStringCalculator());
    act(() => {
      result.current.calculate('//[***]\n1***2***3');
    });
    expect(result.current.result).toBe(6);
  });
});