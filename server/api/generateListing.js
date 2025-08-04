const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send({ error: 'Image is required' });
      return;
    }

    const base64Image = req.file.buffer.toString('base64');

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: 'Generate JSON with keys title, description, and condition for this product photo.',
            },
            { type: 'input_image', image_base64: base64Image },
          ],
        },
      ],
      temperature: 0.2,
    });

    let data;
    try {
      data = JSON.parse(response.output_text);
    } catch (e) {
      data = { raw: response.output_text };
    }

    res.json(data);
  } catch (err) {
    console.error('generateListing failed', err);
    res.status(500).send({ error: 'AI processing failed' });
  }
};
