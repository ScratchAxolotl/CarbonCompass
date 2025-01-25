import OpenAI from 'openai';

const openAiController = {};

// ----------------------------------------------------------------------
// * OPENAI ANALYSIS * //
// ----------------------------------------------------------------------

openAiController.generateResponse = async (req, res, next) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000, // 60 seconds timeout
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      //   store: true,
      messages: [
        {
          role: 'user',
          content: `write a haiku about carbon offset`,
        },
      ],
      max_tokens: 200,
    });

    const aiResponse = completion.choices[0].message.content.trim() || '';
    res.locals.aiResponse = aiResponse;
    next();
  } catch (error) {
    console.error('Error generating AI Carbon Offset response:', error);
    res.status(500).json({
      error: 'Error generating AI Carbon Offset response',
      details: error.message,
    });
  }
};

export default openAiController;
