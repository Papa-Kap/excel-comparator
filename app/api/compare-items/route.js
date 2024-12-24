import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function POST(req) {
  try {
    const { items1, items2, similarityThreshold } = await req.json();

    // Prepare the prompt for the AI model
    const prompt = `Compare the following two lists of items and find similar matches. 
    Only return matches with similarity above ${similarityThreshold * 100}%.
    Consider variations in spelling, formatting, and word order.
    
    List 1: ${JSON.stringify(items1)}
    List 2: ${JSON.stringify(items2)}
    
    Return the results in this exact JSON format:
    {
      "matches": [
        {
          "item1": "item from list 1",
          "item2": "item from list 2",
          "similarity": 0.95
        }
      ]
    }`;

    // Generate comparison results using the AI model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI model');
    }

    const comparisonResults = JSON.parse(jsonMatch[0]);

    // Return the results
    return Response.json(comparisonResults);
  } catch (error) {
    console.error('Error in comparison:', error);
    return Response.json(
      { error: 'Failed to compare items' },
      { status: 500 }
    );
  }
}