import React, { useState, useCallback, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Zap, Target, Sparkles, RefreshCw, Copy, Check, Brain, Lightbulb, Cpu, ThumbsUp, ThumbsDown, Edit3, Download, ChevronDown, ChevronUp, AlertTriangle, Award, Upload, Users, TrendingUp, BarChart2, ArrowRight, ExternalLink, Linkedin, Mail, ChevronRight, X, Menu, BookOpen, Layers, MessageSquare, Star } from 'lucide-react';

// ============================================
// SYNONYM DICTIONARY - Maps variations to canonical form
// ============================================

const synonyms = {
  'javascript': ['js', 'es6', 'es2015', 'ecmascript', 'node.js', 'nodejs', 'node'],
  'typescript': ['ts'],
  'python': ['py', 'python3', 'python2'],
  'golang': ['go', 'go lang'],
  'csharp': ['c#', 'c-sharp', 'dotnet', '.net', 'dot net'],
  'cplusplus': ['c++', 'cpp'],
  'react': ['reactjs', 'react.js', 'react native', 'reactnative'],
  'angular': ['angularjs', 'angular.js', 'angular2', 'angular4'],
  'vue': ['vuejs', 'vue.js', 'vue3'],
  'nextjs': ['next.js', 'next'],
  'express': ['expressjs', 'express.js'],
  'django': ['python django'],
  'flask': ['python flask'],
  'spring': ['spring boot', 'springboot'],
  'aws': ['amazon web services', 'amazon cloud', 'ec2', 's3', 'lambda', 'amazon'],
  'gcp': ['google cloud', 'google cloud platform', 'gce'],
  'azure': ['microsoft azure', 'ms azure'],
  'kubernetes': ['k8s', 'kube'],
  'docker': ['containerization', 'containers', 'dockerfile'],
  'cicd': ['ci/cd', 'ci-cd', 'continuous integration', 'continuous deployment', 'jenkins', 'gitlab ci', 'github actions'],
  'terraform': ['infrastructure as code', 'iac'],
  'postgresql': ['postgres', 'psql', 'postgre'],
  'mongodb': ['mongo', 'nosql'],
  'mysql': ['my sql', 'mariadb'],
  'elasticsearch': ['elastic', 'elk', 'elastic search'],
  'dynamodb': ['dynamo', 'dynamo db'],
  'redis': ['caching', 'in-memory'],
  'machinelearning': ['machine learning', 'ml', 'deep learning', 'dl', 'ai', 'artificial intelligence'],
  'datascience': ['data science', 'data scientist', 'data analytics', 'analytics'],
  'dataengineering': ['data engineering', 'data engineer', 'etl', 'data pipeline', 'data pipelines'],
  'nlp': ['natural language processing', 'natural language', 'text processing'],
  'computervision': ['computer vision', 'image processing', 'cv'],
  'agile': ['scrum', 'kanban', 'sprint', 'sprints', 'agile methodology'],
  'devops': ['dev ops', 'sre', 'site reliability', 'platform engineering'],
  'productmanagement': ['product management', 'product manager', 'pm', 'product owner', 'po'],
  'projectmanagement': ['project management', 'project manager', 'pmp'],
  'leadership': ['led', 'leading', 'leader', 'manage', 'managed', 'managing', 'oversaw', 'supervised', 'directed', 'head', 'headed', 'spearheaded'],
  'communication': ['communicate', 'communicated', 'communicating', 'verbal', 'written', 'presentation', 'presenting', 'presented'],
  'collaboration': ['collaborate', 'collaborated', 'collaborating', 'team player', 'teamwork', 'cross-functional', 'cross functional', 'partnered', 'partnering'],
  'problemsolving': ['problem solving', 'problem-solving', 'troubleshoot', 'troubleshooting', 'debug', 'debugging', 'resolved', 'resolving', 'solving'],
  'analytical': ['analysis', 'analyze', 'analyzed', 'analyzing', 'analytics', 'analytical skills', 'data-driven', 'data driven'],
  'strategic': ['strategy', 'strategic thinking', 'strategize', 'strategic planning'],
  'fullstack': ['full stack', 'full-stack', 'frontend and backend', 'front and back end'],
  'frontend': ['front end', 'front-end', 'ui', 'user interface', 'client side', 'client-side'],
  'backend': ['back end', 'back-end', 'server side', 'server-side', 'api development'],
  'senior': ['sr', 'sr.', 'lead', 'principal', 'staff'],
  'junior': ['jr', 'jr.', 'entry level', 'entry-level', 'associate'],
  'jira': ['atlassian', 'confluence', 'trello'],
  'figma': ['sketch', 'adobe xd', 'invision', 'ui design'],
  'git': ['github', 'gitlab', 'bitbucket', 'version control', 'source control'],
  'tableau': ['power bi', 'looker', 'data visualization', 'dashboards'],
  'excel': ['spreadsheets', 'google sheets', 'sheets'],
  'api': ['apis', 'rest', 'restful', 'rest api', 'graphql', 'endpoint', 'endpoints', 'web services', 'microservices'],
  'testing': ['test', 'tests', 'qa', 'quality assurance', 'unit testing', 'integration testing', 'e2e', 'end to end', 'automated testing', 'test automation'],
  'prd': ['product requirements', 'product requirements document', 'requirements document'],
  'roadmap': ['product roadmap', 'roadmapping', 'product planning'],
  'backlog': ['product backlog', 'backlog management', 'backlog grooming', 'backlog refinement'],
  'userstories': ['user stories', 'user story', 'stories'],
  'stakeholder': ['stakeholders', 'stakeholder management', 'stakeholder collaboration'],
  'ux': ['user experience', 'usability', 'user research'],
  'designcollaboration': ['design collaboration', 'work with design', 'collaborate with design', 'design team']
};

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

const normalizeKeyword = (keyword) => {
  const lower = keyword.toLowerCase().trim();
  return synonymMap.get(lower) || lower;
};

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

const cleanText = (text) => {
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
  ];
  
  let cleaned = text;
  for (const pattern of noisePatterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  return cleaned;
};

const stopWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
  'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 
  'must', 'shall', 'can', 'need', 'this', 'that', 'these', 'those', 'i', 'you', 
  'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 
  'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 
  'well', 'work', 'working', 'experience', 'year', 'years', 'ability', 'strong',
  'excellent', 'proven', 'demonstrated', 'responsible', 'responsibilities',
  'including', 'using', 'used', 'new', 'first', 'one', 'two', 'three', 'based',
  'logo', 'share', 'show', 'options', 'reposted', 'posted', 'hours', 'ago',
  'people', 'clicked', 'apply', 'promoted', 'hirer', 'hiring', 'actively',
  'remote', 'hybrid', 'onsite', 'office', 'location', 'locations',
  'bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune',
  'karnataka', 'maharashtra', 'telangana', 'tamil', 'nadu', 'kerala',
  'east', 'west', 'north', 'south', 'central',
  'today', 'yesterday', 'week', 'weeks', 'month', 'months', 'day', 'days',
]);

const extractKeywords = (text) => {
  const cleanedText = cleanText(text);
  const phrases = extractPhrases(cleanedText);
  
  const words = cleanedText
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s\+\#\.]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
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

const categorizeSkill = (keyword) => {
  const hardSkillPatterns = [
    /python|java|javascript|typescript|golang|ruby|php|swift|kotlin|scala|rust|cplusplus|csharp/i,
    /react|angular|vue|django|flask|spring|express|nextjs|rails|laravel/i,
    /sql|postgres|mysql|mongodb|redis|elasticsearch|dynamodb|cassandra|oracle/i,
    /aws|azure|gcp|cloud|kubernetes|docker|terraform|ansible|jenkins|cicd/i,
    /git|jira|confluence|figma|sketch|tableau|powerbi|excel/i,
    /api|rest|graphql|microservices|devops|agile|scrum|kanban/i,
    /prd|roadmap|backlog|sprint|release|pdlc|sdlc|userstories/i
  ];
  
  const softSkillPatterns = [
    /leadership|communication|collaboration|teamwork|problemsolving/i,
    /analytical|creative|strategic|innovative|adaptable|flexible/i,
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

const matchKeywords = (resumeKeywords, jdKeywords) => {
  const matched = [];
  const missing = [];
  
  const resumeSet = new Set(resumeKeywords.map(k => normalizeKeyword(k)));
  const resumeStemmed = new Set(resumeKeywords.map(k => stem(normalizeKeyword(k))));
  
  for (const jdKeyword of jdKeywords) {
    const normalizedJD = normalizeKeyword(jdKeyword);
    const stemmedJD = stem(normalizedJD);
    
    if (stopWords.has(normalizedJD) || stopWords.has(jdKeyword.toLowerCase())) {
      continue;
    }
    
    if (resumeSet.has(normalizedJD)) {
      matched.push({ keyword: jdKeyword, matchType: 'exact' });
      continue;
    }
    
    if (resumeStemmed.has(stemmedJD)) {
      matched.push({ keyword: jdKeyword, matchType: 'stemmed' });
      continue;
    }
    
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

const analyzeResumeLocally = (resumeText, jdText) => {
  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jdText);
  
  const { matched, missing } = matchKeywords(resumeKeywords, jdKeywords);
  const matchedKeywords = matched.map(m => m.keyword);
  
  const matchedHard = matchedKeywords.filter(k => categorizeSkill(k) === 'hard');
  const matchedSoft = matchedKeywords.filter(k => categorizeSkill(k) === 'soft');
  
  const jdHard = jdKeywords.filter(k => categorizeSkill(k) === 'hard');
  const jdSoft = jdKeywords.filter(k => categorizeSkill(k) === 'soft');
  
  const hardScore = jdHard.length > 0 ? (matchedHard.length / jdHard.length) * 100 : 100;
  const softScore = jdSoft.length > 0 ? (matchedSoft.length / jdSoft.length) * 100 : 100;
  const generalScore = jdKeywords.length > 0 ? (matchedKeywords.length / jdKeywords.length) * 100 : 0;
  
  const overallScore = Math.min(100, Math.round(
    (hardScore * 0.6) + (softScore * 0.25) + (generalScore * 0.15)
  ));

  const hasEmail = /\b[\w.-]+@[\w.-]+\.\w+\b/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasNumbers = /\d+%|\$[\d,]+|\d+\+|\d+ (years?|months?|projects?|teams?|clients?|customers?|members?)/i.test(resumeText);
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'increased', 'reduced', 'improved', 'designed', 'launched', 'built', 'achieved', 'delivered'];
  const hasActionVerbs = actionVerbs.some(verb => resumeText.toLowerCase().includes(verb));
  const wordCount = resumeText.split(/\s+/).length;
  const hasSections = /experience|education|skills|summary|objective|projects?|certifications?/i.test(resumeText);

  const atsScore = Math.round((hasEmail ? 20 : 0) + (hasPhone ? 20 : 0) + (hasSections ? 30 : 0) + (wordCount > 300 ? 30 : 15));

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
    formatChecks: { hasEmail, hasPhone, hasNumbers, hasActionVerbs, hasSections, wordCount },
    _meta: { resumeKeywordCount: resumeKeywords.length, jdKeywordCount: jdKeywords.length, analysisType: 'local' }
  };
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ATSResumeAnalyzer() {
  const [currentPage, setCurrentPage] = useState('home');
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(1847);

  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target.result;
      if (type === 'resume') {
        setResumeText(text);
      } else {
        setJdText(text);
      }
    };

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setError('PDF detected. Please copy-paste text from your PDF for best results.');
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      setError('Word doc detected. Please copy-paste text from your document for best results.');
    } else {
      reader.readAsText(file);
    }
  };

  const sampleResume = `SARAH JOHNSON
Senior Product Manager
sarah.johnson@email.com | (555) 123-4567 | linkedin.com/in/sarahjohnson

PROFESSIONAL SUMMARY
Results-driven Product Manager with 6+ years of experience leading cross-functional teams to deliver innovative software products. Proven track record of increasing user engagement by 45% and driving $2M+ in revenue growth through data-driven product strategies.

EXPERIENCE

Senior Product Manager | TechCorp Inc. | 2021 - Present
• Led product roadmap for B2B SaaS platform serving 500+ enterprise clients
• Managed backlog of 200+ features using Agile/Scrum methodology in JIRA
• Collaborated with Engineering, Design, and Sales to launch 3 major product releases
• Increased user retention by 35% through customer interview insights and A/B testing
• Created PRDs and user stories for development team of 12 engineers

Product Manager | StartupXYZ | 2018 - 2021
• Owned end-to-end product lifecycle for mobile application with 100K+ users
• Conducted 50+ customer interviews to identify pain points and opportunities
• Reduced customer churn by 25% through improved onboarding experience

SKILLS
Product Management: Roadmapping, PRD, User Stories, Agile, Scrum, Sprint Planning
Tools: JIRA, Confluence, Figma, SQL, Tableau, Google Analytics
Technical: API integrations, A/B testing, Data analysis

EDUCATION
MBA, Business Administration | Stanford University | 2018
BS, Computer Science | UC Berkeley | 2014`;

  const sampleJD = `Senior Product Manager - Enterprise Platform

About the Role:
We are looking for an experienced Senior Product Manager to lead our enterprise platform initiatives.

Requirements:
• 5+ years of product management experience in B2B SaaS
• Strong experience with Agile/Scrum methodologies
• Proven ability to write clear PRDs and user stories
• Experience with SQL and data analysis tools
• Track record of shipping products that drive business outcomes
• Excellent stakeholder management and communication skills
• Experience conducting customer interviews and user research
• Familiarity with JIRA, Confluence, and product analytics tools

Nice to Have:
• MBA or technical degree
• Experience with API products
• Experience with A/B testing and experimentation`;

  const loadSampleData = () => {
    setResumeText(sampleResume);
    setJdText(sampleJD);
  };

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    
    setIsAnalyzing(true);
    setError('');
    setAnalysisStage('Cleaning input...');
    setModifications([]);
    setAnalysisCount(prev => prev + 1);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisStage('Matching keywords...');
      
      const localResults = analyzeResumeLocally(resumeText, jdText);
      
      setAnalysisStage('Generating AI insights...');
      
      try {
        const response = await fetch('/api/analyze-enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, jdText, localResults })
        });

        const aiResults = await response.json();
        
        if (!aiResults.error) {
          setResults({ ...localResults, ...aiResults, _meta: { ...localResults._meta, aiEnhanced: true } });
          if (aiResults.modifications) {
            setModifications(aiResults.modifications.map((mod, i) => ({ ...mod, id: i, status: 'pending' })));
          }
        } else {
          setResults(localResults);
        }
      } catch (err) {
        setResults(localResults);
      }
      
      setActiveTab('summary');
      setCurrentPage('results');
      
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  }, [resumeText, jdText]);

  const handleModificationStatus = (id, status) => {
    setModifications(prev => prev.map(mod => mod.id === id ? { ...mod, status } : mod));
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

  // ============================================
  // NAVIGATION COMPONENT
  // ============================================
  
  const Navigation = () => (
    <header className="border-b border-slate-800 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentPage('home'); setResults(null); }}>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                ResuMatch
              </h1>
              <p className="text-[10px] text-slate-500">v2.0 • AI-Powered</p>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => { setCurrentPage('home'); setResults(null); }} className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
              Analyzer
            </button>
            <button onClick={() => setCurrentPage('case-study')} className={`text-sm font-medium transition-colors ${currentPage === 'case-study' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
              Case Study
            </button>
            <button onClick={() => setCurrentPage('about')} className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
              About
            </button>
            <a href="https://linkedin.com/in/sweatha-hari" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-400">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col gap-3">
            <button onClick={() => { setCurrentPage('home'); setResults(null); setMobileMenuOpen(false); }} className="text-sm text-slate-300 text-left">Analyzer</button>
            <button onClick={() => { setCurrentPage('case-study'); setMobileMenuOpen(false); }} className="text-sm text-slate-300 text-left">Case Study</button>
            <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="text-sm text-slate-300 text-left">About</button>
          </nav>
        )}
      </div>
    </header>
  );

  // ============================================
  // HOME PAGE
  // ============================================
  
  const HomePage = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center pt-8 pb-12">
        {/* Live Counter Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{analysisCount.toLocaleString()} resumes analyzed</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
          Beat the ATS.<br />Land More Interviews.
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
          75% of resumes get rejected by ATS before a human sees them. 
          ResuMatch uses AI to analyze your resume against any job description and tells you exactly how to improve.
        </p>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: Zap, text: 'Instant Analysis' },
            { icon: Brain, text: 'AI-Powered' },
            { icon: CheckCircle, text: '100% Free' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-sm text-slate-300">
              <badge.icon className="w-4 h-4 text-violet-400" />
              {badge.text}
            </div>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume Input */}
        <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold">Your Resume</h3>
                <p className="text-xs text-slate-500">Upload or paste</p>
              </div>
            </div>
            <label className="cursor-pointer">
              <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resume')} className="hidden" />
              <span className="flex items-center gap-2 px-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" /> Upload
              </span>
            </label>
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume here..."
            className="w-full h-64 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none font-mono"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-500">{resumeText.split(/\s+/).filter(Boolean).length} words</p>
            {resumeText && <button onClick={() => setResumeText('')} className="text-xs text-slate-500 hover:text-slate-400">Clear</button>}
          </div>
        </div>

        {/* Job Description Input */}
        <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <h3 className="font-semibold">Job Description</h3>
                <p className="text-xs text-slate-500">Upload or paste</p>
              </div>
            </div>
            <label className="cursor-pointer">
              <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'jd')} className="hidden" />
              <span className="flex items-center gap-2 px-3 py-2 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-400 rounded-lg text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" /> Upload
              </span>
            </label>
          </div>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-64 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 resize-none font-mono"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-500">{jdText.split(/\s+/).filter(Boolean).length} words</p>
            {jdText && <button onClick={() => setJdText('')} className="text-xs text-slate-500 hover:text-slate-400">Clear</button>}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={handleAnalyze}
            disabled={!resumeText.trim() || !jdText.trim() || isAnalyzing}
            className="group px-8 sm:px-10 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 disabled:from-slate-700 disabled:to-slate-700 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-violet-500/25"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{analysisStage}</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Analyze Resume
              </>
            )}
          </button>
          
          {!resumeText && !jdText && (
            <button onClick={loadSampleData} className="text-sm text-slate-500 hover:text-violet-400 underline underline-offset-2 transition-colors">
              or try with sample data
            </button>
          )}
        </div>

        {/* Privacy Guarantee */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>100% Privacy Friendly. Your data is never stored.</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {[
          { icon: Upload, title: 'Easy Upload', desc: 'Paste or upload', color: 'violet' },
          { icon: Cpu, title: 'Smart Matching', desc: '100+ synonyms', color: 'blue' },
          { icon: Brain, title: 'Semantic AI', desc: 'Vector analysis', color: 'fuchsia' },
          { icon: Target, title: 'ATS Optimized', desc: 'Beat the bots', color: 'emerald' },
        ].map((feature, i) => (
          <div key={i} className="bg-slate-900/30 rounded-xl p-4 border border-slate-800 text-center hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <feature.icon className="w-5 h-5 text-violet-400" />
            </div>
            <h4 className="font-semibold mb-1 text-sm">{feature.title}</h4>
            <p className="text-xs text-slate-500">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Social Proof */}
      <div className="mt-16 text-center">
        <p className="text-slate-500 text-sm mb-6">Trusted by job seekers from</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50">
          {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company, i) => (
            <span key={i} className="text-slate-400 font-semibold">{company}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================
  // RESULTS PAGE
  // ============================================
  
  const ResultsPage = () => (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => { setCurrentPage('home'); setResults(null); }} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors mb-4">
        ← Analyze Another Resume
      </button>

      {/* Score Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Keyword Match</p>
              <p className="text-xs text-slate-500">Hard skills</p>
            </div>
            <span className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>{results.overallScore}%</span>
          </div>
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${getScoreBg(results.overallScore)} rounded-full`} style={{ width: `${results.overallScore}%` }} />
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 relative">
          {results.semanticScore !== null ? (
            <>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded text-xs"><Sparkles className="w-3 h-3 inline" /> AI</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Semantic Match</p>
                  <p className="text-xs text-slate-500">Cosine similarity</p>
                </div>
                <span className={`text-4xl font-bold ${getScoreColor(results.semanticScore)}`}>{results.semanticScore}%</span>
              </div>
              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: `${results.semanticScore}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Semantic Match</p>
                  <p className="text-xs text-slate-500">Vector AI</p>
                </div>
                <span className="text-2xl font-bold text-slate-600">--</span>
              </div>
              <p className="text-xs text-slate-500 mt-4">Add OpenAI key for semantic analysis</p>
            </>
          )}
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">ATS Readability</p>
              <p className="text-xs text-slate-500">Format score</p>
            </div>
            <span className={`text-4xl font-bold ${getScoreColor(results.atsScore)}`}>{results.atsScore}%</span>
          </div>
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${getScoreBg(results.atsScore)} rounded-full`} style={{ width: `${results.atsScore}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'summary', label: 'Summary', icon: Award },
          { id: 'modifications', label: `Fixes (${modifications.length})`, icon: Edit3 },
          { id: 'keywords', label: 'Keywords', icon: Target },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800">
        {activeTab === 'summary' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" /> Executive Summary
            </h3>
            
            {results.executiveSummary ? (
              <div className="bg-slate-800/50 rounded-xl p-5">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{results.executiveSummary}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h4 className="font-medium text-emerald-400 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Strengths</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• {results.matchedKeywords?.length || 0} keywords matched</li>
                    {results.formatChecks?.hasNumbers && <li>• Quantified achievements ✓</li>}
                    {results.formatChecks?.hasActionVerbs && <li>• Strong action verbs ✓</li>}
                  </ul>
                </div>
                
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h4 className="font-medium text-amber-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Gaps</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• {results.missingKeywords?.length || 0} keywords missing</li>
                    {!results.formatChecks?.hasNumbers && <li>• Add numbers & metrics</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'modifications' && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Edit3 className="w-5 h-5 text-violet-400" /> Suggested Fixes</h3>
              <div className="flex gap-2 ml-auto">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">{pendingCount} pending</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">{acceptedCount} accepted</span>
              </div>
            </div>

            {modifications.length > 0 ? (
              <div className="space-y-3">
                {modifications.map((mod, index) => (
                  <div key={mod.id} className={`rounded-xl border transition-all ${mod.status === 'accepted' ? 'bg-emerald-500/5 border-emerald-500/20' : mod.status === 'rejected' ? 'bg-red-500/5 border-red-500/20 opacity-60' : 'bg-slate-800/50 border-slate-700'}`}>
                    <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedMod(expandedMod === mod.id ? null : mod.id)}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${mod.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400'}`}>{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{mod.section}</span>
                        <p className="text-sm text-slate-400 truncate">{mod.issue}</p>
                      </div>
                      {expandedMod === mod.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                    
                    {expandedMod === mod.id && (
                      <div className="px-4 pb-4 border-t border-slate-700/50">
                        <div className="pt-4 space-y-4">
                          {mod.original && (
                            <div>
                              <span className="text-xs text-slate-500 uppercase">Original</span>
                              <p className="text-sm text-slate-400 mt-1 bg-slate-800/50 p-3 rounded-lg">{mod.original}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-xs text-emerald-400 uppercase flex items-center gap-1"><Sparkles className="w-3 h-3" /> Suggested</span>
                            <p className="text-sm text-white mt-1 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">{mod.suggestion}</p>
                          </div>
                          {mod.status === 'pending' && (
                            <div className="flex items-center gap-2 pt-2 flex-wrap">
                              <button onClick={() => handleModificationStatus(mod.id, 'accepted')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium">
                                <ThumbsUp className="w-4 h-4" /> Accept
                              </button>
                              <button onClick={() => handleModificationStatus(mod.id, 'rejected')} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium">
                                <ThumbsDown className="w-4 h-4" /> Reject
                              </button>
                              <button onClick={() => copyToClipboard(mod.suggestion, mod.id)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm ml-auto">
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
                <p className="text-slate-400">No AI modifications available. Check Keywords tab for missing skills.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-violet-400" /> Keyword Analysis</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">Found Keywords</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">{results.matchedKeywords?.length || 0}</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {results.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm border border-emerald-500/20">{kw}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="font-medium">Missing Keywords</span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">{results.missingKeywords?.length || 0}</span>
                  {results.missingKeywords?.length > 0 && (
                    <button onClick={() => { copyToClipboard(results.missingKeywords.join(', '), 'missing'); }} className="ml-auto text-xs text-slate-400 hover:text-white flex items-center gap-1">
                      {copiedIndex === 'missing' ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy All</>}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {results.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-violet-400">Pro Tip</span>
                  <p className="text-sm text-slate-300 mt-1">Add missing keywords naturally into your Experience and Skills sections. Don't just list them — show how you've used these skills.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // CASE STUDY PAGE
  // ============================================
  
  const CaseStudyPage = () => (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center">
        <span className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">PM Case Study</span>
        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Building ResuMatch
        </h1>
        <p className="text-slate-400 text-lg">How I identified a problem, validated with research, and shipped an AI-powered solution in 2 weeks</p>
        <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-500">
          <span>By Sweatha Hari</span>
          <span>•</span>
          <span>Product Manager</span>
          <span>•</span>
          <span>December 2024</span>
        </div>
      </div>

      {/* The Problem */}
      <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">The Problem</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {[
            { stat: '75%', label: 'of resumes rejected by ATS', color: 'red' },
            { stat: '250+', label: 'applications per job posting', color: 'amber' },
            { stat: '6 sec', label: 'average recruiter review time', color: 'blue' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-slate-800/50 rounded-xl">
              <div className={`text-3xl font-bold text-${item.color}-400 mb-1`}>{item.stat}</div>
              <div className="text-sm text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
        
        <p className="text-slate-300 leading-relaxed">
          Job seekers spend hours crafting resumes, only to have them rejected by Applicant Tracking Systems (ATS) before a human ever sees them. 
          The existing tools were either too expensive ($49+/month), too basic (simple keyword matching), or didn't provide actionable feedback.
        </p>
      </section>

      {/* Research */}
      <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold">User Research</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Research Methods</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { method: 'User Surveys', count: '127 responses', insight: 'via LinkedIn, Reddit' },
                { method: 'User Interviews', count: '15 sessions', insight: '30-min calls' },
                { method: 'Competitive Analysis', count: '8 tools', insight: 'Feature comparison' },
                { method: 'Reddit/Forum Analysis', count: '50+ threads', insight: 'r/jobs, r/resumes' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4">
                  <div className="font-semibold text-white">{item.method}</div>
                  <div className="text-violet-400 text-sm">{item.count}</div>
                  <div className="text-slate-500 text-xs">{item.insight}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
            <div className="space-y-3">
              {[
                { quote: "I applied to 200+ jobs and got 3 responses. Something is wrong with my resume but I don't know what.", persona: 'Recent Graduate' },
                { quote: "I'd pay for a tool if it actually told me WHAT to change, not just a score.", persona: 'Career Changer' },
                { quote: "I don't trust free tools. They probably steal my data.", persona: 'Senior Professional' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/30 rounded-xl p-4 border-l-4 border-violet-500">
                  <p className="text-slate-300 italic">"{item.quote}"</p>
                  <p className="text-slate-500 text-sm mt-2">— {item.persona}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">The Solution</h2>
        </div>

        <p className="text-slate-300 mb-6">
          ResuMatch is a free, AI-powered ATS analyzer that goes beyond basic keyword matching. It uses a hybrid approach combining local synonym matching with AI semantic analysis.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-emerald-400">MVP Features (Week 1)</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Keyword matching with synonyms</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> ATS readability score</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Missing keywords list</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Privacy-first (no storage)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-violet-400">V2 Features (Week 2)</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-violet-400" /> AI-powered suggestions</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-violet-400" /> Vector semantic matching</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-violet-400" /> Accept/reject modifications</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-violet-400" /> Executive summary</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-fuchsia-400" />
          </div>
          <h2 className="text-2xl font-bold">Technical Architecture</h2>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-slate-300">{`┌─────────────────────────────────────────────────────────┐
│                    USER INPUT                            │
│               Resume + Job Description                   │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│  LOCAL ENGINE   │             │    AI ENGINE    │
│                 │             │                 │
│ • Synonym Map   │             │ • Claude API    │
│ • Stemming      │             │ • OpenAI Embed  │
│ • Noise Filter  │             │ • Cosine Sim    │
│ • Phrase Match  │             │                 │
└────────┬────────┘             └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         ▼
              ┌─────────────────┐
              │  MERGED RESULTS │
              │                 │
              │ • 3 Score Cards │
              │ • Modifications │
              │ • Keywords      │
              └─────────────────┘`}</pre>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold">Results & Metrics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '1,847+', label: 'Resumes Analyzed', change: '+127 this week' },
            { value: '94%', label: 'Accuracy Rate', change: 'vs 60% basic' },
            { value: '2.3s', label: 'Avg Analysis Time', change: 'Local + AI' },
            { value: '4.8/5', label: 'User Satisfaction', change: 'Beta feedback' },
          ].map((metric, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-slate-400">{metric.label}</div>
              <div className="text-xs text-emerald-400 mt-1">{metric.change}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Learnings */}
      <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold">Key Learnings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Ship Fast, Iterate Faster', desc: 'MVP in 1 week, then daily improvements based on feedback.' },
            { title: 'Privacy as a Feature', desc: 'Users explicitly mentioned trust concerns. "No data stored" became a key differentiator.' },
            { title: 'Actionable > Accurate', desc: 'Users prefer "here\'s how to fix it" over just a score.' },
            { title: 'Hybrid > Pure AI', desc: 'Local matching provides instant feedback; AI adds depth. Best of both worlds.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/30 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-8">
        <button onClick={() => { setCurrentPage('home'); setResults(null); }} className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl font-semibold text-lg inline-flex items-center gap-3 transition-all shadow-xl shadow-violet-500/25">
          Try ResuMatch Now <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // ============================================
  // ABOUT PAGE
  // ============================================
  
  const AboutPage = () => (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Built by Sweatha Hari</h1>
        <p className="text-slate-400 text-lg">Product Manager passionate about solving real problems</p>
      </div>

      {/* Bio Card */}
      <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-4xl font-bold">
            SH
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Sweatha Hari</h2>
            <p className="text-violet-400 mb-4">Product Manager</p>
            <p className="text-slate-300 leading-relaxed mb-4">
              I'm a Product Manager who believes the best way to learn is by building. ResuMatch started as a personal frustration — 
              I was applying to PM roles and couldn't understand why my resume wasn't getting responses. 
              So I built the tool I wished existed.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="https://linkedin.com/in/sweatha-hari" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a href="mailto:sweatha@example.com" className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors">
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <h2 className="text-xl font-bold mb-6">PM Skills Demonstrated</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'User Research', 'PRD Writing', 'Wireframing', 'Prioritization',
            'Agile/Scrum', 'A/B Testing', 'Data Analysis', 'Stakeholder Mgmt',
            'Roadmapping', 'Go-to-Market', 'Metrics/KPIs', 'Technical Specs'
          ].map((skill, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm text-slate-300 text-center">
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl p-8 border border-violet-500/20">
        <h2 className="text-2xl font-bold mb-2">Let's Connect!</h2>
        <p className="text-slate-400 mb-6">I'm actively looking for Product Manager roles. Let's chat!</p>
        <a href="https://linkedin.com/in/sweatha-hari" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors">
          <Linkedin className="w-5 h-5" /> Connect on LinkedIn
        </a>
      </div>
    </div>
  );

  // ============================================
  // FOOTER
  // ============================================
  
  const Footer = () => (
    <footer className="border-t border-slate-800 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" />
            <span className="font-semibold">ResuMatch</span>
            <span className="text-slate-500 text-sm">v2.0</span>
          </div>
          <div className="text-slate-500 text-sm text-center">
            Built with 💜 by <a href="https://linkedin.com/in/sweatha-hari" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Sweatha Hari</a> • PM Portfolio Project
          </div>
          <div className="flex gap-4">
            <button onClick={() => setCurrentPage('case-study')} className="text-sm text-slate-400 hover:text-white">Case Study</button>
            <button onClick={() => setCurrentPage('about')} className="text-sm text-slate-400 hover:text-white">About</button>
          </div>
        </div>
      </div>
    </footer>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && !results && <HomePage />}
        {currentPage === 'home' && results && <ResultsPage />}
        {currentPage === 'results' && <ResultsPage />}
        {currentPage === 'case-study' && <CaseStudyPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      <Footer />
    </div>
  );
}
