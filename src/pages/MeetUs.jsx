import { Github, Twitter, Linkedin, Droplets, Target, Eye, Heart } from 'lucide-react'

const team = [
  {
    name: 'Tareq Khalil',
    role: 'CEO (Chief Executive Officer)',    
    bio: 'Leads company vision, strategy, partnerships, investor relations, and overall business development.',
    avatar: 'TQ',
    color: 'from-ocean-500 to-ocean-700'
  },
    {
    name: 'Mohamed El-Shamy',
    role: 'CTO (Chief Technical Officer)',
    bio: 'Oversees system architecture, platform development, security, and technical roadmap.',
    avatar: 'ME',
    color: 'from-teal-600 to-ocean-600'
  },
  
  {
    name: 'Kevin Martin',
    role: 'CMO (Chief Marketing Officer)',
    bio: 'Manages branding, digital campaigns, content strategy, partnerships, and user acquisition.',
    avatar: 'KM',
    color: 'from-ocean-600 to-teal-600'
  },
  {
    name: 'Daniel George',
    role: 'Game Developer',
    bio: 'Designs educational gameplay mechanics, user engagement flows, and gamification strategy.',
    avatar: 'DG',
    color: 'from-teal-500 to-teal-700'
  },
  {
    name: 'Asser El-Sergany',
    role: 'Graphic Designer - GD',
    bio: 'Designs all visual content, branding materials, and marketing graphics.',
    avatar: 'AS',
    color: 'from-teal-600 to-ocean-600'
  },
  {
    name: 'Yousef Ahmed',
    role: 'CCO (Chief Communications Officer)',
    bio: 'Manages company image, media relations, partnerships, and public communication.',
    avatar: 'YA',
    color: 'from-teal-500 to-ocean-500'
  },

  {
    name: 'Loay Alaa',
    role: 'Slave to the CIO',
    bio: 'Oversees budgeting, financial planning, accounting, and investor reporting.',
    avatar: 'LA',
    color: 'from-ocean-500 to-teal-500'
  },
  {
    name: 'Amro Ibrahim',
    role: 'CIO (Chief Information Officer)',
    bio: 'Leads IT strategy, systems, data management, and cybersecurity.',
    avatar: 'AI',
    color: 'from-ocean-600 to-teal-600'
  }
]

const supervisor = {
  name: 'Dr. Mohamed Gamal',
  role: 'Project Supervisor',
  bio: 'Senior environmental strategist guiding the MOYA initiative and mentoring the team throughout research, validation, and deployment phases.',
  avatar: 'MG',
  color: 'from-purple-500 to-indigo-600'
}

const values = [
  { icon: Target, title: 'Mission-Driven', description: 'Every feature we build serves one goal: cleaner water for all communities.' },
  { icon: Eye, title: 'Transparency', description: 'Open data, open processes. Citizens deserve to see how their reports are handled.' },
  { icon: Heart, title: 'Community First', description: 'We build with communities, not just for them. Local knowledge drives global solutions.' },
]

export default function MeetUs() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-24">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
          <Droplets size={14} className="text-ocean-300" />
          <span className="text-ocean-200 text-sm">The People Behind MOYA</span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
          Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 to-teal-300">Team</span>
        </h1>

        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
          We're a group of environmentalists, engineers, and advocates united by a belief
          that water access is a fundamental human right.
        </p>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card text-center group hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-ocean-500/20 flex items-center justify-center mx-auto mb-4">
                <Icon size={26} className="text-ocean-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Team */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
          Core Team
        </h2>

        {/* 3 per row */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="card group hover:scale-[1.03] transition-all flex flex-col">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-4 text-white font-display text-xl font-bold shadow-lg`}>
                {member.avatar}
              </div>

              <h3 className="font-display font-semibold text-white text-center text-lg mb-1">
                {member.name}
              </h3>

              <p className="text-ocean-300 text-sm text-center mb-3 font-medium">
                {member.role}
              </p>

              <p className="text-white/55 text-sm text-center leading-relaxed flex-1">
                {member.bio}
              </p>

              <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/10">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-ocean-500/30 transition-colors">
                    <Icon size={14} className="text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Supervisor Centered */}
        <div className="flex justify-center mt-16">
          <div className="w-full max-w-md">
            <div className="card group hover:scale-[1.03] transition-all flex flex-col text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${supervisor.color} flex items-center justify-center mx-auto mb-5 text-white font-display text-2xl font-bold shadow-lg`}>
                {supervisor.avatar}
              </div>

              <h3 className="font-display font-bold text-white text-xl mb-1">
                {supervisor.name}
              </h3>

              <p className="text-purple-300 text-sm mb-3 font-semibold">
                {supervisor.role}
              </p>

              <p className="text-white/60 text-sm leading-relaxed">
                {supervisor.bio}
              </p>

              <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/10">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                    <Icon size={14} className="text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  )
}
