import type { QuickAction, ServicePath, ServiceSlug } from './types';

export const quickActions: QuickAction[] = [
  {
    id: 'quote',
    icon: 'ClipboardList',
    label: 'Get a Quote',
    description: 'Answer 5 quick questions',
  },
  {
    id: 'services',
    icon: 'Briefcase',
    label: 'Explore Services',
    description: 'See what we offer',
  },
  {
    id: 'freeform',
    icon: 'MessageCircle',
    label: 'Ask a Question',
    description: 'Chat with our AI',
  },
  {
    id: 'contact',
    icon: 'Mail',
    label: 'Contact Us',
    description: 'Go to contact page',
  },
];

export const servicePaths: Record<ServiceSlug, ServicePath> = {
  'ai-strategy': {
    slug: 'ai-strategy',
    title: 'AI Strategy Advisory',
    questions: [
      'What AI initiatives, if any, are currently underway in your organisation?',
      'What are your key strategic priorities for the next 12-18 months?',
      'What is your timeline for making decisions about AI investment?',
    ],
    context: 'board-level AI strategy and roadmap development',
  },
  'board-education': {
    slug: 'board-education',
    title: 'Board Education',
    questions: [
      'How would you describe your board\'s current familiarity with AI capabilities and limitations?',
      'What are the primary concerns or questions your board has about AI?',
      'What format works best for your board (workshops, presentations, Q&A sessions)?',
    ],
    context: 'executive AI literacy programmes',
  },
  'readiness-assessment': {
    slug: 'readiness-assessment',
    title: 'AI Readiness Assessment',
    questions: [
      'How would you describe your current data infrastructure and quality?',
      'What technical capabilities does your team currently have?',
      'How does your organisation typically handle change management?',
    ],
    context: 'organisational AI maturity evaluation',
  },
  'implementation-oversight': {
    slug: 'implementation-oversight',
    title: 'Implementation Oversight',
    questions: [
      'What AI projects are you currently implementing or planning?',
      'What challenges have you encountered so far?',
      'How are you measuring success for these projects?',
    ],
    context: 'AI project execution guidance',
  },
  'vendor-evaluation': {
    slug: 'vendor-evaluation',
    title: 'Vendor Evaluation',
    questions: [
      'What AI solutions or vendors are you currently evaluating?',
      'What criteria are most important in your vendor selection?',
      'What systems would the AI solution need to integrate with?',
    ],
    context: 'AI vendor and solution assessment',
  },
  'risk-governance': {
    slug: 'risk-governance',
    title: 'Risk & Governance',
    questions: [
      'What regulatory requirements apply to your industry regarding AI?',
      'Do you have existing AI governance policies in place?',
      'What is your organisation\'s risk tolerance for AI adoption?',
    ],
    context: 'AI ethics, compliance, and governance',
  },
};

// Generic quote questions (5-question flow)
export const quoteQuestions = [
  'What business challenge are you looking to address with AI?',
  'What does success look like for this initiative?',
  'What is your ideal timeline for moving forward?',
  'Have you allocated budget for this initiative?',
  'What, if any, AI initiatives have you undertaken before?',
];
