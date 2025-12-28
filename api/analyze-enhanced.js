// Advanced ATS Analysis API with Vector Embeddings
// Uses OpenAI for semantic matching + Claude for insights

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
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey) {
    return res.status(500).json({ error: 'Anthropic API key not configured' });
  }

  if (!resumeText || !jdText) {
    return res.status(400).json({ error: 'Missing resume or job description' });
  }

  // ============================================
  // PHASE 1: VECTOR EMBEDDINGS (Semantic Match)
  // ============================================
  
  let semanticScore = null;
  let embeddingError = null;

  if (openaiKey) {
    try {
      // Get embeddings for both texts
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: [
            resumeText.slice(0, 8000), // Limit to 8k chars
            jdText.slice(0, 8000)
          ]
        })
      });

      const embeddingData = await embeddingResponse.json();

      if (embeddingData.data && embeddingData.data.length === 2) {
        const resumeVector = embeddingData.data[0].embedding;
        const jdVector = embeddingData.data[1].embedding;
        
        // Calculate Cosine Similarity
        semanticScore = cosineSimilarity(resumeVector, jdVector);
      }
    } catch (err) {
      console.error('Embedding error:', err);
      embeddingError = err.message;
    }
  }

  // ============================================
  // PHASE 2: AI ANALYSIS (Claude)
  // ============================================

  const semanticContext = semanticScore !== null 
    ? `\n## Semantic Similarity Score: ${Math.round(semanticScore * 100)}%\nThis measures how conceptually similar the resume is to the job description using vector embeddings.`
    : '';

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze this resume against the job description.

## Resume:
${resumeText}

## Job Description:
${jdText}

## Local Keyword Analysis:
- Keyword Match Score: ${localResults?.overallScore || 'N/A'}%
- Matched Keywords: ${localResults?.matchedKeywords?.slice(0, 20).join(', ') || 'N/A'}
- Missing Keywords: ${localResults?.missingKeywords?.slice(0, 15).join(', ') || 'N/A'}
${semanticContext}

## Your Task:
Provide comprehensive analysis with:
1. Executive Summary (4-6 sentences covering alignment, strengths, gaps, and strategic recommendations)
2. 10-15 specific modification suggestions organized by resume section

## Return ONLY this JSON (no markdown):
{
  "executiveSummary": "<4-6 sentence strategic assessment. Be specific about: overall alignment, key strengths that match JD, major gaps, missing qualifications, and how to reposition the resume. Reference specific content from both documents.>",
  
  "semanticInsights": {
    "strongMatches": ["<concept in resume that semantically matches JD even if different words>"],
    "hiddenGaps": ["<JD requirement not obviously missing but semantically absent>"],
    "repositioningTips": ["<how to reframe existing experience to better match JD language>"]
  },
  
  "modifications": [
    {
      "section": "Professional Summary",
      "issue": "<specific problem>",
      "original": "<quote from resume or null>",
      "suggestion": "<improved text with JD keywords>",
      "reason": "<why this helps, reference JD>"
    },
    {
      "section": "Experience - [Company]",
      "issue": "<specific problem>",
      "original": "<original bullet point>",
      "suggestion": "<improved version>",
      "reason": "<explanation>"
    }
  ],
  
  "sectionScores": {
    "summary": { "score": <0-100>, "feedback": "<brief feedback>" },
    "experience": { "score": <0-100>, "feedback": "<brief feedback>" },
    "skills": { "score": <0-100>, "feedback": "<brief feedback>" },
    "education": { "score": <0-100>, "feedback": "<brief feedback>" }
  },
  
  "skillsAnalysis": {
    "hardSkills": {
      "matched": ["<technical skill found>"],
      "missing": ["<critical technical skill missing>"]
    },
    "softSkills": {
      "matched": ["<soft skill demonstrated>"],
      "missing": ["<soft skill from JD not shown>"]
    }
  },
  
  "atsWarnings": ["<any ATS compatibility issues: formatting, file type, headers, etc.>"],
  
  "interviewPrep": ["<likely interview question based on JD>", "<topic to prepare>"]
}

Important:
- Provide 10-15 modifications covering different sections
- Be specific - quote actual resume text in "original" field
- Make suggestions complete and ready to use
- Reference JD requirements in your reasons`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic API Error:', data.error);
      return res.status(400).json({ error: data.error.message });
    }

    const content = data.content[0].text;
    
    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Add semantic score to response
        return res.status(200).json({
          ...parsed,
          semanticScore: semanticScore !== null ? Math.round(semanticScore * 100) : null,
          embeddingEnabled: openaiKey ? true : false,
          embeddingError: embeddingError
        });
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

// ============================================
// COSINE SIMILARITY FUNCTION
// ============================================

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return null;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (normA * normB);
}
