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

  const { resumeText, jdText, localResults } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!resumeText || !jdText) {
    return res.status(400).json({ error: 'Missing resume or job description' });
  }

  // Build context from local results if available
  const localContext = localResults ? `
## Local Analysis Results (for reference):
- Overall Score: ${localResults.overallScore}%
- Matched Keywords: ${localResults.keywordAnalysis?.matchedKeywords?.join(', ') || 'N/A'}
- Missing Keywords: ${localResults.keywordAnalysis?.missingKeywords?.join(', ') || 'N/A'}
` : '';

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyze this resume against the job description and provide detailed, actionable feedback.

## Resume:
${resumeText}

## Job Description:
${jdText}
${localContext}

## Your Task:
Enhance the analysis with your semantic understanding. Focus on:
1. Skills that are semantically related but use different terminology
2. Experience that matches job requirements even if worded differently
3. Specific bullet point rewrites that incorporate missing keywords
4. Actionable recommendations based on gaps

## Provide your analysis in this exact JSON format (no markdown, just JSON):
{
  "overallScore": <number 0-100, be fair but accurate>,
  "summary": "<2-3 sentence assessment highlighting strengths and key gaps>",
  "sections": {
    "experience": {
      "score": <number 0-100>,
      "feedback": "<specific feedback about experience alignment>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "improvements": ["<specific improvement 1>", "<specific improvement 2>"]
    },
    "skills": {
      "score": <number 0-100>,
      "matched": ["<skill1>", "<skill2>", "<include semantically related matches>"],
      "missing": ["<critical missing skill 1>", "<critical missing skill 2>"],
      "feedback": "<assessment of skill alignment>"
    },
    "education": {
      "score": <number 0-100>,
      "feedback": "<education assessment>"
    },
    "formatting": {
      "score": <number 0-100>,
      "issues": ["<issue if any>"],
      "passed": ["<what's good>"]
    }
  },
  "keywordAnalysis": {
    "matchedKeywords": ["<include semantically matched keywords>"],
    "missingKeywords": ["<truly missing critical keywords>"],
    "keywordDensity": "<assessment>"
  },
  "recommendations": [
    {
      "priority": "high",
      "title": "<actionable title>",
      "description": "<specific advice with context from the JD>",
      "example": "<concrete example they can use>"
    },
    {
      "priority": "medium",
      "title": "<actionable title>",
      "description": "<specific advice>",
      "example": "<concrete example>"
    }
  ],
  "bulletPointRewrites": [
    {
      "original": "<actual bullet point from their resume that could be improved>",
      "improved": "<rewritten version with keywords from the JD and quantified impact>",
      "explanation": "<brief explanation of why this is better>"
    },
    {
      "original": "<another bullet point>",
      "improved": "<rewritten version>",
      "explanation": "<explanation>"
    },
    {
      "original": "<third bullet point if applicable>",
      "improved": "<rewritten version>",
      "explanation": "<explanation>"
    }
  ],
  "atsCompatibility": {
    "score": <number 0-100>,
    "issues": ["<ATS issue if any>"],
    "suggestions": ["<ATS optimization tip>"]
  },
  "interviewTips": [
    "<specific interview tip based on this JD>",
    "<tip about skills they should be ready to discuss>",
    "<tip about potential questions based on gaps>"
  ]
}

Important:
- Be specific and reference actual content from the resume and JD
- Provide at least 2-3 bullet point rewrites that incorporate JD keywords
- Make recommendations actionable and concrete
- Consider semantic matches (e.g., "led team" matches "leadership")
- Return ONLY the JSON object, no other text`;

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
      console.error('Anthropic API Error:', data.error);
      return res.status(400).json({ error: data.error.message });
    }

    const content = data.content[0].text;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json(parsed);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        return res.status(500).json({ error: 'Failed to parse AI response' });
      }
    }
    
    return res.status(500).json({ error: 'Could not extract JSON from AI response' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
