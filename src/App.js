import React, { useState, useCallback } from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle, Zap, Target, TrendingUp, Sparkles, RefreshCw, Copy, Check, Brain, BarChart3, FileSearch, Lightbulb, ArrowRight, Cpu } from 'lucide-react';

// ============================================
// SYNONYM DICTIONARY FOR IMPROVED MATCHING
// ============================================

const synonyms = {
  // Programming Languages
  'javascript': ['js', 'es6', 'es2015', 'ecmascript', 'node.js', 'nodejs', 'node'],
  'typescript': ['ts'],
  'python': ['py', 'python3', 'python2'],
  'golang': ['go', 'go lang'],
  'csharp': ['c#', 'c-sharp', 'dotnet', '.net', 'dot net'],
  'cplusplus': ['c++', 'cpp'],
  
  // Frameworks & Libraries
  'react': ['reactjs', 'react.js', 'react native', 'reactnative'],
  'angular': ['angularjs', 'angular.js', 'angular2', 'angular4'],
  'vue': ['vuejs', 'vue.js', 'vue3'],
  'nextjs': ['next.js', 'next'],
  'express': ['expressjs', 'express.js'],
  'django': ['python django'],
  'flask': ['python flask'],
  'spring': ['spring boot', 'springboot'],
  
  // Cloud & DevOps
  'aws': ['amazon web services', 'amazon cloud', 'ec2', 's3', 'lambda', 'amazon'],
  'gcp': ['google cloud', 'google cloud platform', 'gce'],
  'azure': ['microsoft azure', 'ms azure'],
  'kubernetes': ['k8s', 'kube'],
  'docker': ['containerization', 'containers', 'dockerfile'],
  'cicd': ['ci/cd', 'ci-cd', 'continuous integration', 'continuous deployment', 'jenkins', 'gitlab ci', 'github actions'],
  'terraform': ['infrastructure as code', 'iac'],
  
  // Databases
  'postgresql': ['postgres', 'psql', 'postgre'],
  'mongodb': ['mongo', 'nosql'],
  'mysql': ['my sql', 'mariadb'],
  'elasticsearch': ['elastic', 'elk', 'elastic search'],
  'dynamodb': ['dynamo', 'dynamo db'],
  'redis': ['caching', 'in-memory'],
  
  // Data & ML
  'machinelearning': ['machine learning', 'ml', 'deep learning', 'dl', 'ai', 'artificial intelligence'],
  'datascience': ['data science', 'data scientist', 'data analytics', 'analytics'],
  'dataengineering': ['data engineering', 'data engineer', 'etl', 'data pipeline', 'data pipelines'],
  'nlp': ['natural language processing', 'natural language', 'text processing'],
  'computervision': ['computer vision', 'image processing', 'cv'],
  
  // Methodologies
  'agile': ['scrum', 'kanban', 'sprint', 'sprints', 'agile methodology'],
  'devops': ['dev ops', 'sre', 'site reliability', 'platform engineering'],
  'productmanagement': ['product management', 'product manager', 'pm', 'product owner', 'po'],
  'projectmanagement': ['project management', 'project manager', 'pmp'],
  
  // Soft Skills - Action verbs and their variations
  'leadership': ['led', 'leading', 'leader', 'manage', 'managed', 'managing', 'oversaw', 'supervised', 'directed', 'head', 'headed', 'spearheaded'],
  'communication': ['communicate', 'communicated', 'communicating', 'verbal', 'written', 'presentation', 'presenting', 'presented'],
  'collaboration': ['collaborate', 'collaborated', 'collaborating', 'team player', 'teamwork', 'cross-functional', 'cross functional', 'partnered', 'partnering'],
  'problemsolving': ['problem solving', 'problem-solving', 'troubleshoot', 'troubleshooting', 'debug', 'debugging', 'resolved', 'resolving', 'solving'],
  'analytical': ['analysis', 'analyze', 'analyzed', 'analyzing', 'analytics', 'analytical skills', 'data-driven', 'data driven'],
  'strategic': ['strategy', 'strategic thinking', 'strategize', 'strategic planning'],
  
  // Common role terms
  'fullstack': ['full stack', 'full-stack', 'frontend and backend', 'front and back end'],
  'frontend': ['front end', 'front-end', 'ui', 'user interface', 'client side', 'client-side'],
  'backend': ['back end', 'back-end', 'server side', 'server-side', 'api development'],
  'senior': ['sr', 'sr.', 'lead', 'principal', 'staff'],
  'junior': ['jr', 'jr.', 'entry level', 'entry-level', 'associate'],
  
  // Tools
  'jira': ['atlassian', 'confluence', 'trello'],
  'figma': ['sketch', 'adobe xd', 'invision', 'ui design'],
  'git': ['github', 'gitlab', 'bitbucket', 'version control', 'source control'],
  'tableau': ['power bi', 'looker', 'data visualization', 'dashboards'],
  'excel': ['spreadsheets', 'google sheets', 'sheets'],
  
  // API & Integration
  'api': ['apis', 'rest', 'restful', 'rest api', 'graphql', 'endpoint', 'endpoints', 'web services', 'microservices'],
  'testing': ['test', 'tests', 'qa', 'quality assurance', 'unit testing', 'integration testing', 'e2e', 'end to end', 'automated testing', 'test automation']
};

// Build reverse lookup map
const buildSynonymMap = () => {
  const map = new Map();
  for (const [canonical, variations] of Object.entries(synonyms)) {
    map.set(canonical.toLowerCase(), canonical);
    for (const variation of variations) {
      map.set(variation.toLowerCase(), canonical);
    }
  }
  return map;
};

const synonymMap = buildSynonymMap();

// ============================================
// IMPROVED LOCAL ANALYSIS FUNCTIONS
// ============================================

// Normalize keyword to canonical form
const normalizeKeyword = (keyword) => {
  const lower = keyword.toLowerCase().trim();
  return synonymMap.get(lower) || lower;
};

// Simple stemming
const stem = (word) => {
  let result = word.toLowerCase();
  const suffixes = ['ization', 'isation', 'ational', 'fulness', 'ousness', 'iveness', 'ement', 'ment', 'ence', 'ance', 'able', 'ible', 'ness', 'less', 'tion', 'sion', 'ally', 'ful', 'ous', 'ive', 'ing', 'ied', 'ies', 'ed', 'er', 'es', 'ly', 's'];
  for (const suffix of suffixes) {
    if (result.endsWith(suffix) && result.length > suffix.length + 2) {
      result = result.slice(0, -suffix.length);
      break;
    }
  }
  return result;
};

// Extract multi-word phrases
const extractPhrases = (text) => {
  const phrases = [];
  const importantPhrases = [
    'machine learning', 'deep learning', 'artificial intelligence', 'data science', 
    'data engineering', 'data analysis', 'data analytics', 'product management', 
    'project management', 'program management', 'user experience', 'user interface', 
    'user research', 'full stack', 'front end', 'back end', 'cloud computing', 
    'distributed systems', 'microservices', 'agile methodology', 'scrum master', 
    'product owner', 'continuous integration', 'continuous deployment', 
    'test driven development', 'object oriented', 'functional programming',
    'cross functional', 'stakeholder management', 'a/b testing', 'ab testing',
    'natural language processing', 'computer vision', 'sprint planning', 
    'product roadmap', 'go to market', 'business intelligence', 'business analysis',
    'customer success', 'customer experience', 'supply chain', 'financial analysis',
    'react native', 'node.js', 'next.js', 'vue.js', 'amazon web services', 
    'google cloud', 'microsoft azure', 'sql server', 'power bi', 'google analytics',
    'version control', 'code review', 'pull request', 'unit testing', 
    'integration testing', 'end to end', 'rest api', 'graphql api', 'api development',
    'software development', 'web development', 'mobile development', 'app development'
  ];
  
  const lowerText = text.toLowerCase();
  for (const phrase of importantPhrases) {
    if (lowerText.includes(phrase)) {
      phrases.push(phrase);
    }
  }
  return phrases;
};

// Main keyword extraction
const extractKeywords = (text) => {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
    'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 
    'must', 'shall', 'can', 'need', 'this', 'that', 'these', 'those', 'i', 'you', 
    'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 
    'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 
    'if', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 
    'between', 'under', 'again', 'while', 'about', 'against', 'your', 'our', 
    'their', 'its', 'my', 'his', 'her', 'up', 'down', 'out', 'off', 'over', 'any',
    'well', 'work', 'working', 'experience', 'year', 'years', 'ability', 'strong',
    'excellent', 'proven', 'demonstrated', 'responsible', 'responsibilities',
    'including', 'using', 'used', 'new', 'first', 'one', 'two', 'three', 'based',
    'across', 'within', 'along', 'among', 'around', 'looking', 'seeking', 'required',
    'requirements', 'qualifications', 'preferred', 'plus', 'bonus', 'nice', 'ideal',
    'minimum', 'etc', 'role', 'position', 'job', 'company', 'team', 'teams'
  ]);
  
  const phrases = extractPhrases(text);
  
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s\+\#\.]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  const normalizedWords = new Set();
  
  for (const word of words) {
    const normalized = normalizeKeyword(word);
    normalizedWords.add(normalized);
  }
  
  for (const phrase of phrases) {
    const normalized = normalizeKeyword(phrase);
    normalizedWords.add(normalized);
  }
  
  return Array.from(normalizedWords);
};

// Categorize skill type
const categorizeSkill = (keyword) => {
  const hardSkillPatterns = [
    /python|java|javascript|typescript|golang|ruby|php|swift|kotlin|scala|rust|c\+\+|csharp/i,
    /react|angular|vue|django|flask|spring|express|next|rails|laravel/i,
    /sql|postgres|mysql|mongodb|redis|elasticsearch|dynamodb|cassandra|oracle/i,
    /aws|azure|gcp|cloud|kubernetes|docker|terraform|ansible|jenkins/i,
    /git|jira|confluence|figma|sketch|tableau|powerbi|excel/i,
    /pandas|numpy|spark|hadoop|kafka|airflow|dbt|snowflake|databricks/i,
    /tensorflow|pytorch|keras|scikit|machinelearning|datascience|nlp|computervision/i,
    /api|rest|graphql|microservices|cicd|devops|agile|scrum|kanban/i,
    /html|css|sass|webpack|npm|yarn|testing|selenium|cypress/i,
    /linux|unix|bash|powershell|networking|security|encryption/i,
    /fullstack|frontend|backend|dataengineering|productmanagement/i
  ];
  
  const softSkillPatterns = [
    /leadership|communication|collaboration|teamwork|problemsolving/i,
    /analytical|creative|strategic|innovative|adaptable|flexible/i,
    /organized|detail|motivated|proactive|reliable|dependable/i,
    /interpersonal|negotiation|presentation|mentoring|coaching/i,
    /decision|time.management|prioritization|critical|thinking/i,
    /customer|results|goal|stakeholder|influence|persuasion|empathy/i
  ];
  
  const keywordLower = keyword.toLowerCase();
  
  for (const pattern of hardSkillPatterns) {
    if (pattern.test(keywordLower)) return 'hard';
  }
  
  for (const pattern of softSkillPatterns) {
    if (pattern.test(keywordLower)) return 'soft';
  }
  
  return 'general';
};

// Match keywords with improved logic
const matchKeywords = (resumeKeywords, jdKeywords) => {
  const matched = [];
  const missing = [];
  
  const resumeSet = new Set(resumeKeywords.map(k => normalizeKeyword(k)));
  const resumeStemmed = new Set(resumeKeywords.map(k => stem(normalizeKeyword(k))));
  
  for (const jdKeyword of jdKeywords) {
    const normalizedJD = normalizeKeyword(jdKeyword);
    const stemmedJD = stem(normalizedJD);
    
    // Exact match after normalization
    if (resumeSet.has(normalizedJD)) {
      matched.push({ keyword: jdKeyword, matchType: 'exact' });
      continue;
    }
    
    // Stemmed match
    if (resumeStemmed.has(stemmedJD)) {
      matched.push({ keyword: jdKeyword, matchType: 'stemmed' });
      continue;
    }
    
    // Partial/contains match
    let found = false;
    for (const resumeKeyword of resumeSet) {
      if (resumeKeyword.includes(normalizedJD) || normalizedJD.includes(resumeKeyword)) {
        matched.push({ keyword: jdKeyword, matchType: 'partial' });
        found = true;
        break;
      }
    }
    
    if (!found) {
      missing.push(jdKeyword);
    }
  }
  
  return { matched, missing };
};

// ============================================
// LOCAL ANALYSIS (Improved)
// ============================================

const analyzeResumeLocally = (resumeText, jdText) => {
  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jdText);
  
  const { matched, missing } = matchKeywords(resumeKeywords, jdKeywords);
  const matchedKeywords = matched.map(m => m.keyword);
  
  // Categorize
  const matchedHard = matchedKeywords.filter(k => categorizeSkill(k) === 'hard');
  const matchedSoft = matchedKeywords.filter(k => categorizeSkill(k) === 'soft');
  const missingHard = missing.filter(k => categorizeSkill(k) === 'hard');
  const missingSoft = missing.filter(k => categorizeSkill(k) === 'soft');
  
  const jdHard = jdKeywords.filter(k => categorizeSkill(k) === 'hard');
  const jdSoft = jdKeywords.filter(k => categorizeSkill(k) === 'soft');
  
  // Calculate scores
  const hardScore = jdHard.length > 0 ? (matchedHard.length / jdHard.length) * 100 : 100;
  const softScore = jdSoft.length > 0 ? (matchedSoft.length / jdSoft.length) * 100 : 100;
  const generalScore = jdKeywords.length > 0 ? (matchedKeywords.length / jdKeywords.length) * 100 : 0;
  
  const overallScore = Math.min(100, Math.round(
    (hardScore * 0.6) + (softScore * 0.25) + (generalScore * 0.15)
  ));

  // Format checks
  const hasEmail = /\b[\w.-]+@[\w.-]+\.\w+\b/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin/i.test(resumeText);
  const hasNumbers = /\d+%|\$[\d,]+|\d+\+|\d+ (years?|months?|projects?|teams?|clients?|customers?|members?)/i.test(resumeText);
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'increased', 'reduced', 'improved', 'designed', 'launched', 'built', 'achieved', 'delivered', 'drove', 'executed', 'established', 'generated', 'grew', 'initiated', 'optimized', 'spearheaded', 'streamlined', 'transformed', 'orchestrated', 'pioneered'];
  const hasActionVerbs = actionVerbs.some(verb => resumeText.toLowerCase().includes(verb));
  const wordCount = resumeText.split(/\s+/).length;
  const hasSections = /experience|education|skills|summary|objective|projects?|certifications?/i.test(resumeText);

  // Generate recommendations
  const recommendations = [];
  
  if (missingHard.length > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Add Missing Technical Skills',
      description: `Include these skills if you have them: ${missingHard.slice(0, 5).join(', ')}`,
      example: 'Add to your Skills section or demonstrate in Experience bullet points'
    });
  }

  if (!hasNumbers) {
    recommendations.push({
      priority: 'high',
      title: 'Quantify Your Achievements',
      description: 'Add numbers, percentages, and metrics to demonstrate impact.',
      example: 'Instead of "Improved performance", write "Improved performance by 40%"'
    });
  }

  if (!hasActionVerbs) {
    recommendations.push({
      priority: 'medium',
      title: 'Use Strong Action Verbs',
      description: 'Start bullet points with powerful action verbs.',
      example: 'Led, Developed, Implemented, Achieved, Optimized, Spearheaded'
    });
  }
  
  if (missingSoft.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Demonstrate Soft Skills',
      description: `Show these qualities: ${missingSoft.slice(0, 3).join(', ')}`,
      example: 'Instead of listing "leadership", write "Led team of 5 to deliver project early"'
    });
  }

  if (wordCount < 300) {
    recommendations.push({
      priority: 'medium',
      title: 'Add More Detail',
      description: 'Your resume may be too short. Aim for 400-600 words.',
      example: 'Add 2-3 bullet points per role with specific accomplishments'
    });
  }

  if (overallScore >= 70) {
    recommendations.push({
      priority: 'low',
      title: 'Mirror Job Description Language',
      description: 'Use exact phrases from the JD where applicable.',
      example: 'If JD says "cross-functional collaboration", use that exact phrase'
    });
  }

  return {
    overallScore,
    summary: overallScore >= 80 
      ? "Excellent match! Your resume aligns well with this job description."
      : overallScore >= 60 
        ? "Good foundation. Some targeted improvements can boost your score."
        : "Your resume needs optimization. Focus on adding missing keywords.",
    sections: {
      experience: {
        score: Math.round(hardScore * 0.8 + (hasNumbers ? 20 : 0)),
        feedback: hasNumbers ? "Good use of metrics." : "Add quantified achievements.",
        strengths: hasActionVerbs ? ["Uses action verbs", "Clear structure"] : ["Clear structure"],
        improvements: hasNumbers ? [] : ["Add numbers and percentages"]
      },
      skills: {
        score: Math.round(hardScore),
        matched: [...new Set(matchedHard)].slice(0, 12),
        missing: [...new Set(missingHard)].slice(0, 12),
        feedback: missingHard.length > 5 ? "Missing key technical skills" : "Good skill coverage"
      },
      education: {
        score: 80,
        feedback: "Education section present"
      },
      formatting: {
        score: (hasEmail ? 25 : 0) + (hasPhone ? 25 : 0) + (hasLinkedIn ? 25 : 0) + (hasSections ? 25 : 0),
        issues: [
          ...(!hasEmail ? ["No email address"] : []),
          ...(!hasPhone ? ["No phone number"] : []),
          ...(!hasLinkedIn ? ["Consider adding LinkedIn"] : []),
          ...(!hasSections ? ["Add section headers"] : [])
        ],
        passed: [
          ...(hasEmail ? ["Email detected"] : []),
          ...(hasPhone ? ["Phone detected"] : []),
          ...(hasLinkedIn ? ["LinkedIn included"] : []),
          ...(hasSections ? ["Sections present"] : [])
        ]
      }
    },
    keywordAnalysis: {
      matchedKeywords: [...new Set(matchedKeywords)].slice(0, 20),
      missingKeywords: [...new Set(missing)].slice(0, 15),
      keywordDensity: matchedKeywords.length > jdKeywords.length * 0.6 
        ? "Good keyword coverage" 
        : "Consider adding more relevant keywords",
      matchDetails: matched.slice(0, 10) // Show match types
    },
    recommendations,
    bulletPointRewrites: [], // AI will fill this
    atsCompatibility: {
      score: Math.round((hasEmail ? 20 : 0) + (hasPhone ? 20 : 0) + (hasSections ? 30 : 0) + (wordCount > 300 ? 30 : 15)),
      issues: [
        ...(wordCount < 300 ? ["Resume may be too short"] : []),
        ...(!hasSections ? ["Missing section headers"] : [])
      ],
      suggestions: [
        "Use standard sections: Experience, Education, Skills",
        "Avoid tables, graphics, and columns",
        "Use clean, single-column format"
      ]
    },
    interviewTips: [
      "Prepare STAR examples for each listed skill",
      `Be ready to discuss: ${matchedHard.slice(0, 3).join(', ')}`,
      "Research the company's tech stack and culture"
    ],
    // Metadata for AI enhancement
    _meta: {
      resumeKeywordCount: resumeKeywords.length,
      jdKeywordCount: jdKeywords.length,
      matchCount: matchedKeywords.length,
      missingCount: missing.length,
      analysisType: 'local'
    }
  };
};

// ============================================
// AI ENHANCEMENT (Hybrid)
// ============================================

const enhanceWithAI = async (localResults, resumeText, jdText) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText,
        jdText,
        localResults // Send local results for AI to enhance
      })
    });

    const aiResults = await response.json();
    
    if (aiResults.error) {
      console.log('AI enhancement failed, using local results');
      return localResults;
    }
    
    // Merge AI insights with local results
    return {
      ...localResults,
      // Use AI score if available, otherwise keep local
      overallScore: aiResults.overallScore || localResults.overallScore,
      summary: aiResults.summary || localResults.summary,
      
      // Enhance sections with AI feedback
      sections: {
        ...localResults.sections,
        experience: {
          ...localResults.sections.experience,
          feedback: aiResults.sections?.experience?.feedback || localResults.sections.experience.feedback,
          strengths: aiResults.sections?.experience?.strengths || localResults.sections.experience.strengths,
          improvements: aiResults.sections?.experience?.improvements || localResults.sections.experience.improvements
        },
        skills: {
          ...localResults.sections.skills,
          // Combine local and AI keyword analysis
          matched: [...new Set([...localResults.sections.skills.matched, ...(aiResults.sections?.skills?.matched || [])])].slice(0, 15),
          missing: [...new Set([...localResults.sections.skills.missing, ...(aiResults.sections?.skills?.missing || [])])].slice(0, 15),
          feedback: aiResults.sections?.skills?.feedback || localResults.sections.skills.feedback
        }
      },
      
      // AI provides better recommendations
      recommendations: aiResults.recommendations || localResults.recommendations,
      
      // AI provides rewrites (local can't do this)
      bulletPointRewrites: aiResults.bulletPointRewrites || [],
      
      // Enhanced interview tips from AI
      interviewTips: aiResults.interviewTips || localResults.interviewTips,
      
      // Mark as hybrid
      _meta: {
        ...localResults._meta,
        analysisType: 'hybrid',
        aiEnhanced: true
      }
    };
  } catch (error) {
    console.error('AI enhancement error:', error);
    return localResults;
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ATSResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    
    setIsAnalyzing(true);
    setError('');
    setAnalysisStage('Extracting keywords...');
    
    try {
      // STEP 1: Fast local analysis (instant)
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for UX
      setAnalysisStage('Matching skills...');
      
      const localResults = analyzeResumeLocally(resumeText, jdText);
      
      // Show local results immediately
      setResults(localResults);
      setAnalysisStage('Enhancing with AI...');
      
      // STEP 2: AI enhancement (background)
      const enhancedResults = await enhanceWithAI(localResults, resumeText, jdText);
      
      // Update with AI-enhanced results
      setResults(enhancedResults);
      setActiveTab('overview');
      
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  }, [resumeText, jdText]);

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
              <p className="text-xs text-slate-500">Hybrid ATS Optimizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Local
            </span>
            <span className="text-slate-600">+</span>
            <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!results ? (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-6">
                <Cpu className="w-4 h-4" />
                <span>Instant Local Analysis</span>
                <span className="text-slate-600">+</span>
                <Sparkles className="w-4 h-4" />
                <span>AI Enhancement</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Beat the ATS. Land More Interviews.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Our hybrid approach gives you instant results with smart synonym matching, 
                then enhances with AI for deeper insights and rewrite suggestions.
              </p>
            </div>

            {/* How It Works */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h3 className="font-semibold mb-4 text-center">How Hybrid Analysis Works</h3>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="font-medium text-blue-400">Step 1: Local</div>
                    <div className="text-xs text-slate-500 mt-1">Instant • Synonyms • Stemming</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-600 flex-shrink-0" />
                  <div className="flex-1 text-center p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
                    <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                    <div className="font-medium text-violet-400">Step 2: AI</div>
                    <div className="text-xs text-slate-500 mt-1">Semantic • Rewrites • Tips</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-600 flex-shrink-0" />
                  <div className="flex-1 text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <div className="font-medium text-emerald-400">Result</div>
                    <div className="text-xs text-slate-500 mt-1">Best of Both</div>
                  </div>
                </div>
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
John Doe | Software Engineer
john@email.com | linkedin.com/in/johndoe

EXPERIENCE
Senior Software Engineer | Tech Company | 2020-Present
• Led development of microservices serving 1M+ users
• Reduced API response time by 40% through optimization
• Managed team of 5 developers using Agile/Scrum

SKILLS
JavaScript, TypeScript, React, Node.js, AWS, Docker, K8s"
                  className="w-full h-72 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none font-mono"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-500">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </p>
                  <button onClick={() => setResumeText('')} className="text-xs text-slate-500 hover:text-slate-400">
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

Requirements:
• 5+ years experience with JavaScript/TypeScript
• Strong experience with React or Angular
• Knowledge of AWS, GCP, or Azure
• Experience with Kubernetes and Docker
• Understanding of CI/CD pipelines
• Excellent leadership and communication skills
• Experience with microservices architecture"
                  className="w-full h-72 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 resize-none font-mono"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-500">
                    {jdText.split(/\s+/).filter(Boolean).length} words
                  </p>
                  <button onClick={() => setJdText('')} className="text-xs text-slate-500 hover:text-slate-400">
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
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
                className="group px-10 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 disabled:from-slate-700 disabled:to-slate-700 rounded-2xl font-semibold text-lg flex items-center gap-3 transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-violet-500/25"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {analysisStage}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Resume
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-4 gap-4 mt-16">
              {[
                { icon: Cpu, title: 'Smart Synonyms', desc: '"JS" matches "JavaScript"', color: 'blue' },
                { icon: BarChart3, title: 'Instant Scoring', desc: 'Results in milliseconds', color: 'violet' },
                { icon: Sparkles, title: 'AI Rewrites', desc: 'Better bullet points', color: 'fuchsia' },
                { icon: Target, title: 'ATS Optimized', desc: 'Beat the robots', color: 'emerald' },
              ].map((feature, i) => (
                <div key={i} className="bg-slate-900/30 rounded-xl p-5 border border-slate-800 text-center hover:border-slate-700 transition-colors">
                  <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setResults(null)}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                ← Analyze another resume
              </button>
              {results._meta?.analysisType && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  results._meta.aiEnhanced 
                    ? 'bg-violet-500/20 text-violet-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {results._meta.aiEnhanced ? (
                    <><Sparkles className="w-3 h-3" /> AI Enhanced</>
                  ) : (
                    <><Cpu className="w-3 h-3" /> Local Analysis</>
                  )}
                </span>
              )}
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-800 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-800" />
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
                    <span className={`text-5xl font-bold ${getScoreColor(results.overallScore)}`}>{results.overallScore}</span>
                    <span className="text-slate-500 text-sm">Match Score</span>
                  </div>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    {results.overallScore >= 80 ? <span className="text-3xl">🎉</span> : results.overallScore >= 60 ? <span className="text-3xl">👍</span> : <span className="text-3xl">⚠️</span>}
                    <h3 className="text-2xl font-bold">
                      {results.overallScore >= 80 ? 'Excellent Match!' : results.overallScore >= 60 ? 'Good Foundation' : 'Needs Optimization'}
                    </h3>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-xl">{results.summary}</p>
                  
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <span className="text-emerald-400 font-semibold">{results.keywordAnalysis?.matchedKeywords?.length || 0}</span>
                      <span className="text-slate-400 text-sm ml-2">matched</span>
                    </div>
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <span className="text-amber-400 font-semibold">{results.keywordAnalysis?.missingKeywords?.length || 0}</span>
                      <span className="text-slate-400 text-sm ml-2">missing</span>
                    </div>
                    <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                      <span className="text-violet-400 font-semibold">{results.recommendations?.length || 0}</span>
                      <span className="text-slate-400 text-sm ml-2">tips</span>
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
                    <div className={`h-full bg-gradient-to-r ${getScoreBg(section.score)} rounded-full transition-all duration-500`} style={{ width: `${section.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'keywords', label: 'Keywords', icon: Target },
                { id: 'recommendations', label: 'Tips', icon: Lightbulb },
                { id: 'rewrites', label: 'AI Rewrites', icon: Sparkles },
                { id: 'ats', label: 'ATS Check', icon: FileSearch },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-400" />
                        Experience
                      </h5>
                      <p className="text-sm text-slate-400 mb-3">{results.sections?.experience?.feedback}</p>
                      {results.sections?.experience?.strengths?.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-emerald-400 mb-1">
                          <CheckCircle className="w-4 h-4" />{s}
                        </div>
                      ))}
                      {results.sections?.experience?.improvements?.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-amber-400 mb-1">
                          <AlertCircle className="w-4 h-4" />{s}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-fuchsia-400" />
                        Skills Match
                      </h5>
                      <p className="text-sm text-slate-400 mb-3">{results.sections?.skills?.feedback}</p>
                      <div className="flex flex-wrap gap-2">
                        {results.sections?.skills?.matched?.slice(0, 6).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs border border-emerald-500/30">{skill}</span>
                        ))}
                        {results.sections?.skills?.missing?.slice(0, 4).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs border border-red-500/30">+ {skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {results.interviewTips?.length > 0 && (
                    <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-xl p-5 border border-violet-500/20">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-violet-400" />
                        Interview Tips
                      </h5>
                      <ul className="space-y-2">
                        {results.interviewTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-violet-400 mt-1">•</span>{tip}
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
                    <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">Synonym-Enhanced</span>
                  </h4>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="font-medium">Missing Keywords</span>
                      <span className="text-sm text-slate-500">({results.keywordAnalysis?.missingKeywords?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.keywordAnalysis?.missingKeywords?.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20">{kw}</span>
                      ))}
                      {(!results.keywordAnalysis?.missingKeywords || results.keywordAnalysis.missingKeywords.length === 0) && (
                        <p className="text-slate-500 text-sm">No critical keywords missing!</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium">Matched Keywords</span>
                      <span className="text-sm text-slate-500">({results.keywordAnalysis?.matchedKeywords?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.keywordAnalysis?.matchedKeywords?.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm border border-emerald-500/20">{kw}</span>
                      ))}
                    </div>
                  </div>
                  
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
                    Recommendations
                  </h4>
                  
                  {results.recommendations?.map((rec, i) => (
                    <div key={i} className={`p-5 rounded-xl border transition-colors ${
                      rec.priority === 'high' ? 'bg-red-500/5 border-red-500/20' : rec.priority === 'medium' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          rec.priority === 'high' ? 'bg-red-500/20 text-red-400' : rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>{rec.priority}</span>
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
                </div>
              )}

              {activeTab === 'rewrites' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    AI-Powered Rewrites
                  </h4>
                  
                  {results.bulletPointRewrites?.length > 0 ? (
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
                      <h5 className="font-semibold mb-2">AI Rewrites Loading...</h5>
                      <p className="text-slate-400 text-sm max-w-md mx-auto">
                        {results._meta?.aiEnhanced 
                          ? "No specific rewrites suggested for this resume." 
                          : "AI is enhancing your results. Rewrites will appear shortly."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-violet-400" />
                    ATS Compatibility
                  </h4>
                  
                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400">ATS Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(results.atsCompatibility?.score || 0)}`}>
                        {results.atsCompatibility?.score || 0}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${getScoreBg(results.atsCompatibility?.score || 0)} rounded-full`} style={{ width: `${results.atsCompatibility?.score || 0}%` }} />
                    </div>
                  </div>
                  
                  {results.sections?.formatting?.passed?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-3 text-emerald-400">✓ Passed</h5>
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
                  
                  {results.atsCompatibility?.issues?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-3 text-amber-400">⚠ Issues</h5>
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
                  
                  {results.atsCompatibility?.suggestions?.length > 0 && (
                    <div className="bg-violet-500/10 rounded-xl p-5 border border-violet-500/20">
                      <h5 className="font-medium mb-3 text-violet-400">💡 Tips</h5>
                      <ul className="space-y-2">
                        {results.atsCompatibility.suggestions.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-violet-400 mt-0.5">•</span>{tip}
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
          <p>ResuMatch AI — Hybrid Analysis (Local + AI)</p>
          <p className="mt-1">A Product Management Portfolio Project by Sweatha Hari</p>
        </div>
      </footer>
    </div>
  );
}
