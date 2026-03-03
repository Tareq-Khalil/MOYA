import { useState } from 'react'
import { Github, Linkedin, Droplets, Target, Eye, Heart, Mail, Phone, Instagram, X, Code2, ExternalLink } from 'lucide-react'

const team = [
  {
    name: 'Dr. Sarah Al-Hassan',
    role: 'Founder & Water Scientist',
    occupation: 'Environmental Engineer & CEO',
    bio: 'PhD in Environmental Engineering with 12 years of experience in water quality research. Sarah founded WaterWorks after witnessing communities without safe water access. She leads our scientific direction and policy engagement.',
    quote: '"Clean water is not a privilege. It is a right we must fight for with both data and heart."',
    avatar: 'SA',
    gradient: 'from-ocean-500 to-ocean-700',
    accentColor: '#0ea5e9',
    phone: '+20 100 123 4567',
    email: 'sarah@waterworks.eg',
    github: 'sarah-alhassan',
    linkedin: 'sarah-alhassan',
    instagram: 'dr.sarah.water',
    langs: ['Python', 'R', 'MATLAB'],
    interests: ['Water Quality', 'GIS Mapping', 'Community Policy'],
  },
  {
    name: 'Marcus Chen',
    role: 'Lead Developer',
    occupation: 'Full-Stack Software Engineer',
    bio: 'Full-stack engineer passionate about civic technology. Marcus architected the MOYA platform from scratch, building the interactive map, real-time reporting, and game hub systems. Previously built tools for 3 environmental NGOs.',
    quote: '"The best code is code that makes someone\'s life meaningfully better."',
    avatar: 'MC',
    gradient: 'from-teal-500 to-teal-700',
    accentColor: '#14b8a6',
    phone: '+20 100 234 5678',
    email: 'marcus@waterworks.eg',
    github: 'marcus-chen-dev',
    linkedin: 'marcus-chen',
    instagram: 'marcus.codes',
    langs: ['TypeScript', 'React', 'PostgreSQL', 'Python'],
    interests: ['Civic Tech', 'Open Source', 'Performance'],
  },
  {
    name: 'Aisha Nakamura',
    role: 'Community Manager',
    occupation: 'Urban Planner & Community Lead',
    bio: 'Connecting citizens and governments across 8 countries. Aisha manages our volunteer programs, community events, and ensures that the platform is shaped by real community needs rather than assumptions.',
    quote: '"Change happens at the intersection of listening and action."',
    avatar: 'AN',
    gradient: 'from-ocean-600 to-teal-600',
    accentColor: '#0d9488',
    phone: '+20 100 345 6789',
    email: 'aisha@waterworks.eg',
    github: 'aisha-nakamura',
    linkedin: 'aisha-nakamura',
    instagram: 'aisha.builds.bridges',
    langs: ['No-code tools', 'SQL basics'],
    interests: ['Urban Planning', 'Policy', 'Volunteer Management'],
  },
  {
    name: 'Yusuf Okonkwo',
    role: 'Data Analyst',
    occupation: 'Geospatial Data Scientist',
    bio: 'Turning water data into actionable insights for governments and communities. Yusuf specializes in GIS mapping and environmental impact assessment, building the analytics engine behind MOYA\'s interactive reports.',
    quote: '"Numbers don\'t lie — but they need people to ask the right questions."',
    avatar: 'YO',
    gradient: 'from-teal-600 to-ocean-600',
    accentColor: '#0284c7',
    phone: '+20 100 456 7890',
    email: 'yusuf@waterworks.eg',
    github: 'yusuf-data',
    linkedin: 'yusuf-okonkwo',
    instagram: 'yusuf.maps',
    langs: ['Python', 'PostGIS', 'QGIS', 'Tableau'],
    interests: ['Geospatial Analysis', 'Impact Assessment', 'ML'],
  },
]

const values = [
  { icon: Target, title: 'Mission-Driven', description: 'Every feature we build serves one goal: cleaner water for all communities.' },
  { icon: Eye, title: 'Transparency', description: 'Open data, open processes. Citizens deserve to see how their reports are handled.' },
  { icon: Heart, title: 'Community First', description: 'We build with communities, not just for them. Local knowledge drives global solutions.' },
]

function MemberModal({ member, onClose }) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="glass-light rounded-3xl p-7 max-w-lg w-full border border-white/20 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-display text-2xl font-bold shadow-lg`}>
              {member.avatar}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">{member.name}</h2>
              <p style={{ color: member.accentColor }} className="font-medium text-sm">{member.occupation}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-red-500/20 flex-shrink-0">
            <X size={15} className="text-white/60"/>
          </button>
        </div>

        {/* Quote */}
        <div className="glass rounded-2xl p-4 mb-5 border-l-2 italic text-white/70 text-sm leading-relaxed"
          style={{ borderColor: member.accentColor }}>
          {member.quote}
        </div>

        {/* Bio */}
        <p className="text-white/65 text-sm leading-relaxed mb-5">{member.bio}</p>

        {/* Contact */}
        <div className="flex flex-col gap-2 mb-5">
          <h4 className="text-white/50 text-xs font-medium uppercase tracking-wider">Contact</h4>
          {[
            { icon: Mail, label: member.email, href: `mailto:${member.email}` },
            { icon: Phone, label: member.phone, href: `tel:${member.phone}` },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
              <Icon size={14} style={{ color: member.accentColor }}/>{label}
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="flex gap-2 mb-5">
          {member.github && (
            <a href={`https://github.com/${member.github}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-colors">
              <Github size={13}/>GitHub
            </a>
          )}
          {member.linkedin && (
            <a href={`https://linkedin.com/in/${member.linkedin}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-colors">
              <Linkedin size={13}/>LinkedIn
            </a>
          )}
          {member.instagram && (
            <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-colors">
              <Instagram size={13}/>Instagram
            </a>
          )}
        </div>

        {/* Languages */}
        <div className="mb-4">
          <h4 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {member.langs.map(l => (
              <span key={l} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono"
                style={{ background:`${member.accentColor}15`, border:`1px solid ${member.accentColor}30`, color:member.accentColor }}>
                <Code2 size={10}/>{l}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <h4 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Focus Areas</h4>
          <div className="flex flex-wrap gap-2">
            {member.interests.map(i => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50">{i}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MeetUs() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="max-w-5xl mx-auto px-6 text-center mb-20">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
          <Droplets size={14} className="text-ocean-300"/>
          <span className="text-ocean-200 text-sm">The People Behind MOYA</span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
          Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 to-teal-300">Team</span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
          Environmentalists, engineers, and community advocates united by the belief that water
          access is a fundamental human right worth fighting for.
        </p>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card text-center group hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-ocean-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-ocean-500/30 transition-colors">
                <Icon size={26} className="text-ocean-300"/>
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="font-display text-3xl font-bold text-white text-center mb-3">Core Team</h2>
        <p className="text-white/45 text-center text-sm mb-10">Click a card to learn more</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <button key={member.name} onClick={() => setSelected(member)}
              className="card group hover:scale-[1.04] transition-all text-left flex flex-col cursor-pointer hover:border-white/25 border border-transparent">
              {/* Photo placeholder with initials */}
              <div className="relative mb-4">
                <div className={`w-full h-40 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow overflow-hidden`}>
                  {/* If you have real photos, replace this div with <img src={member.photo} ... /> */}
                  <span className="font-display text-5xl font-bold text-white/80 select-none">{member.avatar}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
                </div>
                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={12} className="text-white"/>
                </div>
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-0.5">{member.name}</h3>
              <p style={{ color: member.accentColor }} className="text-xs font-medium mb-3">{member.role}</p>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-2 flex-1">{member.bio}</p>
              <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                {[Github, Linkedin, Instagram].map((Icon, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg glass flex items-center justify-center">
                    <Icon size={12} className="text-white/50"/>
                  </div>
                ))}
                <div className="ml-auto text-[10px] text-white/30 self-center">View profile →</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <div className="card p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-ocean-500/5 rounded-full blur-3xl"/>
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-white/65 leading-relaxed">
              <p>MOYA began in 2022 when Dr. Al-Hassan witnessed a community struggling with contaminated water supply for weeks — not because officials didn't care, but because there was no efficient way to document, track, and escalate these issues.</p>
              <p>We built the first prototype in a weekend hackathon. Within three months, it was being used by 200 families to report flooding, contamination, and leakage. The municipal water authority responded 40% faster than before.</p>
              <p>Today, under WaterWorks, MOYA operates across multiple cities — empowering citizens to become active participants in water management, and rewarding them for their crucial contributions.</p>
            </div>
          </div>
        </div>
      </section>

      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}