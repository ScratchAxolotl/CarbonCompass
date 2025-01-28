// ---------------------------------------------------------------------------
//  * AI RESPONSE //
// ---------------------------------------------------------------------------

import { useState } from 'react';
import axios from 'axios';

const AiForm = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError('Failed to fetch Carbon Offset AI response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleOpenAiRequest} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate AI Response'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {aiResponse && <p>{aiResponse}</p>}
    </div>
  );
};

export default AiForm;
