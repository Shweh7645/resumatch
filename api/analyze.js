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

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyze this resume against the job description.

## Resume:
${resumeText}

## Job Description:
${jdText}

## Local Analysis Results:
- Match Score: ${localResults?.overallScore || 'N/A'}%
- Matched Keywords: ${localResults?.matchedKeywords?.join(', ') || 'N/A'}
- Missing Keywords: ${localResults?.missingKeywords?.join(', ') || 'N/A'}

## Your Task:
Provide a comprehensive analysis with:
1. Executive Summary - A detailed 4-6 sentence strategic assessment
2. Section-by-section modification suggestions (10-15 specific changes)

## Return ONLY this JSON format (no markdown, no backticks):
{
  "executiveSummary": "<Write a 4-6 sentence strategic assessment. Cover: overall alignment, key strengths, major gaps, specific concerns (like missing qualifications), and strategic recommendations for repositioning. Be specific and reference actual content from both documents. Example tone: 'Your resume demonstrates strong X with relevant experience in Y and Z. The [Company] experience aligns well with [JD requirement]. However, the resume needs strategic repositioning to emphasize [gap areas]. Major gaps include: [specific missing items]. The resume reads more [current focus]-heavy than [desired focus]. Restructure to lead with [recommended focus].'>",
  
  "modifications": [
    {
      "section": "Professional Summary",
      "issue": "<One sentence describing what's wrong or missing>",
      "original": "<Quote the actual text from resume if applicable, or null>",
      "suggestion": "<The improved/rewritten text>",
      "reason": "<Why this change helps - reference JD keywords or requirements>"
    },
    {
      "section": "Experience - [Company Name]",
      "issue": "<Issue description>",
      "original": "<Original bullet point from resume>",
      "suggestion": "<Improved version with JD keywords>",
      "reason": "<Explanation referencing JD language>"
    }
  ]
}

## Guidelines for modifications:
- Include 10-15 modifications covering different resume sections
- Sections should be: Professional Summary, Experience - [Company], Skills & Certifications, Education
- Each modification should incorporate specific keywords from the JD
- Original field should quote actual resume text when suggesting rewrites
- Suggestions should be complete, ready-to-use replacements
- Reasons should reference specific JD requirements or keywords
- Focus on: missing keywords, weak action verbs, lack of metrics, missing JD terminology
- Be specific - don't be generic like "add more detail"

Return ONLY the JSON object, nothing else.`;

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
        console.error('Content:', content);
        return res.status(500).json({ error: 'Failed to parse AI response' });
      }
    }
    
    return res.status(500).json({ error: 'Could not extract JSON from AI response' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
