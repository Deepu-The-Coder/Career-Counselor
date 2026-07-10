const GOVERNMENT_SCHEMES = [
  {
    id: 'pmkvy',
    name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
    category: 'Skill Development',
    description: 'Free skill training program by Government of India. Get certified in 300+ job roles across sectors like IT, healthcare, construction, agriculture, and more.',
    eligibility: 'Indian citizens aged 15-45 years, 10th/12th dropout or graduate',
    benefits: ['Free skill training', 'Government certificate', 'Job placement assistance', 'Monetary reward up to ₹8,000', 'Recognized certification'],
    documents: ['Aadhaar Card', 'Age Proof', 'Educational Certificate', 'Bank Account', 'Passport Photo'],
    applicationLink: 'https://pmkvyofficial.org',
    officialLink: 'https://www.skillindia.gov.in',
    tags: ['skill', 'free', 'certification', 'employment', 'government'],
    states: 'All India',
    deadline: 'Ongoing',
    type: 'Central Government',
  },
  {
    id: 'nsp',
    name: 'National Scholarship Portal (NSP)',
    category: 'Scholarship',
    description: 'One-stop platform for all central and state government scholarships. Students from rural backgrounds can apply for merit and means-based scholarships.',
    eligibility: 'Students from Class 1 to Post Graduation, Income below ₹2.5 Lakh/year for most schemes',
    benefits: ['Annual scholarship amount varies ₹1,000-₹50,000', 'Direct bank transfer', 'Covers tuition and maintenance', 'Merit and means-based support'],
    documents: ['Aadhaar Card', 'Income Certificate', 'Domicile Certificate', 'Bank Passbook', 'Previous Mark Sheet', 'Caste Certificate (if applicable)'],
    applicationLink: 'https://scholarships.gov.in',
    officialLink: 'https://scholarships.gov.in',
    tags: ['scholarship', 'education', 'financial support', 'students'],
    states: 'All India',
    deadline: 'October 31 every year',
    type: 'Central Government',
  },
  {
    id: 'startup-india',
    name: 'Startup India Scheme',
    category: 'Entrepreneurship',
    description: 'Government initiative to build a strong ecosystem for nurturing innovation and startups in India. Provides tax benefits, funding support, and regulatory ease.',
    eligibility: 'Incorporated startup, turnover < ₹100 crore, < 10 years old, working on innovation',
    benefits: ['Tax exemption for 3 years', 'Patent fee rebate', 'Easy winding up', 'Funding support', 'Mentorship network', 'Government tenders access'],
    documents: ['Company Registration', 'PAN Card', 'Proof of innovation/business concept', 'Bank Account details'],
    applicationLink: 'https://www.startupindia.gov.in',
    officialLink: 'https://www.startupindia.gov.in',
    tags: ['startup', 'entrepreneurship', 'business', 'innovation', 'funding'],
    states: 'All India',
    deadline: 'Ongoing',
    type: 'Central Government',
  },
  {
    id: 'mudra',
    name: 'PM Mudra Yojana (PMMY)',
    category: 'Entrepreneurship',
    description: 'Micro-finance loan scheme for small business owners and entrepreneurs. Provides loans without collateral for starting or expanding micro enterprises.',
    eligibility: 'Indian citizens starting or running micro/small enterprise, Non-corporate/non-farm sector',
    benefits: ['Loans from ₹50,000 to ₹10 Lakh', 'No collateral required', 'Low interest rates', '3 categories: Shishu, Kishore, Tarun'],
    documents: ['Identity Proof', 'Address Proof', 'Business Plan', 'Bank Statements (if existing business)', 'Photo'],
    applicationLink: 'https://www.mudra.org.in',
    officialLink: 'https://www.mudra.org.in',
    tags: ['loan', 'business', 'entrepreneurship', 'micro-finance', 'women'],
    states: 'All India',
    deadline: 'Ongoing',
    type: 'Central Government',
  },
  {
    id: 'naps',
    name: 'National Apprenticeship Promotion Scheme (NAPS)',
    category: 'Apprenticeship',
    description: 'Earn while you learn program. Get on-the-job training with stipend in top companies across India. Government pays 25% of stipend.',
    eligibility: 'Minimum 8th pass, Age 14-21 years for trade apprentice, up to 25 for higher qualification',
    benefits: ['Monthly stipend ₹5,000-₹9,000', 'Practical job training', 'Government-recognized certificate', 'High placement probability'],
    documents: ['Aadhaar Card', 'Educational Certificates', 'Bank Account', 'Medical Fitness Certificate'],
    applicationLink: 'https://www.apprenticeshipindia.gov.in',
    officialLink: 'https://www.apprenticeshipindia.gov.in',
    tags: ['apprenticeship', 'training', 'stipend', 'employment', 'on-job'],
    states: 'All India',
    deadline: 'Ongoing',
    type: 'Central Government',
  },
  {
    id: 'ddu-gky',
    name: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)',
    category: 'Skill Development',
    description: 'Skill training and placement program specifically for rural poor youth. Focuses on creating diversified occupational identities for rural youth.',
    eligibility: 'Rural youth aged 15-35, Below Poverty Line families, MGNREGA workers and their families',
    benefits: ['Free residential skill training', 'Placement guaranteed training', 'Post-placement support', 'Retention and career progression support'],
    documents: ['Aadhaar Card', 'BPL Certificate', 'MGNREGA Job Card (if applicable)', 'Domicile Certificate'],
    applicationLink: 'https://aajeevika.gov.in/content/ddu-gky',
    officialLink: 'https://aajeevika.gov.in',
    tags: ['rural', 'skill', 'bpl', 'employment', 'residential training'],
    states: 'All India (Rural areas)',
    deadline: 'Ongoing',
    type: 'Central Government',
  },
  {
    id: 'pm-yasasvi',
    name: 'PM YASASVI Scholarship',
    category: 'Scholarship',
    description: 'PM Young Achievers Scholarship Award Scheme for Vibrant India. Scholarships for OBC, EBC, and DNT students for Classes 9-12.',
    eligibility: 'OBC/EBC/DNT students in Class 9 or 11, Family income below ₹2.5 Lakh/year',
    benefits: ['₹75,000/year for Class 9-10', '₹1,25,000/year for Class 11-12', 'Direct bank transfer'],
    documents: ['Aadhaar Card', 'Category Certificate', 'Income Certificate', 'Mark Sheet', 'Bank Account'],
    applicationLink: 'https://yet.nta.ac.in',
    officialLink: 'https://yet.nta.ac.in',
    tags: ['scholarship', 'obc', 'ebc', 'school', 'nta'],
    states: 'All India',
    deadline: 'August-September every year',
    type: 'Central Government',
  },
  {
    id: 'agri-infra-fund',
    name: 'Agriculture Infrastructure Fund (AIF)',
    category: 'Agriculture',
    description: 'Financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    eligibility: 'Farmers, FPOs, PACS, SHGs, Agri-entrepreneurs, Central/State agency entities',
    benefits: ['Loans up to ₹2 crore', '3% interest subvention', 'Credit guarantee', 'Moratorium period'],
    documents: ['Identity Proof', 'Land Documents', 'Project Report', 'Bank Account', 'Registration Certificate (if entity)'],
    applicationLink: 'https://agriinfra.dac.gov.in',
    officialLink: 'https://agriinfra.dac.gov.in',
    tags: ['agriculture', 'farming', 'agritech', 'loan', 'startup'],
    states: 'All India',
    deadline: 'Ongoing (till 2025-26)',
    type: 'Central Government',
  },
];

exports.getSchemes = async (req, res) => {
  try {
    let schemes = [...GOVERNMENT_SCHEMES];
    const { category, search, tags } = req.query;

    if (category) {
      schemes = schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      schemes = schemes.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    }
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      schemes = schemes.filter(s => tagList.some(t => s.tags.includes(t)));
    }

    const categories = [...new Set(GOVERNMENT_SCHEMES.map(s => s.category))];
    res.json({ success: true, schemes, total: schemes.length, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching schemes.' });
  }
};

exports.getScheme = async (req, res) => {
  try {
    const scheme = GOVERNMENT_SCHEMES.find(s => s.id === req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching scheme.' });
  }
};
