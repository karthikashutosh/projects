import { ChangeEvent, FormEvent, useState } from 'react';
import { useStringCalculator } from './Hooks/useStringCalculator';

const App =  () => {
  const [input, setInput] = useState<string>('');
  const { result, error, calculate } = useStringCalculator();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    calculate(input);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div style={{
      width:"100vw",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        width: '90%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          color: '#333',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>String Calculator</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter numbers (e.g., 1,2,3 or //[;]\n1;2;3)"
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #000000',
              borderRadius: '4px',
              marginBottom: '1rem',
              color:"gray",
              backgroundColor:"white"
            }}
          />
          <button type="submit" style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}>
            Calculate
          </button>
        </form>
        {result !== null && (
          <p style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginTop: '1rem',
            color: '#4CAF50'
          }}>
            Result: {result}
          </p>
        )}
        {error && (
          <p style={{
            textAlign: 'center',
            color: '#D32F2F',
            marginTop: '1rem'
          }}>
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;