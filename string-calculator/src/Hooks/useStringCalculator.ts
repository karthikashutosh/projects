import { useState } from 'react';

export const useStringCalculator = (): {
  result: number | null;
  error: string | null;
  calculate: (numbers: string) => void;
} => {
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = (numbers: string): void => {
    try {
      setError(null);
      setResult(add(numbers));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResult(null);
    }
  };

  const add = (numbers: string): number => {
    if (numbers === '') return 0;
    let delimiter: RegExp = /[,\n]/;
    let numbersString: string = numbers;

    if (numbers.startsWith('//')) {
      const parts: string[] = numbers.split('\n');
      const delimiterPart: string = parts[0].slice(2);
      
      if (delimiterPart.startsWith('[') && delimiterPart.endsWith(']')) {
        delimiter = new RegExp(delimiterPart.slice(1, -1).split('][').map(d => d.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'));
      } else {
        delimiter = new RegExp(delimiterPart);
      }
      
      numbersString = parts.slice(1).join('\n');
    }

    const nums: number[] = numbersString.split(delimiter).map(Number);
    
    const negatives: number[] = nums.filter(num => num < 0);
    if (negatives.length > 0) {
      throw new Error(`Negatives not allowed: ${negatives.join(', ')}`);
    }

    return nums.reduce((sum, num) => sum + (num <= 1000 ? num : 0), 0);
  };

  return { result, error, calculate };
};