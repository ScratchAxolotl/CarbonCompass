// ---------------------------------------------------------------------------
//  * AI RESPONSE //
// ---------------------------------------------------------------------------

import { useState } from 'react';
import axios from 'axios';

const AiForm = () => {
  const [aiResponse, setAiResponse] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleOpenAiRequest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/openai', {
        prompt:
          'In less than a few sentences, write a brief explanation about carbon offsets.',
      });
      setAiResponse(response.data.aiResponse);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setError(new Error('Failed to fetch Carbon Offset AI response'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleOpenAiRequest} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate AI Response'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      {aiResponse && <p>{aiResponse}</p>}
    </div>
  );
};

export default AiForm;
