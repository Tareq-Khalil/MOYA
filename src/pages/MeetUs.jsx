import { useState } from 'react'
import { Github, Twitter, Youtube, Linkedin, Droplets, Target, Eye, Heart, X, Code2, Quote, Sparkles, ChevronRight, Users, Mail, Phone } from 'lucide-react'

const team = [
  {
    name: 'Tareq Khalil',
    role: 'CEO',
    roleLabel: 'Chief Executive Officer',
    jobDesc: 'Leads company vision, strategy, partnerships, investor relations, and overall business development.',
    bio: '',
    quote: 'The more you understand this world, the more you destroy yourself. That\'s why fools are happy, and intelligent peoepl live in loneliness.',
    avatar: 'TQ',
    photo: 'https://i.ibb.co/BVvWX7jV/tareqkhalil.png',
    accent: '#0ea5e9',
    favLang: 'Javascript, Python, Typescript, Markdown',
    extra: { label: 'Fun Fact', value: '' },
    email: 'tareqkhalil1415@gmail.com',
    phone: '+201012439278',
    socials: { twitter: 'https://x.com/Tareq_Khalil281', github: 'https://github.com/Tareq-Khalil', linkedin: 'https://www.linkedin.com/in/tareq-abdellatif-9b34502b4/' }
  },
  {
    name: 'Mohamed El-Shamy',
    role: 'CTO',
    roleLabel: 'Chief Technical Officer',
    jobDesc: 'Oversees system architecture, platform development, security, and the technical roadmap.',
    bio: '',
    quote: 'Good architecture is invisible — until it breaks.',
    avatar: 'ME',
    photo: '',
    color: 'from-teal-600 to-ocean-600',
    accent: '#14b8a6',
    favLang: 'TypeScript',
    extra: { label: 'Stack', value: 'React, Supabase, Node.js, PostGIS' },
    email: '', 
    phone: '', 
    socials: { twitter: '#', github: '#', linkedin: '#' }
  },
  {
    name: 'Kevin Martin',
    role: 'CMO',
    roleLabel: 'Chief Marketing Officer',
    jobDesc: 'Manages branding, digital campaigns, content strategy, partnerships, and user acquisition.',
    bio:'',
    quote: '',
    avatar: 'KM',
    photo: 'https://i.ibb.co/FLXk4b4M/Kevin-Martin.jpg', 
    color: 'from-ocean-600 to-teal-600',
    accent: '#38bdf8',
    favLang: 'HTML, CSS',
    extra: { label: '', value: '' },
    email: 'Kevinmartinmicheal@gmail.com', 
    phone: '+201129835557', 
    socials: { twitter: '#', github: '#', linkedin: 'https://www.linkedin.com/in/kevin-martin-995b7b32a?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
  },
  {
    name: 'Daniel George',
    role: 'Game Developer',
    roleLabel: 'Game Developer',
    jobDesc: 'Designs educational gameplay mechanics, user engagement flows, and gamification strategy.',
    bio: 'Artist by day, programmer by night, otaku by heart.',
    quote: 'A life that lives without doing anything is the same as a slow death.',
    avatar: 'DG',
    photo: 'https://i.ibb.co/DDHN5GjS/Daniel-George.png', 
    color: 'from-teal-500 to-teal-700',
    accent: '#2dd4bf',
    favLang: 'Python, GDscript, & Assembly',
    extra: { label: '', value: '' },
    email: 'danielgeorgewadea@gmail.com', 
    phone: '+201227298840', 
    socials: { Youtube: 'https://www.youtube.com/@Daniel-Geo123', github: ' https://github.com/daniel-geo', linkedin: '#' }
  },
  {
    name: 'Asser ElSergany',
    role: 'GD',
    roleLabel: 'Graphic Designer',
    jobDesc: 'Designs all visual content, branding materials, and marketing graphics.',
    bio: 'Graphic Designer & Music Enthusiast',
    quote: 'There are no two words in the English language more harmful than "good job".',
    avatar: 'AS',
    photo: 'https://i.ibb.co/S49XXB20/Asser-El-Sergany.png', 
    color: 'from-teal-600 to-ocean-600',
    accent: '#5eead4',
    favLang: 'C++, HTML, CSS, JS.',
    extra: { label: '', value: '' },
    email: 'asserelsergany@gmail.com', 
    phone: '+201007974552', 
    socials: { twitter: 'https://x.com/AsSergany', github: 'https://github.com/AsserElSergany', linkedin: 'https://www.linkedin.com/in/asser-elsergany-917626351?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
  },
  {
    name: 'Yousef Ahmed',
    role: 'CCO',
    roleLabel: 'Chief Communications Officer',
    jobDesc: 'Manages company image, media relations, partnerships, and public communication.',
    bio: '',
    quote: 'Clarity of message is as important as clarity of water.',
    avatar: 'YA',
    photo: '', 
    color: 'from-teal-500 to-ocean-500',
    accent: '#0ea5e9',
    favLang: 'Markdown',
    extra: { label: 'Languages', value: 'Arabic, English, French' },
    email: '', 
    phone: '', 
    socials: { twitter: '#', github: '#', linkedin: '#' }
  },
  {
    name: 'Loay Alaa',
    role: 'CFO',
    roleLabel: 'Chief Financial Officer',
    jobDesc: 'Oversees budgeting, financial planning, accounting, and investor reporting.',
    bio: 'I am the slave of DsMans0021. I always obey him. You can meet my master on https://github.com/DsMans0021.',
    quote: 'The world sees chains; I feel only your embrace. The world sees pain; I know only your love. To be your submissive is my identity, to be your masochist is my ecstasy. In your ownership, I have finally found myself.',
    avatar: 'LA',
    photo: 'https://gifdb.com/images/high/slave-498-x-280-gif-8u5o88chz48x7jpp.gif', 
    color: 'from-ocean-500 to-teal-500',
    accent: '#14b8a6',
    favLang: 'Master\'s beating',
    extra: { label: 'Traits', value: 'Masochist, Submissive, Master\s Obsession' },
    email: '', 
    phone: '', 
    socials: { twitter: '#', github: '#', linkedin: '#' }
  },
  {
    name: 'Amro Ibrahim',
    role: 'CIO',
    roleLabel: 'Chief Information Officer',
    jobDesc: 'Leads IT strategy, systems, data management, and cybersecurity.',
    bio: '',
    quote: 'Data is only as clean as the systems that hold it.',
    avatar: 'AI',
    photo: '', 
    color: 'from-ocean-600 to-teal-600',
    accent: '#38bdf8',
    favLang: 'Go',
    extra: { label: 'Specialty', value: 'Cybersecurity & distributed data systems' },
    email: '', 
    phone: '', 
    socials: { twitter: '#', github: '#', linkedin: '#' }
  }
]

const supervisor = {
  name: 'Dr. Mohamed Gamal',
  role: 'Supervisor',
  roleLabel: 'Project Supervisor',
  jobDesc: 'Senior environmental strategist guiding the MOYA initiative through research, validation, and deployment.',
  bio: '',
  quote: 'The next generation of water stewards is already building the tools we need.',
  avatar: 'MG',
  photo: 'https://i.ibb.co/d0L3NnsQ/supervisor.png',
  color: 'from-violet-500 to-indigo-600',
  accent: '#a78bfa',
  favLang: 'R / MATLAB',
  extra: { label: 'Expertise', value: 'Environmental policy, hydrology, water governance' },
  email: 'm7maadgamal112001@gmail.com',
  phone: '+20 11 11077227',
  socials: { twitter: '#', github: '#', linkedin: '#' }
}

const values = [
  { icon: Target, title: 'Mission-Driven', description: 'Every feature we build serves one goal: cleaner water for all communities.', accent: '#0ea5e9' },
  { icon: Eye, title: 'Transparency', description: 'Open data, open processes. Citizens deserve to see how their reports are handled.', accent: '#14b8a6' },
  { icon: Heart, title: 'Community First', description: 'We build with communities, not just for them. Local knowledge drives global solutions.', accent: '#f43f5e' },
]

function Avatar({ member, size = 'md' }) {
  const sizes = { sm: 'w-12 h-12 text-sm', md: 'w-16 h-16 text-lg', lg: 'w-24 h-24 text-2xl', xl: 'w-32 h-32 text-3xl' }
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        className={`${sizes[size]} rounded-2xl object-cover flex-shrink-0`}
        style={{ boxShadow: `0 0 24px ${member.accent}40` }}
      />
    )
  }
  return (
    <div
      className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ boxShadow: `0 0 24px ${member.accent}40` }}
    >
      {member.avatar}
    </div>
  )
}

function MemberModal({ member, onClose }) {
  if (!member) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <div
        className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(5,32,52,0.99) 0%, rgba(8,55,82,0.98) 100%)',
          border: `1px solid ${member.accent}25`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 60px ${member.accent}12, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${member.accent}00 0%, ${member.accent} 35%, #14b8a6 65%, ${member.accent}00 100%)` }} />

        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-[0.07] pointer-events-none" style={{ background: member.accent }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl opacity-[0.05] pointer-events-none" style={{ background: '#14b8a6' }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          <X size={15} />
        </button>

        <div className="grid grid-cols-[188px_1fr]">

          <div className="flex flex-col items-center pt-8 px-5 pb-6 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="relative mb-5">
              <Avatar member={member} size="xl" />
              <div className="absolute -inset-[3px] rounded-[18px] pointer-events-none"
                style={{ boxShadow: `0 0 0 1.5px ${member.accent}55, 0 0 24px ${member.accent}30` }} />
            </div>

            <div className="inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-[0.15em] uppercase mb-2 text-center"
              style={{ background: `${member.accent}1a`, color: member.accent, border: `1px solid ${member.accent}40` }}>
              {member.role}
            </div>

            <h2 className="font-display font-bold text-white text-base text-center leading-snug mb-0.5">{member.name}</h2>
            <p className="text-white/30 text-[11px] text-center mb-5 leading-snug">{member.roleLabel}</p>

            <div className="flex gap-2 mb-5">
              {[
                { Icon: Twitter, href: member.socials.twitter },
                { Icon: Github, href: member.socials.github },
                { Icon: Linkedin, href: member.socials.linkedin },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: `${member.accent}18`, border: `1px solid ${member.accent}35` }}>
                  <Icon size={13} style={{ color: member.accent }} />
                </a>
              ))}
            </div>

            {(member.email || member.phone) && (
              <div className="w-full flex flex-col gap-2">
                {member.email && (
                  <a href={`mailto:${member.email}`}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all group"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                    <Mail size={12} style={{ color: member.accent }} className="flex-shrink-0" />
                    <span className="text-white/40 text-[11px] truncate group-hover:text-white/65 transition-colors">{member.email}</span>
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all group"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                    <Phone size={12} style={{ color: member.accent }} className="flex-shrink-0" />
                    <span className="text-white/40 text-[11px] group-hover:text-white/65 transition-colors">{member.phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-7 overflow-y-auto" style={{ maxHeight: '520px' }}>

            <div className="relative rounded-2xl px-5 pt-5 pb-4 overflow-hidden"
              style={{ background: `${member.accent}0a`, border: `1px solid ${member.accent}1f` }}>
              <Quote size={32} className="absolute -top-1 -left-1 opacity-[0.08]" style={{ color: member.accent }} />
              <p className="text-white/65 text-sm italic leading-relaxed">{member.quote}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: member.accent }}>About</p>
              <p className="text-white/50 text-sm leading-relaxed">{member.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 size={12} style={{ color: member.accent }} />
                  <span className="text-white/25 text-[10px] uppercase tracking-widest">Fav Languages</span>
                </div>
                <p className="text-white font-bold text-sm">{member.favLang}</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} style={{ color: member.accent }} />
                  <span className="text-white/25 text-[10px] uppercase tracking-widest">{member.extra.label}</span>
                </div>
                <p className="text-white font-bold text-sm leading-snug">{member.extra.value}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function MemberCard({ member, onClick }) {
  return (
    <button
      onClick={() => onClick(member)}
      className="group relative text-left w-full rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = `${member.accent}50`
        e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 40px ${member.accent}15`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)'
      }}
    >
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${member.accent}90, transparent)` }} />

      <div className="relative pt-8 pb-4 px-6 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none"
          style={{ background: member.accent }} />

        <div className="relative mb-4 z-10">
          <Avatar member={member} size="lg" />
        </div>

        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 z-10"
          style={{ background: `${member.accent}18`, color: member.accent, border: `1px solid ${member.accent}35` }}>
          {member.role}
        </div>

        <h3 className="font-display font-bold text-white text-lg leading-tight mb-0.5 z-10">{member.name}</h3>
        <p className="text-white/30 text-xs mb-3 z-10">{member.roleLabel}</p>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 max-w-[210px] z-10">{member.jobDesc}</p>
      </div>

      <div className="mx-4 mb-4 rounded-xl px-4 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-1.5">
          <Code2 size={11} style={{ color: member.accent }} />
          <span className="text-white/30 text-xs">{member.favLang}</span>
        </div>
        <div className="flex items-center gap-1 text-white/20 group-hover:text-white/45 transition-colors">
          <span className="text-xs">View profile</span>
          <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  )
}

export default function MeetUs() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen pt-24 pb-20 overflow-x-hidden">

      <MemberModal member={selected} onClose={() => setSelected(null)} />

      <section className="relative max-w-5xl mx-auto px-6 text-center mb-24">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(ellipse, #0ea5e9, #14b8a6)' }} />
        </div>

        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
          <Users size={13} className="text-ocean-300" />
          <span className="text-ocean-200 text-sm font-medium">The People Behind MOYA</span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Meet Our{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 to-teal-300">Team</span>
        </h1>

        <p className="text-white/55 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          A group of engineers, designers, strategists, and advocates united by one belief.<br />
          Water access is a fundamental human right.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {values.map(({ icon: Icon, title, description, accent }) => (
            <div key={title} className="relative overflow-hidden rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300 cursor-default"
              style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ background: accent }} />
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
                <Icon size={20} style={{ color: accent }} />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <h2 className="font-display text-2xl font-bold text-white px-2">Core Team</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-5">
          {team.slice(0, 6).map((member) => (
            <MemberCard key={member.name} member={member} onClick={setSelected} />
          ))}
        </div>

        <div className="flex justify-center gap-5">
          {team.slice(6).map((member) => (
            <div key={member.name} className="w-full max-w-[calc(33.333%-10px)]">
              <MemberCard member={member} onClick={setSelected} />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-xs mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-500/20" />
          <h2 className="font-display text-2xl font-bold text-white px-2">Project Supervisor</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-500/20" />
        </div>

        <MemberCard member={supervisor} onClick={setSelected} />
      </section>

    </div>
  )
}