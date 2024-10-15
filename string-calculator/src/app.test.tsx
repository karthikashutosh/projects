import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders String Calculator', () => {
  render(<App />);
  const headerElement = screen.getByText(/String Calculator/i);
  expect(headerElement).toBeInTheDocument();
});

test('calculates sum correctly', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter numbers/i) as HTMLInputElement;
  const button = screen.getByText(/Calculate/i);
  fireEvent.change(input, { target: { value: '1,2,3' } });
  fireEvent.click(button);
  const result = screen.getByText(/Result: 6/i);
  expect(result).toBeInTheDocument();
});

test('displays error for negative numbers', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter numbers/i) as HTMLInputElement;
  const button = screen.getByText(/Calculate/i);
  fireEvent.change(input, { target: { value: '1,-2,3' } });
  fireEvent.click(button);
  const error = screen.getByText(/Error: Negatives not allowed: -2/i);
  expect(error).toBeInTheDocument();
});