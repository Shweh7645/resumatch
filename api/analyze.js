export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeText, jdText, apiKey } = req.body;

  if (!resumeText || !jdText || !apiKey) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyze this resume against the job description and provide detailed feedback.

## Resume:
${resumeText}

## Job Description:
${jdText}

## Provide your analysis in the following JSON format exactly (no markdown, just JSON):
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "sections": {
    "experience": {
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "improvements": ["<improvement 1>", "<improvement 2>"]
    },
    "skills": {
      "score": <number 0-100>,
      "matched": ["<skill1>", "<skill2>"],
      "missing": ["<skill1>", "<skill2>"],
      "feedback": "<specific feedback>"
    },
    "education": {
      "score": <number 0-100>,
      "feedback": "<specific feedback>"
    },
    "formatting": {
      "score": <number 0-100>,
      "issues": ["<issue1>", "<issue2>"],
      "passed": ["<check1>", "<check2>"]
    }
  },
  "keywordAnalysis": {
    "matchedKeywords": ["<keyword1>", "<keyword2>"],
    "missingKeywords": ["<keyword1>", "<keyword2>"],
    "keywordDensity": "<assessment of keyword usage>"
  },
  "recommendations": [
    {
      "priority": "high",
      "title": "<recommendation title>",
      "description": "<detailed actionable advice>",
      "example": "<specific example if applicable>"
    }
  ],
  "bulletPointRewrites": [
    {
      "original": "<original bullet point from resume>",
      "improved": "<AI-improved version with metrics and keywords>",
      "explanation": "<why this is better>"
    }
  ],
  "atsCompatibility": {
    "score": <number 0-100>,
    "issues": ["<issue1>"],
    "suggestions": ["<suggestion1>"]
  },
  "interviewTips": ["<tip based on JD>", "<tip based on resume gaps>"]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const content = data.content[0].text;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.status(200).json(parsed);
    }
    
    return res.status(500).json({ error: 'Could not parse AI response' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
