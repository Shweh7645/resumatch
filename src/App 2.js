import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Zap, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const extractKeywords = (text) => {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once', 'if', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'while', 'about', 'against', 'your', 'our', 'their', 'its', 'my', 'his', 'her', 'up', 'down', 'out', 'off', 'over', 'any', 'well', 'years', 'year', 'experience', 'work', 'working', 'team', 'ability', 'strong', 'excellent', 'proven', 'demonstrated', 'responsible', 'responsibilities']);
  
  const words = text.toLowerCase()
    .replace(/[^a-zA-Z0-9\s\+\#\.]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  const phrases = [];
  const techTerms = ['machine learning', 'data science', 'project management', 'product management', 'user experience', 'user interface', 'full stack', 'front end', 'back end', 'cloud computing', 'data analysis', 'business analysis', 'agile methodology', 'scrum master', 'product owner', 'customer success', 'account management', 'sales operations', 'digital marketing', 'content marketing', 'social media', 'search engine', 'quality assurance', 'software development', 'web development', 'mobile development', 'cross functional', 'stakeholder management', 'sprint planning', 'product roadmap', 'go to market', 'key performance', 'return on investment'];
  
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
  const hardSkills = ['python', 'javascript', 'react', 'node', 'sql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'java', 'c++', 'excel', 'tableau', 'power bi', 'jira', 'confluence', 'figma', 'sketch', 'photoshop', 'salesforce', 'hubspot', 'google analytics', 'seo', 'html', 'css', 'git', 'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'mysql', 'redis', 'kafka', 'spark', 'hadoop', 'tensorflow', 'pytorch', 'scikit', 'pandas', 'numpy', 'r', 'stata', 'spss', 'matlab', 'sas', 'typescript', 'vue', 'angular', 'swift', 'kotlin', 'flutter', 'react native', 'jenkins', 'terraform', 'ansible', 'linux', 'unix', 'postman', 'selenium', 'cypress', 'jest', 'mocha', 'webpack', 'npm', 'yarn', 'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd', 'microservices', 'serverless', 'blockchain', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science', 'data engineering', 'etl', 'data warehouse', 'snowflake', 'databricks', 'looker', 'dbt', 'airflow', 'prds', 'user stories', 'acceptance criteria', 'roadmapping', 'wireframing', 'prototyping', 'a/b testing', 'sql server', 'oracle', 'sap'];
  
  const softSkills = ['leadership', 'communication', 'collaboration', 'teamwork', 'problem solving', 'analytical', 'creative', 'strategic', 'innovative', 'adaptable', 'flexible', 'organized', 'detail oriented', 'self motivated', 'proactive', 'reliable', 'dependable', 'interpersonal', 'negotiation', 'presentation', 'mentoring', 'coaching', 'decision making', 'time management', 'prioritization', 'multitasking', 'customer focused', 'results driven', 'goal oriented', 'critical thinking', 'emotional intelligence', 'conflict resolution', 'stakeholder', 'cross functional'];
  
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

const analyzeResume = (resumeText, jdText) => {
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
  
  const hardSkillWeight = 0.6;
  const softSkillWeight = 0.3;
  const generalWeight = 0.1;
  
  const jdHardSkills = categorizeSkills(jdWords).hard;
  const jdSoftSkills = categorizeSkills(jdWords).soft;
  
  const hardScore = jdHardSkills.length > 0 ? (categorizedMatched.hard.length / Math.max(jdHardSkills.length, 1)) * 100 : 100;
  const softScore = jdSoftSkills.length > 0 ? (categorizedMatched.soft.length / Math.max(jdSoftSkills.length, 1)) * 100 : 100;
  const generalScore = jdWords.length > 0 ? (matched.length / jdWords.length) * 100 : 0;
  
  const overallScore = Math.min(100, Math.round(
    (hardScore * hardSkillWeight) + 
    (softScore * softSkillWeight) + 
    (generalScore * generalWeight)
  ));
  
  return {
    score: overallScore,
    matched: [...new Set(matched)].slice(0, 20),
    missing: [...new Set(missing)].slice(0, 15),
    hardSkillsMissing: [...new Set(categorizedMissing.hard)].slice(0, 10),
    softSkillsMissing: [...new Set(categorizedMissing.soft)].slice(0, 5),
    hardSkillsMatched: [...new Set(categorizedMatched.hard)],
    softSkillsMatched: [...new Set(categorizedMatched.soft)],
    totalJdKeywords: jdWords.length,
    matchedCount: matched.length
  };
};

const checkFormatting = (text) => {
  const issues = [];
  const passed = [];
  
  const hasEmail = /\b[\w.-]+@[\w.-]+\.\w+\b/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  
  if (hasEmail) passed.push('Email address detected');
  else issues.push({ type: 'warning', text: 'No email address found' });
  
  if (hasPhone) passed.push('Phone number detected');
  else issues.push({ type: 'warning', text: 'No phone number found' });
  
  if (hasLinkedIn) passed.push('LinkedIn profile included');
  else issues.push({ type: 'info', text: 'Consider adding LinkedIn profile URL' });
  
  const hasNumbers = /\d+%|\$[\d,]+|\d+\+|\d+ years?/i.test(text);
  if (hasNumbers) passed.push('Quantified achievements found');
  else issues.push({ type: 'warning', text: 'Add numbers to quantify your achievements (e.g., "increased sales by 25%")' });
  
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'increased', 'reduced', 'improved', 'designed', 'launched', 'built', 'achieved', 'delivered', 'drove', 'executed', 'established', 'generated', 'grew', 'initiated', 'optimized', 'spearheaded', 'streamlined', 'transformed'];
  const hasActionVerbs = actionVerbs.some(verb => text.toLowerCase().includes(verb));
  if (hasActionVerbs) passed.push('Strong action verbs used');
  else issues.push({ type: 'warning', text: 'Use strong action verbs (led, managed, developed, etc.)' });
  
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) issues.push({ type: 'warning', text: 'Resume seems too short. Aim for 400-800 words.' });
  else if (wordCount > 1000) issues.push({ type: 'info', text: 'Resume may be too long. Consider condensing to 1-2 pages.' });
  else passed.push('Appropriate resume length');
  
  const hasSections = /experience|education|skills|summary|objective/i.test(text);
  if (hasSections) passed.push('Standard sections detected');
  else issues.push({ type: 'error', text: 'Missing standard sections (Experience, Education, Skills)' });
  
  return { issues, passed };
};

const generateRecommendations = (analysis, formatting) => {
  const recommendations = [];
  
  if (analysis.score < 50) {
    recommendations.push({
      priority: 'high',
      title: 'Critical: Low Keyword Match',
      description: 'Your resume matches less than 50% of job requirements. Add missing hard skills to your experience section.'
    });
  }
  
  if (analysis.hardSkillsMissing.length > 3) {
    recommendations.push({
      priority: 'high',
      title: 'Add Technical Skills',
      description: `Include these missing skills if you have them: ${analysis.hardSkillsMissing.slice(0, 5).join(', ')}`
    });
  }
  
  if (analysis.softSkillsMissing.length > 2) {
    recommendations.push({
      priority: 'medium',
      title: 'Demonstrate Soft Skills',
      description: `Show these qualities through your achievements: ${analysis.softSkillsMissing.slice(0, 3).join(', ')}`
    });
  }
  
  formatting.issues.filter(i => i.type === 'error' || i.type === 'warning').forEach(issue => {
    recommendations.push({
      priority: issue.type === 'error' ? 'high' : 'medium',
      title: 'Formatting Issue',
      description: issue.text
    });
  });
  
  if (analysis.score >= 70 && analysis.score < 85) {
    recommendations.push({
      priority: 'low',
      title: 'Fine-tune for Higher Match',
      description: 'You\'re close! Mirror exact phrases from the job description where applicable.'
    });
  }
  
  if (analysis.score >= 85) {
    recommendations.push({
      priority: 'low',
      title: 'Great Match!',
      description: 'Your resume is well-aligned. Focus on tailoring your cover letter now.'
    });
  }
  
  return recommendations;
};

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('score');
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [showAllMatched, setShowAllMatched] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (!resumeText.trim() || !jdText.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = analyzeResume(resumeText, jdText);
      const formatting = checkFormatting(resumeText);
      const recommendations = generateRecommendations(analysis, formatting);
      
      setResults({ analysis, formatting, recommendations });
      setIsAnalyzing(false);
      setActiveTab('score');
    }, 1500);
  }, [resumeText, jdText]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 85) return 'Excellent match! Your resume is highly aligned with this job.';
    if (score >= 70) return 'Good match. A few tweaks could improve your chances.';
    if (score >= 50) return 'Moderate match. Consider adding more relevant keywords.';
    return 'Low match. Significant optimization needed for this role.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">ResuMatch</h1>
              <p className="text-xs text-slate-400">ATS Resume Optimizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">Free • 10 scans/month</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!results ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Beat the ATS. Land More Interviews.</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                78% of resumes are rejected by Applicant Tracking Systems before a human sees them. 
                Paste your resume and the job description to see your match score.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <h3 className="font-semibold">Your Resume</h3>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {resumeText.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-fuchsia-400" />
                  <h3 className="font-semibold">Job Description</h3>
                </div>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {jdText.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!resumeText.trim() || !jdText.trim() || isAnalyzing}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-slate-600 disabled:to-slate-600 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Match
                  </>
                )}
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-12">
              {[
                { icon: Target, title: 'Keyword Analysis', desc: 'Find missing skills & keywords' },
                { icon: CheckCircle, title: 'Format Check', desc: 'Ensure ATS compatibility' },
                { icon: TrendingUp, title: 'Actionable Tips', desc: 'Improve your match score' },
              ].map((feature, i) => (
                <div key={i} className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30 text-center">
                  <feature.icon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setResults(null)}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-2"
            >
              ← Analyze another resume
            </button>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-8 border border-slate-700/50">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80" cy="80" r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="80" cy="80" r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * results.analysis.score) / 100}
                      strokeLinecap="round"
                      className={getScoreColor(results.analysis.score)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(results.analysis.score)}`}>
                      {results.analysis.score}%
                    </span>
                    <span className="text-sm text-slate-400">Match Score</span>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">
                    {results.analysis.score >= 80 ? '🎉 Great Match!' : 
                     results.analysis.score >= 60 ? '👍 Good Start' : 
                     '⚠️ Needs Work'}
                  </h3>
                  <p className="text-slate-400 mb-4">{getScoreMessage(results.analysis.score)}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
                      <span className="text-emerald-400 font-semibold">{results.analysis.matchedCount}</span>
                      <span className="text-slate-400 text-sm ml-1">keywords matched</span>
                    </div>
                    <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
                      <span className="text-amber-400 font-semibold">{results.analysis.missing.length}</span>
                      <span className="text-slate-400 text-sm ml-1">keywords missing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-b border-slate-700">
              {['score', 'keywords', 'format', 'tips'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium capitalize transition-colors ${
                    activeTab === tab 
                      ? 'text-violet-400 border-b-2 border-violet-400' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'tips' ? 'Recommendations' : tab}
                </button>
              ))}
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              {activeTab === 'score' && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg">Score Breakdown</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400">Hard Skills</span>
                        <span className="font-semibold text-emerald-400">
                          {results.analysis.hardSkillsMatched.length} matched
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {results.analysis.hardSkillsMatched.slice(0, 8).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400">Soft Skills</span>
                        <span className="font-semibold text-emerald-400">
                          {results.analysis.softSkillsMatched.length} matched
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {results.analysis.softSkillsMatched.slice(0, 6).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'keywords' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        Missing Keywords
                      </h4>
                      <span className="text-sm text-slate-400">{results.analysis.missing.length} total</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(showAllMissing ? results.analysis.missing : results.analysis.missing.slice(0, 10)).map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm border border-red-500/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                    {results.analysis.missing.length > 10 && (
                      <button 
                        onClick={() => setShowAllMissing(!showAllMissing)}
                        className="mt-3 text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        {showAllMissing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showAllMissing ? 'Show less' : `Show ${results.analysis.missing.length - 10} more`}
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        Matched Keywords
                      </h4>
                      <span className="text-sm text-slate-400">{results.analysis.matched.length} total</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(showAllMatched ? results.analysis.matched : results.analysis.matched.slice(0, 10)).map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm border border-emerald-500/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                    {results.analysis.matched.length > 10 && (
                      <button 
                        onClick={() => setShowAllMatched(!showAllMatched)}
                        className="mt-3 text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        {showAllMatched ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showAllMatched ? 'Show less' : `Show ${results.analysis.matched.length - 10} more`}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'format' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">ATS Compatibility Check</h4>
                  <div className="space-y-3">
                    {results.formatting.passed.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-emerald-300">{item}</span>
                      </div>
                    ))}
                    {results.formatting.issues.map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
                        item.type === 'error' ? 'bg-red-500/10 border-red-500/20' :
                        item.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                        'bg-blue-500/10 border-blue-500/20'
                      }`}>
                        {item.type === 'error' ? <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" /> :
                         item.type === 'warning' ? <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" /> :
                         <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                        <span className={
                          item.type === 'error' ? 'text-red-300' :
                          item.type === 'warning' ? 'text-amber-300' :
                          'text-blue-300'
                        }>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">How to Improve Your Score</h4>
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${
                      rec.priority === 'high' ? 'bg-red-500/10 border-red-500/30' :
                      rec.priority === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-emerald-500/10 border-emerald-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                          rec.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                          rec.priority === 'medium' ? 'bg-amber-500/30 text-amber-300' :
                          'bg-emerald-500/30 text-emerald-300'
                        }`}>
                          {rec.priority}
                        </span>
                        <h5 className="font-semibold">{rec.title}</h5>
                      </div>
                      <p className="text-slate-300 text-sm">{rec.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>ResuMatch — A Product Management Portfolio Project by Sweatha Hari</p>
          <p className="mt-1">Built to demonstrate end-to-end product development skills</p>
        </div>
      </footer>
    </div>
  );
}