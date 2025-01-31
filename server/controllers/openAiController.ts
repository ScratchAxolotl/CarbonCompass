import OpenAI from 'openai';

const openAiController = {};

// ----------------------------------------------------------------------
// * OPENAI ANALYSIS * //
// ----------------------------------------------------------------------

openAiController.generateResponse = async (req, res, next) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key is missing' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000, // 60 second timeout
    });

    const { prompt = 'Write a haiku about carbon offsets' } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150, // Limit response length
    });

    const aiResponse =
      completion.choices[0].message.content.trim() || 'No response generated';

    res.locals.aiResponse = aiResponse;
    next();
  } catch (error) {
    console.error('Detailed OpenAI API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      error: 'Failed to generate AI response',
      details: error.message,
    });
  }
};

export default openAiController;
