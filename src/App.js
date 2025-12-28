import React, { useState, useCallback } from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle, Zap, Target, Sparkles, RefreshCw, Copy, Check, Brain, BarChart3, Lightbulb, Cpu, ThumbsUp, ThumbsDown, Edit3, Download, ChevronDown, ChevronUp, AlertTriangle, Award } from 'lucide-react';

// ============================================
// SYNONYM DICTIONARY - Maps variations to canonical form
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
  
  // Soft Skills - Action verbs mapped to skill
  'leadership': ['led', 'leading', 'leader', 'manage', 'managed', 'managing', 'oversaw', 'supervised', 'directed', 'head', 'headed', 'spearheaded'],
  'communication': ['communicate', 'communicated', 'communicating', 'verbal', 'written', 'presentation', 'presenting', 'presented'],
  'collaboration': ['collaborate', 'collaborated', 'collaborating', 'team player', 'teamwork', 'cross-functional', 'cross functional', 'partnered', 'partnering'],
  'problemsolving': ['problem solving', 'problem-solving', 'troubleshoot', 'troubleshooting', 'debug', 'debugging', 'resolved', 'resolving', 'solving'],
  'analytical': ['analysis', 'analyze', 'analyzed', 'analyzing', 'analytics', 'analytical skills', 'data-driven', 'data driven'],
  'strategic': ['strategy', 'strategic thinking', 'strategize', 'strategic planning'],
  
  // Role terms
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
  'testing': ['test', 'tests', 'qa', 'quality assurance', 'unit testing', 'integration testing', 'e2e', 'end to end', 'automated testing', 'test automation'],
  
  // Product Management specific
  'prd': ['product requirements', 'product requirements document', 'requirements document'],
  'roadmap': ['product roadmap', 'roadmapping', 'product planning'],
  'backlog': ['product backlog', 'backlog management', 'backlog grooming', 'backlog refinement'],
  'userstories': ['user stories', 'user story', 'stories'],
  'stakeholder': ['stakeholders', 'stakeholder management', 'stakeholder collaboration'],
  'ux': ['user experience', 'usability', 'user research'],
  'designcollaboration': ['design collaboration', 'work with design', 'collaborate with design', 'design team']
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
// TEXT PROCESSING FUNCTIONS
// ============================================

// Normalize keyword to canonical form
const normalizeKeyword = (keyword) => {
  const lower = keyword.toLowerCase().trim();
  return synonymMap.get(lower) || lower;
};

// Simple stemming - reduce words to root form
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
    'software development', 'web development', 'mobile development', 'app development',
    'product development life cycle', 'pdlc', 'sdlc', 'software development life cycle',
    'backlog management', 'release planning', 'sprint review', 'retrospective',
    'design collaboration', 'ux design', 'ui ux', 'user stories', 'acceptance criteria',
    'customer interviews', 'market research', 'competitive analysis',
    'product requirements', 'requirements documentation', 'technical specifications',
    'hypothesis driven', 'customer driven', 'sales enablement', 'release cadence'
  ];
  
  const lowerText = text.toLowerCase();
  for (const phrase of importantPhrases) {
    if (lowerText.includes(phrase)) {
      phrases.push(phrase);
    }
  }
  return phrases;
};

// ============================================
// NOISE FILTERING - Remove LinkedIn/Job Board UI junk
// ============================================

const cleanText = (text) => {
  // Regex patterns to remove
  const noisePatterns = [
    /reposted\s*\d*\s*(hours?|days?|weeks?|months?)?\s*ago/gi,
    /posted\s*\d*\s*(hours?|days?|weeks?|months?)?\s*ago/gi,
    /\d+\s*(hours?|days?|weeks?|months?)\s*ago/gi,
    /\d+\s*people\s*clicked\s*apply/gi,
    /\d+\s*applicants?/gi,
    /show\s*more/gi,
    /show\s*less/gi,
    /see\s*more/gi,
    /see\s*less/gi,
    /easy\s*apply/gi,
    /apply\s*now/gi,
    /save\s*job/gi,
    /share\s*this\s*job/gi,
    /report\s*this\s*job/gi,
    /promoted/gi,
    /sponsored/gi,
    /logo$/gm,
    /·/g,
    /\|\|/g,
    /www\.\S+/gi,
    /https?:\/\/\S+/gi,
    /back\s*to\s*edit/gi,
    /parsed\s*resume/gi,
    /regenerate/gi,
    /accept\s*at\s*least/gi,
  ];
  
  let cleaned = text;
  for (const pattern of noisePatterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  
  // Remove concatenated junk words (like "logoshareshowoptionsbengaluru")
  // Split camelCase-like concatenations
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  return cleaned;
};

// ============================================
// STOPWORDS - Words to ignore
// ============================================

const stopWords = new Set([
  // Common English
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
  
  // Generic job posting words
  'well', 'work', 'working', 'experience', 'year', 'years', 'ability', 'strong',
  'excellent', 'proven', 'demonstrated', 'responsible', 'responsibilities',
  'including', 'using', 'used', 'new', 'first', 'one', 'two', 'three', 'based',
  'across', 'within', 'along', 'among', 'around', 'looking', 'seeking', 'required',
  'requirements', 'qualifications', 'preferred', 'plus', 'bonus', 'nice', 'ideal',
  'minimum', 'etc', 'role', 'position', 'job', 'company', 'team', 'teams',
  
  // LinkedIn/Job Board UI noise
  'logo', 'share', 'show', 'options', 'reposted', 'posted', 'hours', 'ago',
  'people', 'clicked', 'apply', 'promoted', 'hirer', 'hiring', 'actively',
  'applicants', 'applicant', 'easy', 'save', 'saved', 'report', 'hide',
  'follow', 'following', 'followers', 'connections', 'connection', 'connect',
  'message', 'messages', 'view', 'views', 'like', 'likes', 'comment', 'comments',
  'reactions', 'reaction', 'celebrate', 'love', 'insightful', 'curious',
  'repost', 'send', 'copy', 'link', 'embed', 'linkedin', 'indeed', 'glassdoor',
  'naukri', 'monster', 'ziprecruiter', 'dice', 'careers', 'jobs',
  'back', 'edit', 'parsed', 'resume', 'regenerate', 'pending', 'accepted',
  'rejected', 'modifications', 'restructuring', 'issue', 'detected',
  
  // Location noise - Cities/States/Countries
  'remote', 'hybrid', 'onsite', 'office', 'location', 'locations',
  'bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune',
  'gurgaon', 'gurugram', 'noida', 'kolkata', 'ahmedabad', 'india', 'indian',
  'karnataka', 'maharashtra', 'telangana', 'tamil', 'nadu', 'kerala',
  'east', 'west', 'north', 'south', 'central',
  'usa', 'america', 'american', 'california', 'texas', 'york', 'francisco',
  'seattle', 'boston', 'chicago', 'austin', 'denver', 'atlanta', 'angeles',
  'london', 'uk', 'england', 'europe', 'european', 'singapore', 'dubai',
  'canada', 'toronto', 'vancouver', 'australia', 'sydney', 'melbourne',
  
  // Time-related noise
  'today', 'yesterday', 'week', 'weeks', 'month', 'months', 'day', 'days',
  'hour', 'minutes', 'recently', 'immediate', 'immediately', 'asap', 'urgent',
  
  // Generic job posting fluff
  'description', 'overview', 'summary', 'details', 'information', 'info',
  'application', 'applications', 'submit', 'click', 'button',
  'equal', 'opportunity', 'employer', 'eoe', 'diversity', 'inclusive',
  'benefits', 'salary', 'compensation', 'package', 'perks', 'insurance',
  'health', 'dental', 'vision', 'retirement', '401k', 'pto', 'vacation',
  'candidate', 'candidates', 'talent', 'talented', 'individual', 'individuals',
  'join', 'joining', 'grow', 'growth', 'career', 'opportunities',
  
  // Numbers and misc
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
]);

// ============================================
// KEYWORD EXTRACTION
// ============================================

const extractKeywords = (text) => {
  // Clean noise first
  const cleanedText = cleanText(text);
  
  // Extract phrases
  const phrases = extractPhrases(cleanedText);
  
  // Extract and filter words
  const words = cleanedText
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s\+\#\.]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Normalize and deduplicate
  const normalizedWords = new Set();
  
  for (const word of words) {
    const normalized = normalizeKeyword(word);
    if (normalized.length > 2 && !stopWords.has(normalized)) {
      normalizedWords.add(normalized);
    }
  }
  
  for (const phrase of phrases) {
    const normalized = normalizeKeyword(phrase);
    normalizedWords.add(normalized);
  }
  
  return Array.from(normalizedWords);
};

// ============================================
// SKILL CATEGORIZATION
// ============================================

const categorizeSkill = (keyword) => {
  const hardSkillPatterns = [
    /python|java|javascript|typescript|golang|ruby|php|swift|kotlin|scala|rust|cplusplus|csharp/i,
    /react|angular|vue|django|flask|spring|express|nextjs|rails|laravel/i,
    /sql|postgres|mysql|mongodb|redis|elasticsearch|dynamodb|cassandra|oracle/i,
    /aws|azure|gcp|cloud|kubernetes|docker|terraform|ansible|jenkins|cicd/i,
    /git|jira|confluence|figma|sketch|tableau|powerbi|excel/i,
    /pandas|numpy|spark|hadoop|kafka|airflow|dbt|snowflake|databricks/i,
    /tensorflow|pytorch|keras|scikit|machinelearning|datascience|nlp|computervision/i,
    /api|rest|graphql|microservices|devops|agile|scrum|kanban/i,
    /html|css|sass|webpack|npm|yarn|testing|selenium|cypress/i,
    /linux|unix|bash|powershell|networking|security|encryption/i,
    /fullstack|frontend|backend|dataengineering|productmanagement/i,
    /prd|roadmap|backlog|sprint|release|pdlc|sdlc|userstories/i
  ];
  
  const softSkillPatterns = [
    /leadership|communication|collaboration|teamwork|problemsolving/i,
    /analytical|creative|strategic|innovative|adaptable|flexible/i,
    /organized|detail|motivated|proactive|reliable|dependable/i,
    /interpersonal|negotiation|presentation|mentoring|coaching/i,
    /decision|time|prioritization|critical|thinking/i,
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

// ============================================
// KEYWORD MATCHING
// ============================================

const matchKeywords = (resumeKeywords, jdKeywords) => {
  const matched = [];
  const missing = [];
  
  const resumeSet = new Set(resumeKeywords.map(k => normalizeKeyword(k)));
  const resumeStemmed = new Set(resumeKeywords.map(k => stem(normalizeKeyword(k))));
  
  for (const jdKeyword of jdKeywords) {
    const normalizedJD = normalizeKeyword(jdKeyword);
    const stemmedJD = stem(normalizedJD);
    
    // Skip if it's a stopword
    if (stopWords.has(normalizedJD) || stopWords.has(jdKeyword.toLowerCase())) {
      continue;
    }
    
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
      if (resumeKeyword.length > 3 && normalizedJD.length > 3) {
        if (resumeKeyword.includes(normalizedJD) || normalizedJD.includes(resumeKeyword)) {
          matched.push({ keyword: jdKeyword, matchType: 'partial' });
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      missing.push(jdKeyword);
    }
  }
  
  return { matched, missing };
};

// ============================================
// LOCAL ANALYSIS
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

  const atsScore = Math.round((hasEmail ? 20 : 0) + (hasPhone ? 20 : 0) + (hasSections ? 30 : 0) + (wordCount > 300 ? 30 : 15));

  // Filter out any remaining noise from final keyword lists
  const cleanKeywordList = (keywords) => {
    return [...new Set(keywords)].filter(k => 
      k.length > 2 && 
      !stopWords.has(k.toLowerCase()) &&
      !/^(logo|share|options|bengaluru|karnataka|east|west|hours|ago|people|clicked|apply|promoted|hirer)$/i.test(k)
    );
  };

  return {
    overallScore,
    atsScore,
    matchedKeywords: cleanKeywordList(matchedKeywords),
    missingKeywords: cleanKeywordList(missing),
    hardScore: Math.round(hardScore),
    softScore: Math.round(softScore),
    formatChecks: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      hasNumbers,
      hasActionVerbs,
      hasSections,
      wordCount
    },
    _meta: {
      resumeKeywordCount: resumeKeywords.length,
      jdKeywordCount: jdKeywords.length,
      analysisType: 'local'
    }
  };
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
  const [activeTab, setActiveTab] = useState('summary');
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [modifications, setModifications] = useState([]);
  const [expandedMod, setExpandedMod] = useState(null);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    
    setIsAnalyzing(true);
    setError('');
    setAnalysisStage('Cleaning input...');
    setModifications([]);
    
    try {
      // STEP 1: Local analysis
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisStage('Matching keywords...');
      
      const localResults = analyzeResumeLocally(resumeText, jdText);
      
      // STEP 2: AI enhancement
      setAnalysisStage('Generating AI insights...');
      
      try {
        const response = await fetch('/api/analyze-enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText,
            jdText,
            localResults
          })
        });

        const aiResults = await response.json();
        
        if (!aiResults.error) {
          setResults({
            ...localResults,
            ...aiResults,
            _meta: { ...localResults._meta, aiEnhanced: true }
          });
          
          if (aiResults.modifications) {
            setModifications(aiResults.modifications.map((mod, i) => ({
              ...mod,
              id: i,
              status: 'pending'
            })));
          }
        } else {
          setResults(localResults);
        }
      } catch (err) {
        console.log('AI enhancement failed, using local results');
        setResults(localResults);
      }
      
      setActiveTab('summary');
      
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  }, [resumeText, jdText]);

  const handleModificationStatus = (id, status) => {
    setModifications(prev => prev.map(mod => 
      mod.id === id ? { ...mod, status } : mod
    ));
  };

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

  const pendingCount = modifications.filter(m => m.status === 'pending').length;
  const acceptedCount = modifications.filter(m => m.status === 'accepted').length;
  const rejectedCount = modifications.filter(m => m.status === 'rejected').length;

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
              <p className="text-xs text-slate-500">Smart ATS Optimizer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {results && (
              <button
                onClick={() => setResults(null)}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                ← New Analysis
              </button>
            )}
            {results?._meta?.aiEnhanced && (
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Enhanced
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!results ? (
          /* INPUT SECTION */
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-6">
                <Cpu className="w-4 h-4" />
                <span>Smart Synonym Matching</span>
                <span className="text-slate-600">+</span>
                <Sparkles className="w-4 h-4" />
                <span>AI Insights</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Optimize Your Resume for ATS
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Get AI-powered analysis with specific modification suggestions you can accept or reject.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Resume Input */}
              <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-800">
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
                  placeholder="Paste your resume text here..."
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
              <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-800">
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
                  placeholder="Paste the job description here..."
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

            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

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
                  </>
                )}
              </button>
            </div>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-4 gap-4 mt-12">
              {[
                { icon: Cpu, title: 'Smart Synonyms', desc: '"JS" matches "JavaScript"', color: 'blue' },
                { icon: BarChart3, title: 'Noise Filtering', desc: 'Removes LinkedIn junk', color: 'violet' },
                { icon: Edit3, title: 'AI Suggestions', desc: 'Accept or reject changes', color: 'fuchsia' },
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
          /* RESULTS SECTION */
          <div className="space-y-6">
            {/* Score Cards Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Match Score */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Match Score</p>
                    <p className="text-xs text-slate-500">Overall compatibility</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-5xl font-bold ${getScoreColor(results.overallScore)}`}>
                      {results.overallScore}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getScoreBg(results.overallScore)} rounded-full transition-all duration-500`} 
                    style={{ width: `${results.overallScore}%` }} 
                  />
                </div>
              </div>

              {/* ATS Readability */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">ATS Readability</p>
                    <p className="text-xs text-slate-500">Based on formatting</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-5xl font-bold ${getScoreColor(results.atsScore)}`}>
                      {results.atsScore}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getScoreBg(results.atsScore)} rounded-full transition-all duration-500`} 
                    style={{ width: `${results.atsScore}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'summary', label: 'Executive Summary', icon: Award },
                { id: 'modifications', label: `Modifications (${modifications.length})`, icon: Edit3 },
                { id: 'keywords', label: 'Keyword Analysis', icon: Target },
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
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800">
              
              {/* EXECUTIVE SUMMARY TAB */}
              {activeTab === 'summary' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-violet-400" />
                    Executive Summary
                  </h3>
                  
                  {results.executiveSummary ? (
                    <div className="bg-slate-800/50 rounded-xl p-5">
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {results.executiveSummary}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <h4 className="font-medium text-emerald-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Strengths
                        </h4>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>• {results.matchedKeywords?.length || 0} keywords matched with job description</li>
                          {results.formatChecks?.hasNumbers && <li>• Uses quantified achievements</li>}
                          {results.formatChecks?.hasActionVerbs && <li>• Strong action verbs present</li>}
                          {results.formatChecks?.hasEmail && results.formatChecks?.hasPhone && <li>• Complete contact information</li>}
                        </ul>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <h4 className="font-medium text-amber-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                        </h4>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>• {results.missingKeywords?.length || 0} important keywords missing</li>
                          {!results.formatChecks?.hasNumbers && <li>• Add quantified achievements (numbers, percentages)</li>}
                          {!results.formatChecks?.hasActionVerbs && <li>• Use stronger action verbs</li>}
                          {results.formatChecks?.wordCount < 400 && <li>• Consider adding more detail to experience</li>}
                        </ul>
                      </div>

                      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                        <h4 className="font-medium text-violet-400 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" /> Recommendation
                        </h4>
                        <p className="text-sm text-slate-300">
                          {results.overallScore >= 80 
                            ? "Your resume is well-aligned with this role. Focus on minor refinements to stand out."
                            : results.overallScore >= 60
                            ? "Good foundation, but needs strategic keyword additions. Review the Modifications tab for specific suggestions."
                            : "Significant gaps identified. Review the Modifications tab and incorporate missing keywords to improve your match score."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODIFICATIONS TAB */}
              {activeTab === 'modifications' && (
                <div className="p-6">
                  {/* Status Counts */}
                  <div className="flex items-center gap-4 mb-6 flex-wrap">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-violet-400" />
                      Modifications
                    </h3>
                    <div className="flex gap-2 ml-auto">
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                        {pendingCount} pending
                      </span>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                        {acceptedCount} accepted
                      </span>
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                        {rejectedCount} rejected
                      </span>
                    </div>
                  </div>

                  {modifications.length > 0 ? (
                    <div className="space-y-3">
                      {modifications.map((mod, index) => (
                        <div 
                          key={mod.id}
                          className={`rounded-xl border transition-all ${
                            mod.status === 'accepted' ? 'bg-emerald-500/5 border-emerald-500/20' :
                            mod.status === 'rejected' ? 'bg-red-500/5 border-red-500/20 opacity-60' :
                            'bg-slate-800/50 border-slate-700'
                          }`}
                        >
                          {/* Header */}
                          <div 
                            className="flex items-center gap-3 p-4 cursor-pointer"
                            onClick={() => setExpandedMod(expandedMod === mod.id ? null : mod.id)}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                              mod.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                              mod.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-violet-500/20 text-violet-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{mod.section}</span>
                                {mod.status === 'pending' && (
                                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                                    Issue Detected
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-400 truncate">{mod.issue}</p>
                            </div>
                            {expandedMod === mod.id ? (
                              <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            )}
                          </div>

                          {/* Expanded Content */}
                          {expandedMod === mod.id && (
                            <div className="px-4 pb-4 border-t border-slate-700/50">
                              <div className="pt-4 space-y-4">
                                {/* Original */}
                                {mod.original && (
                                  <div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">Original</span>
                                    <p className="text-sm text-slate-400 mt-1 bg-slate-800/50 p-3 rounded-lg">{mod.original}</p>
                                  </div>
                                )}
                                
                                {/* Suggested */}
                                <div>
                                  <span className="text-xs text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Suggested
                                  </span>
                                  <p className="text-sm text-white mt-1 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                    {mod.suggestion}
                                  </p>
                                </div>

                                {/* Reason */}
                                {mod.reason && (
                                  <p className="text-xs text-slate-500 italic">
                                    💡 {mod.reason}
                                  </p>
                                )}

                                {/* Actions */}
                                {mod.status === 'pending' && (
                                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleModificationStatus(mod.id, 'accepted');
                                      }}
                                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors"
                                    >
                                      <ThumbsUp className="w-4 h-4" /> Accept
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleModificationStatus(mod.id, 'rejected');
                                      }}
                                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                                    >
                                      <ThumbsDown className="w-4 h-4" /> Reject
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(mod.suggestion, mod.id);
                                      }}
                                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors ml-auto"
                                    >
                                      {copiedIndex === mod.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                      {copiedIndex === mod.id ? 'Copied!' : 'Copy'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit3 className="w-8 h-8 text-slate-600" />
                      </div>
                      <h5 className="font-semibold mb-2 text-slate-400">No Modifications Generated</h5>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">
                        AI-powered modification suggestions require the API to be configured. 
                        Check the Keyword Analysis tab for missing keywords you can add manually.
                      </p>
                    </div>
                  )}

                  {/* Regenerate Button */}
                  {acceptedCount > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                        <Download className="w-5 h-5" />
                        Regenerate My Resume
                      </button>
                      <p className="text-xs text-slate-500 text-center mt-2">
                        Accept at least one suggestion to generate your updated resume
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* KEYWORD ANALYSIS TAB */}
              {activeTab === 'keywords' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-violet-400" />
                    Keyword Analysis
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Found Keywords */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium">Found Keywords</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                          {results.matchedKeywords?.length || 0}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                        {results.matchedKeywords?.map((kw, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm border border-emerald-500/20">
                            {kw}
                          </span>
                        ))}
                        {(!results.matchedKeywords || results.matchedKeywords.length === 0) && (
                          <p className="text-slate-500 text-sm">No keywords matched</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="font-medium">Missing Keywords</span>
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                          {results.missingKeywords?.length || 0}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                        {results.missingKeywords?.map((kw, i) => (
                          <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20">
                            {kw}
                          </span>
                        ))}
                        {(!results.missingKeywords || results.missingKeywords.length === 0) && (
                          <p className="text-slate-500 text-sm">No critical keywords missing!</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="mt-6 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-xl p-4 border border-violet-500/20">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-violet-400">Pro Tip</span>
                        <p className="text-sm text-slate-300 mt-1">
                          Incorporate the missing keywords naturally into your "Work Experience" and "Skills" sections. 
                          Don't just list them — show how you've used these skills with specific examples and achievements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>ResuMatch AI — Smart ATS Optimization</p>
          <p className="mt-1">A Product Management Portfolio Project by Sweatha Hari</p>
        </div>
      </footer>
    </div>
  );
}
