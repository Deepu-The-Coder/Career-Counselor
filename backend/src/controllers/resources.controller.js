const LEARNING_RESOURCES = [
  { id: 'swayam', name: 'SWAYAM', type: 'Platform', cost: 'Free', description: 'Government of India MOOCs platform with 1900+ courses from IITs, IIMs, and central universities', url: 'https://swayam.gov.in', careers: ['All'], skills: ['All'], difficulty: 'All', provider: 'Govt of India', badge: 'Government' },
  { id: 'nptel', name: 'NPTEL', type: 'Platform', cost: 'Free', description: 'Technical courses from IITs and IISc. Free with paid certification option', url: 'https://nptel.ac.in', careers: ['Engineering', 'IT', 'Science'], skills: ['Programming', 'Math', 'Engineering'], difficulty: 'Intermediate', provider: 'IIT/IISc', badge: 'Premium Free' },
  { id: 'diksha', name: 'DIKSHA', type: 'App/Platform', cost: 'Free', description: 'National platform for teachers and students with school-level content in multiple Indian languages', url: 'https://diksha.gov.in', careers: ['All School Level'], skills: ['Academic'], difficulty: 'Beginner', provider: 'NCERT/Govt', badge: 'Government' },
  { id: 'pmgdisha', name: 'PMGDISHA', type: 'Course', cost: 'Free', description: 'Pradhan Mantri Gramin Digital Saksharta Abhiyan - Free digital literacy for rural India', url: 'https://www.pmgdisha.in', careers: ['Digital Literacy'], skills: ['Computer Basics', 'Internet', 'Online Safety'], difficulty: 'Beginner', provider: 'Govt of India', badge: 'Government' },
  { id: 'coursera-free', name: 'Coursera (Audit Free)', type: 'Platform', cost: 'Free (Audit)', description: 'World-class courses from top universities. Audit for free, pay only for certificate', url: 'https://www.coursera.org', careers: ['IT', 'Business', 'Data Science'], skills: ['Programming', 'Data Analysis', 'Business'], difficulty: 'All', provider: 'International Universities', badge: 'World Class' },
  { id: 'freecodecamp', name: 'freeCodeCamp', type: 'Platform', cost: 'Free', description: 'Learn web development with hands-on projects. 300+ free certifications', url: 'https://www.freecodecamp.org', careers: ['Web Development', 'Software Developer'], skills: ['HTML', 'CSS', 'JavaScript', 'Python'], difficulty: 'Beginner', provider: 'Non-profit', badge: 'Best for Beginners' },
  { id: 'khan-academy', name: 'Khan Academy', type: 'Platform', cost: 'Free', description: 'Free world-class education for anyone. Math, Science, Computer Science, and more', url: 'https://www.khanacademy.org', careers: ['All'], skills: ['Math', 'Science', 'Programming'], difficulty: 'Beginner', provider: 'Khan Academy', badge: 'Foundation Skills' },
  { id: 'skill-india', name: 'Skill India Digital', type: 'Platform', cost: 'Free', description: 'Government portal for skill development courses. Direct linkage to PMKVY and employment', url: 'https://skillindia.gov.in', careers: ['Vocational', 'Skill Development'], skills: ['Trade Skills', 'Soft Skills'], difficulty: 'Beginner', provider: 'MSDE Govt of India', badge: 'Government' },
  { id: 'youtube-cs', name: 'YouTube Learning Channels', type: 'Video', cost: 'Free', description: 'Channels: CodeWithHarry (Hindi), Apna College, CS50, Traversy Media, TechWorld with Nana', url: 'https://youtube.com', careers: ['IT', 'Programming'], skills: ['Python', 'Java', 'Web Dev'], difficulty: 'Beginner', provider: 'Various', badge: 'Hindi Available' },
  { id: 'internshala', name: 'Internshala Training', type: 'Course + Internship', cost: 'Paid (₹500-2000)', description: 'Affordable skill training with internship placement. Popular for Python, Digital Marketing, Web Dev', url: 'https://internshala.com', careers: ['IT', 'Marketing', 'Design'], skills: ['Python', 'Digital Marketing', 'Web Dev'], difficulty: 'Beginner', provider: 'Internshala', badge: 'Job Focused' },
];

exports.getResources = async (req, res) => {
  try {
    let resources = [...LEARNING_RESOURCES];
    const { career, skill, cost, difficulty, search } = req.query;

    if (career) resources = resources.filter(r => r.careers.some(c => c.toLowerCase().includes(career.toLowerCase())) || r.careers.includes('All'));
    if (skill) resources = resources.filter(r => r.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())) || r.skills.includes('All'));
    if (cost) resources = resources.filter(r => r.cost.toLowerCase().includes(cost.toLowerCase()));
    if (difficulty && difficulty !== 'All') resources = resources.filter(r => r.difficulty === difficulty || r.difficulty === 'All');
    if (search) {
      const q = search.toLowerCase();
      resources = resources.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }

    res.json({ success: true, resources, total: resources.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching resources.' });
  }
};
