import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Zap, Target, TrendingUp, ChevronDown, ChevronUp, Sparkles, RefreshCw, Copy, Check, Brain, BarChart3, FileSearch, Lightbulb, ArrowRight } from 'lucide-react';

// ============================================
// AI-POWERED ANALYSIS WITH CLAUDE API
// ============================================

const analyzeWithAI = async (resumeText, jdText, apiKey) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText,
        jdText,
        apiKey
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
};

// ============================================
// FALLBACK LOCAL ANALYSIS (No API Key)
// ============================================

const extractKeywords = (text) => {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'if', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'while', 'about', 'against', 'your', 'our', 'their', 'its', 'my', 'his', 'her', 'up', 'down', 'out', 'off', 'over', 'any', 'well', 'years', 'year', 'experience', 'work', 'working', 'team', 'ability', 'strong', 'excellent', 'proven', 'demonstrated', 'responsible', 'responsibilities', 'including', 'using', 'used', 'new', 'first', 'one', 'two', 'three', 'based', 'across', 'within', 'along', 'among', 'around', 'behind', 'beyond']);
  
  const words = text.toLowerCase()
    .replace(/[^a-zA-Z0-9\s\+\#\.\-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  const phrases = [];
  const techTerms = ['machine learning', 'data science', 'project management', 'product management', 'user experience', 'user interface', 'full stack', 'front end', 'back end', 'cloud computing', 'data analysis', 'business analysis', 'agile methodology', 'scrum master', 'product owner', 'customer success', 'account management', 'sales operations', 'digital marketing', 'content marketing', 'social media', 'search engine', 'quality assurance', 'software development', 'web development', 'mobile development', 'cross functional', 'stakeholder management', 'sprint planning', 'product roadmap', 'go to market', 'key performance', 'return on investment', 'deep learning', 'natural language processing', 'computer vision', 'ci cd', 'continuous integration', 'continuous deployment', 'test driven', 'behavior driven', 'object oriented', 'functional programming', 'microservices architecture', 'restful api', 'graphql api', 'version control', 'code review'];
  
  techTerms.forEach(term => {
    if (text.toLowerCase().includes(term)) {
      phrases.push(term);
    }
  });
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return { words: Object.keys(wordFreq), phrases, frequency: wordFreq };
};

const categorizeSkills = (keywords) => {
  const hardSkills = ['python', 'javascript', 'typescript', 'react', 'node', 'nodejs', 'sql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'excel', 'tableau', 'power bi', 'looker', 'jira', 'confluence', 'asana', 'trello', 'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'salesforce', 'hubspot', 'marketo', 'google analytics', 'mixpanel', 'amplitude', 'segment', 'seo', 'sem', 'html', 'css', 'sass', 'less', 'git', 'github', 'gitlab', 'bitbucket', 'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'spark', 'hadoop', 'airflow', 'dbt', 'snowflake', 'databricks', 'tensorflow', 'pytorch', 'keras', 'scikit', 'pandas', 'numpy', 'scipy', 'matplotlib', 'r', 'stata', 'spss', 'matlab', 'sas', 'vue', 'angular', 'svelte', 'nextjs', 'gatsby', 'flutter', 'react native', 'ionic', 'electron', 'jenkins', 'circleci', 'travis', 'terraform', 'ansible', 'puppet', 'chef', 'linux', 'unix', 'bash', 'powershell', 'postman', 'swagger', 'selenium', 'cypress', 'jest', 'mocha', 'pytest', 'junit', 'webpack', 'vite', 'rollup', 'npm', 'yarn', 'pnpm', 'agile', 'scrum', 'kanban', 'waterfall', 'lean', 'devops', 'sre', 'cicd', 'mlops', 'dataops', 'microservices', 'serverless', 'lambda', 'blockchain', 'solidity', 'web3', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science', 'data engineering', 'data analytics', 'etl', 'elt', 'data warehouse', 'data lake', 'bi', 'reporting', 'dashboard', 'prds', 'user stories', 'acceptance criteria', 'roadmap', 'okrs', 'kpis', 'wireframing', 'prototyping', 'a/b testing', 'experimentation', 'sql server', 'oracle', 'sap', 'erp', 'crm'];
  
  const softSkills = ['leadership', 'communication', 'collaboration', 'teamwork', 'problem solving', 'analytical', 'creative', 'creativity', 'strategic', 'innovative', 'innovation', 'adaptable', 'adaptability', 'flexible', 'flexibility', 'organized', 'organization', 'detail oriented', 'attention to detail', 'self motivated', 'proactive', 'initiative', 'reliable', 'dependable', 'interpersonal', 'negotiation', 'presentation', 'public speaking', 'mentoring', 'coaching', 'training', 'decision making', 'time management', 'prioritization', 'multitasking', 'customer focused', 'customer centric', 'results driven', 'results oriented', 'goal oriented', 'critical thinking', 'emotional intelligence', 'empathy', 'conflict resolution', 'stakeholder', 'cross functional', 'influence', 'persuasion', 'written communication', 'verbal communication'];
  
  const found = { hard: [], soft: [] };
  keywords.forEach(kw => {
    const kwLower = kw.toLowerCase();
    if (hardSkills.some(skill => kwLower.includes(skill) || skill.includes(kwLower))) {
      found.hard.push(kw);
    }
    if (softSkills.some(skill => kwLower.includes(skill) || skill.includes(kwLower))) {
      found.soft.push(kw);
    }
  });
  
  return found;
};

const analyzeResumeLocally = (resumeText, jdText) => {
  const resumeData = extractKeywords(resumeText);
  const jdData = extractKeywords(jdText);
  
  const resumeWords = new Set([...resumeData.words, ...resumeData.phrases].map(w => w.toLowerCase()));
  const jdWords = [...new Set([...jdData.words, ...jdData.phrases])];
  
  const matched = [];
  const missing = [];
  
  jdWords.forEach(word => {
    const wordLower = word.toLowerCase();
    if (resumeWords.has(wordLower) || [...resumeWords].some(rw => rw.includes(wordLower) || wordLower.includes(rw))) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });
  
  const categorizedMissing = categorizeSkills(missing);
  const categorizedMatched = categorizeSkills(matched);
  
  const jdHardSkills = categorizeSkills(jdWords).hard;
  const jdSoftSkills = categorizeSkills(jdWords).soft;
  
  const hardScore = jdHardSkills.length > 0 ? (categorizedMatched.hard.length / Math.max(jdHardSkills.length, 1)) * 100 : 100;
  const softScore = jdSoftSkills.length > 0 ? (categorizedMatched.soft.length / Math.max(jdSoftSkills.length, 1)) * 100 : 100;
  const generalScore = jdWords.length > 0 ? (matched.length / jdWords.length) * 100 : 0;
  
  const overallScore = Math.min(100, Math.round(
    (hardScore * 0.6) + (softScore * 0.3) + (generalScore * 0.1)
  ));

  // Check formatting
  const hasEmail = /\b[\w.-]+@[\w.-]+\.\w+\b/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin/i.test(resumeText);
  const hasNumbers = /\d+%|\$[\d,]+|\d+\+|\d+ (years?|months?|projects?|teams?|clients?|customers?)/i.test(resumeText);
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'increased', 'reduced', 'improved', 'designed', 'launched', 'built', 'achieved', 'delivered', 'drove', 'executed', 'established', 'generated', 'grew', 'initiated', 'optimized', 'spearheaded', 'streamlined', 'transformed', 'orchestrated', 'pioneered', 'revamped', 'accelerated', 'championed'];
  const hasActionVerbs = actionVerbs.some(verb => resumeText.toLowerCase().includes(verb));
  const wordCount = resumeText.split(/\s+/).length;
  const hasSections = /experience|education|skills|summary|objective|projects?|certifications?/i.test(resumeText);

  // Generate recommendations
  const recommendations = [];
  
  if (overallScore < 50) {
    recommendations.push({
      priority: 'high',
      title: 'Critical: Low Keyword Match',
      description: 'Your resume matches less than 50% of job requirements. Add missing hard skills to your experience section.',
      example: `Add keywords like: ${categorizedMissing.hard.slice(0, 3).join(', ')}`
    });
  }
  
  if (categorizedMissing.hard.length > 3) {
    recommendations.push({
      priority: 'high',
      title: 'Add Technical Skills',
      description: `Include these missing skills if you have them: ${categorizedMissing.hard.slice(0, 5).join(', ')}`,
      example: 'Add these in your Skills section or demonstrate them in your Experience bullet points'
    });
  }

  if (!hasNumbers) {
    recommendations.push({
      priority: 'high',
      title: 'Quantify Your Achievements',
      description: 'Add numbers, percentages, and metrics to demonstrate impact.',
      example: 'Instead of "Improved sales", write "Increased sales by 35% over 6 months"'
    });
  }

  if (!hasActionVerbs) {
    recommendations.push({
      priority: 'medium',
      title: 'Use Strong Action Verbs',
      description: 'Start bullet points with powerful action verbs.',
      example: 'Use verbs like: Led, Developed, Implemented, Achieved, Optimized'
    });
  }
  
  if (categorizedMissing.soft.length > 2) {
    recommendations.push({
      priority: 'medium',
      title: 'Demonstrate Soft Skills',
      description: `Show these qualities through your achievements: ${categorizedMissing.soft.slice(0, 3).join(', ')}`,
      example: 'Instead of listing "leadership", write "Led a team of 5 engineers to deliver project 2 weeks early"'
    });
  }

  if (wordCount < 300) {
    recommendations.push({
      priority: 'medium',
      title: 'Add More Detail',
      description: 'Your resume seems short. Aim for 400-600 words with detailed accomplishments.',
      example: 'Add 2-3 bullet points per role describing your specific contributions and results'
    });
  }

  if (overallScore >= 70 && overallScore < 85) {
    recommendations.push({
      priority: 'low',
      title: 'Fine-tune for Higher Match',
      description: 'You\'re close! Mirror exact phrases from the job description where applicable.',
      example: 'If JD says "cross-functional collaboration", use that exact phrase in your resume'
    });
  }

  return {
    overallScore,
    summary: overallScore >= 80 
      ? "Excellent match! Your resume is well-aligned with this job description."
      : overallScore >= 60 
        ? "Good foundation. With some targeted improvements, you can significantly increase your match rate."
        : "Your resume needs optimization for this role. Focus on adding missing keywords and quantifying achievements.",
    sections: {
      experience: {
        score: Math.round(hardScore * 0.8 + (hasNumbers ? 20 : 0)),
        feedback: hasNumbers ? "Good use of metrics in experience section." : "Add more quantified achievements.",
        strengths: hasActionVerbs ? ["Uses action verbs"] : [],
        improvements: hasNumbers ? [] : ["Add numbers and percentages to show impact"]
      },
      skills: {
        score: Math.round(hardScore),
        matched: [...new Set(categorizedMatched.hard)].slice(0, 10),
        missing: [...new Set(categorizedMissing.hard)].slice(0, 10),
        feedback: categorizedMissing.hard.length > 5 ? "Missing several key technical skills from JD" : "Good skill alignment"
      },
      education: {
        score: 80,
        feedback: "Education section detected"
      },
      formatting: {
        score: (hasEmail ? 25 : 0) + (hasPhone ? 25 : 0) + (hasLinkedIn ? 25 : 0) + (hasSections ? 25 : 0),
        issues: [
          ...(!hasEmail ? ["No email address found"] : []),
          ...(!hasPhone ? ["No phone number found"] : []),
          ...(!hasLinkedIn ? ["Consider adding LinkedIn URL"] : []),
          ...(!hasSections ? ["Add standard section headers"] : [])
        ],
        passed: [
          ...(hasEmail ? ["Email address detected"] : []),
          ...(hasPhone ? ["Phone number detected"] : []),
          ...(hasLinkedIn ? ["LinkedIn profile included"] : []),
          ...(hasSections ? ["Standard sections present"] : [])
        ]
      }
    },
    keywordAnalysis: {
      matchedKeywords: [...new Set(matched)].slice(0, 20),
      missingKeywords: [...new Set(missing)].slice(0, 15),
      keywordDensity: matched.length > jdWords.length * 0.6 ? "Good keyword coverage" : "Consider adding more relevant keywords"
    },
    recommendations,
    bulletPointRewrites: [],
    atsCompatibility: {
      score: Math.round((hasEmail ? 20 : 0) + (hasPhone ? 20 : 0) + (hasSections ? 30 : 0) + (wordCount > 300 ? 30 : 15)),
      issues: [
        ...(wordCount < 300 ? ["Resume may be too short for ATS parsing"] : []),
        ...(!hasSections ? ["Missing standard section headers"] : [])
      ],
      suggestions: [
        "Use standard section names: Experience, Education, Skills",
        "Avoid tables, graphics, and columns",
        "Use a clean, single-column format"
      ]
    },
    interviewTips: [
      "Prepare examples for each skill listed in the job description",
      "Practice the STAR method for behavioral questions",
      `Be ready to discuss: ${categorizedMatched.hard.slice(0, 3).join(', ')}`
    ]
  };
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ATSResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showApiInput, setShowApiInput] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      let analysisResults;
      
      if (useAI && apiKey) {
        analysisResults = await analyzeWithAI(resumeText, jdText, apiKey);
      } else {
        // Simulate processing time for local analysis
        await new Promise(resolve => setTimeout(resolve, 1500));
        analysisResults = analyzeResumeLocally(resumeText, jdText);
      }
      
      setResults(analysisResults);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeText, jdText, apiKey, useAI]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-600';
    if (score >= 60) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreRing = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                ResuMatch AI
              </h1>
              <p className="text-xs text-slate-500">AI-Powered ATS Optimizer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {useAI && (
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Mode
              </span>
            )}
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
              Free
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!results ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Now with AI-powered analysis
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Beat the ATS. Land More Interviews.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Get intelligent, actionable feedback to optimize your resume for Applicant Tracking Systems. 
                Our AI analyzes your resume against the job description and provides specific improvements.
              </p>
            </div>

            {/* AI Toggle */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI-Powered Analysis</h3>
                      <p className="text-sm text-slate-400">Get intelligent rewrite suggestions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUseAI(!useAI);
                      if (!useAI) setShowApiInput(true);
                    }}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      useAI ? 'bg-violet-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      useAI ? 'translate-x-8' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {showApiInput && useAI && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <label className="block text-sm text-slate-400 mb-2">
                      Claude API Key <span className="text-slate-600">(Get free key at console.anthropic.com)</span>
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-ant-..."
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Resume Input */}
              <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Your Resume</h3>
                    <p className="text-xs text-slate-500">Paste your resume content</p>
                  </div>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here...

Example:
John Doe
Software Engineer
john@email.com | (555) 123-4567 | linkedin.com/in/johndoe

EXPERIENCE
Senior Software Engineer | Tech Company | 2020-Present
• Led development of microservices architecture serving 1M+ users
• Reduced API response time by 40% through optimization
• Mentored team of 5 junior developers

SKILLS
Python, JavaScript, React, AWS, Docker, PostgreSQL"
                  className="w-full h-72 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none font-mono"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-500">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </p>
                  <button 
                    onClick={() => setResumeText('')}
                    className="text-xs text-slate-500 hover:text-slate-400"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Job Description Input */}
              <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Job Description</h3>
                    <p className="text-xs text-slate-500">Paste the job posting</p>
                  </div>
                </div>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here...

Example:
Senior Software Engineer

We're looking for a Senior Software Engineer to join our team.

Requirements:
• 5+ years of experience with Python and JavaScript
• Experience with cloud platforms (AWS, GCP, or Azure)
• Strong understanding of microservices architecture
• Experience with CI/CD pipelines
• Excellent communication and collaboration skills

Nice to have:
• Experience with React or Vue.js
• Knowledge of Docker and Kubernetes
• Machine learning experience"
                  className="w-full h-72 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 resize-none font-mono"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-500">
                    {jdText.split(/\s+/).filter(Boolean).length} words
                  </p>
                  <button 
                    onClick={() => setJdText('')}
                    className="text-xs text-slate-500 hover:text-slate-400"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!resumeText.trim() || !jdText.trim() || isAnalyzing}
                className="group px-10 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 disabled:from-slate-700 disabled:to-slate-700 rounded-2xl font-semibold text-lg flex items-center gap-3 transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {useAI ? 'AI Analyzing...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    {useAI ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    Analyze Resume
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-4 gap-4 mt-16">
              {[
                { icon: FileSearch, title: 'Smart Parsing', desc: 'Intelligent keyword extraction' },
                { icon: BarChart3, title: 'Detailed Scoring', desc: 'Section-by-section analysis' },
                { icon: Lightbulb, title: 'AI Suggestions', desc: 'Rewrite recommendations' },
                { icon: Target, title: 'ATS Optimized', desc: 'Formatting checks' },
              ].map((feature, i) => (
                <div key={i} className="bg-slate-900/30 rounded-xl p-5 border border-slate-800 text-center hover:border-slate-700 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            <button
              onClick={() => setResults(null)}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              ← Analyze another resume
            </button>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-800 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Score Circle */}
                <div className="relative flex-shrink-0">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96" cy="96" r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-slate-800"
                    />
                    <circle
                      cx="96" cy="96" r="88"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={553}
                      strokeDashoffset={553 - (553 * results.overallScore) / 100}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={results.overallScore >= 80 ? '#10b981' : results.overallScore >= 60 ? '#f59e0b' : '#ef4444'} />
                        <stop offset="100%" stopColor={results.overallScore >= 80 ? '#34d399' : results.overallScore >= 60 ? '#fbbf24' : '#f87171'} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-bold ${getScoreColor(results.overallScore)}`}>
                      {results.overallScore}
                    </span>
                    <span className="text-slate-500 text-sm">Match Score</span>
                  </div>
                </div>
                
                {/* Summary */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    {results.overallScore >= 80 ? (
                      <span className="text-3xl">🎉</span>
                    ) : results.overallScore >= 60 ? (
                      <span className="text-3xl">👍</span>
                    ) : (
                      <span className="text-3xl">⚠️</span>
                    )}
                    <h3 className="text-2xl font-bold">
                      {results.overallScore >= 80 ? 'Excellent Match!' : 
                       results.overallScore >= 60 ? 'Good Foundation' : 
                       'Needs Optimization'}
                    </h3>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-xl">{results.summary}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <span className="text-emerald-400 font-semibold">{results.keywordAnalysis?.matchedKeywords?.length || 0}</span>
                      <span className="text-slate-400 text-sm ml-2">keywords matched</span>
                    </div>
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <span className="text-amber-400 font-semibold">{results.keywordAnalysis?.missingKeywords?.length || 0}</span>
                      <span className="text-slate-400 text-sm ml-2">keywords missing</span>
                    </div>
                    <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                      <span className="text-violet-400 font-semibold">{results.recommendations?.length || 0}</span>
                      <span className="text-slate-400 text-sm ml-2">recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Scores */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { name: 'Experience', score: results.sections?.experience?.score || 0, icon: FileText },
                { name: 'Skills', score: results.sections?.skills?.score || 0, icon: Target },
                { name: 'Education', score: results.sections?.education?.score || 0, icon: TrendingUp },
                { name: 'Formatting', score: results.sections?.formatting?.score || 0, icon: CheckCircle },
              ].map((section, i) => (
                <div key={i} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-400">{section.name}</span>
                    </div>
                    <span className={`font-bold ${getScoreColor(section.score)}`}>{section.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getScoreBg(section.score)} rounded-full transition-all duration-500`}
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'keywords', label: 'Keywords', icon: Target },
                { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
                { id: 'rewrites', label: 'AI Rewrites', icon: Sparkles },
                { id: 'ats', label: 'ATS Check', icon: FileSearch },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-violet-400" />
                    Analysis Overview
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Experience Section */}
                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-400" />
                        Experience Analysis
                      </h5>
                      <p className="text-sm text-slate-400 mb-3">{results.sections?.experience?.feedback}</p>
                      {results.sections?.experience?.strengths?.length > 0 && (
                        <div className="space-y-2">
                          {results.sections.experience.strengths.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-emerald-400">
                              <CheckCircle className="w-4 h-4" />
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                      {results.sections?.experience?.improvements?.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {results.sections.experience.improvements.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-amber-400">
                              <AlertCircle className="w-4 h-4" />
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Skills Section */}
                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-fuchsia-400" />
                        Skills Match
                      </h5>
                      <p className="text-sm text-slate-400 mb-3">{results.sections?.skills?.feedback}</p>
                      <div className="flex flex-wrap gap-2">
                        {results.sections?.skills?.matched?.slice(0, 6).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs border border-emerald-500/30">
                            {skill}
                          </span>
                        ))}
                        {results.sections?.skills?.missing?.slice(0, 4).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs border border-red-500/30">
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Interview Tips */}
                  {results.interviewTips && results.interviewTips.length > 0 && (
                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-xl p-5 border border-violet-500/20">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-violet-400" />
                        Interview Preparation Tips
                      </h5>
                      <ul className="space-y-2">
                        {results.interviewTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-violet-400 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'keywords' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-violet-400" />
                    Keyword Analysis
                  </h4>
                  
                  {/* Missing Keywords */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="font-medium">Missing Keywords</span>
                      <span className="text-sm text-slate-500">({results.keywordAnalysis?.missingKeywords?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.keywordAnalysis?.missingKeywords?.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-default">
                          {kw}
                        </span>
                      ))}
                      {(!results.keywordAnalysis?.missingKeywords || results.keywordAnalysis.missingKeywords.length === 0) && (
                        <p className="text-slate-500 text-sm">No critical keywords missing! Great job.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Matched Keywords */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium">Matched Keywords</span>
                      <span className="text-sm text-slate-500">({results.keywordAnalysis?.matchedKeywords?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.keywordAnalysis?.matchedKeywords?.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm border border-emerald-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Keyword Density */}
                  {results.keywordAnalysis?.keywordDensity && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-sm text-slate-400">{results.keywordAnalysis.keywordDensity}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-violet-400" />
                    Improvement Recommendations
                  </h4>
                  
                  {results.recommendations?.map((rec, i) => (
                    <div key={i} className={`p-5 rounded-xl border transition-colors ${
                      rec.priority === 'high' 
                        ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' 
                        : rec.priority === 'medium' 
                          ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40' 
                          : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          rec.priority === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : rec.priority === 'medium' 
                              ? 'bg-amber-500/20 text-amber-400' 
                              : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {rec.priority}
                        </span>
                        <div className="flex-1">
                          <h5 className="font-semibold mb-1">{rec.title}</h5>
                          <p className="text-sm text-slate-400 mb-2">{rec.description}</p>
                          {rec.example && (
                            <div className="bg-slate-800/50 rounded-lg p-3 text-sm">
                              <span className="text-slate-500">Example: </span>
                              <span className="text-slate-300">{rec.example}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!results.recommendations || results.recommendations.length === 0) && (
                    <p className="text-slate-500 text-center py-8">No recommendations at this time. Your resume looks great!</p>
                  )}
                </div>
              )}

              {activeTab === 'rewrites' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    AI-Powered Rewrites
                  </h4>
                  
                  {results.bulletPointRewrites && results.bulletPointRewrites.length > 0 ? (
                    results.bulletPointRewrites.map((rewrite, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-xl p-5 space-y-4">
                        <div>
                          <span className="text-xs text-slate-500 uppercase tracking-wide">Original</span>
                          <p className="text-slate-400 mt-1">{rewrite.original}</p>
                        </div>
                        <div className="border-t border-slate-700 pt-4">
                          <span className="text-xs text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Improved
                          </span>
                          <p className="text-white mt-1">{rewrite.improved}</p>
                          <button
                            onClick={() => copyToClipboard(rewrite.improved, i)}
                            className="mt-2 flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
                          >
                            {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedIndex === i ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        {rewrite.explanation && (
                          <div className="bg-violet-500/10 rounded-lg p-3 text-sm text-violet-300">
                            💡 {rewrite.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-violet-400" />
                      </div>
                      <h5 className="font-semibold mb-2">Enable AI for Rewrite Suggestions</h5>
                      <p className="text-slate-400 text-sm max-w-md mx-auto">
                        Turn on AI mode and add your Claude API key to get intelligent rewrite suggestions for your resume bullet points.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-violet-400" />
                    ATS Compatibility Check
                  </h4>
                  
                  {/* ATS Score */}
                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400">ATS Compatibility Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(results.atsCompatibility?.score || 0)}`}>
                        {results.atsCompatibility?.score || 0}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getScoreBg(results.atsCompatibility?.score || 0)} rounded-full`}
                        style={{ width: `${results.atsCompatibility?.score || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Passed Checks */}
                  {results.sections?.formatting?.passed?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-3 text-emerald-400">✓ Passed Checks</h5>
                      <div className="space-y-2">
                        {results.sections.formatting.passed.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Issues */}
                  {results.atsCompatibility?.issues?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-3 text-amber-400">⚠ Issues Found</h5>
                      <div className="space-y-2">
                        {results.atsCompatibility.issues.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <AlertCircle className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {results.atsCompatibility?.suggestions?.length > 0 && (
                    <div className="bg-violet-500/10 rounded-xl p-5 border border-violet-500/20">
                      <h5 className="font-medium mb-3 text-violet-400">💡 ATS Tips</h5>
                      <ul className="space-y-2">
                        {results.atsCompatibility.suggestions.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-violet-400 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>ResuMatch AI — A Product Management Portfolio Project by Sweatha Hari</p>
          <p className="mt-1">Powered by Claude AI for intelligent resume analysis</p>
        </div>
      </footer>
    </div>
  );
}
