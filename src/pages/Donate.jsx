import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Droplets, Zap, Globe, BookOpen, Users, Waves, Star, ChevronDown, Lock, Server, MapPin, GraduationCap } from 'lucide-react'

const ImpactCard = ({ icon: Icon, title, description, color, stat, statLabel }) => (
  <div className={`relative group overflow-hidden rounded-2xl p-6 border transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 cursor-default`}
    style={{
      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
      borderColor: `${color}30`,
      boxShadow: `0 4px 30px ${color}10`
    }}>
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-35"
      style={{ background: color }} />
    <div className="relative z-10">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="text-3xl font-bold text-white mb-0.5 font-display">{stat}</div>
      <div className="text-xs mb-3" style={{ color }}>{statLabel}</div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-white/55 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
)

const FloatingOrb = ({ style }) => (
  <div className="absolute rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={style} />
)

export default function Donate() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-950 via-[#071e2e] to-ocean-900" />
          <FloatingOrb style={{ top: '10%', left: '15%', width: 400, height: 400, background: 'rgba(20,184,166,0.08)' }} />
          <FloatingOrb style={{ bottom: '15%', right: '10%', width: 350, height: 350, background: 'rgba(244,63,94,0.07)', animationDelay: '2s' }} />
          <FloatingOrb style={{ top: '50%', left: '50%', width: 500, height: 500, background: 'rgba(14,165,233,0.05)', transform: 'translate(-50%,-50%)', animationDelay: '1s' }} />

          {/* Floating water drops */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute animate-float opacity-20"
              style={{
                left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.7}s`, animationDuration: `${5 + i * 0.4}s`
              }}>
              <Droplets size={10 + (i % 3) * 6} className="text-teal-300" />
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Heart size={13} className="text-rose-300 fill-rose-300" />
            <span className="text-rose-200 text-sm font-medium">Support MOYA's Mission</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.1] animate-slide-up">
            Every Drop
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-ocean-300 to-rose-300">
              Counts
            </span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your donation powers MOYA's mission to protect Egypt's water resources<br />
            From community reports to national events and educational programs.
          </p>

          {/* ── BIG DONATE BUTTON ── */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="https://hcb.hackclub.com/donations/start/moya"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-4 px-10 sm:px-14 py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl text-white transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #e11d48, #f43f5e, #fb7185)',
                boxShadow: '0 8px 40px rgba(244,63,94,0.45), 0 0 0 1px rgba(244,63,94,0.3)',
              }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />

              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl animate-ping opacity-0 group-hover:opacity-20"
                style={{ background: 'rgba(244,63,94,0.5)', animationDuration: '1.5s' }} />

              <Heart size={24} className="fill-white relative z-10 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">Donate to MOYA</span>
              <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
            </a>

            <p className="text-white/30 text-sm mt-4">
              Secure donation via Hack Club Bank · Tax-deductible
            </p>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 flex flex-col items-center gap-2 text-white/25 animate-bounce">
            <ChevronDown size={20} />
          </div>
        </div>
      </section>

      {/* ── Why Donate ── */}
      <section className="py-20 sm:py-28 bg-ocean-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Star size={13} className="text-yellow-300" />
            <span className="text-yellow-200 text-sm font-medium">Why Donate?</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Fuel the Change
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
            MOYA is a community-driven platform fighting water mismanagement across Egypt.
            Your support directly fuels every report reviewed, every event organized, and every student taught.
          </p>

          {/* Divider with wave */}
          <div className="flex items-center gap-4 mb-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <Waves size={18} className="text-ocean-400" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImpactCard
              icon={Zap}
              color="#0ea5e9"
              stat="2×"
              statLabel="Faster report processing"
              title="Enhancing Resources"
              description="Better tools, infrastructure, and admin capacity means water issues get reviewed and resolved faster, turning reports into real action across Egyptian communities."
            />
            <ImpactCard
              icon={Globe}
              color="#14b8a6"
              stat="12+"
              statLabel="Cities we want to reach"
              title="Expanding Company Activities"
              description="Help us grow beyond Cairo. Donations fund outreach, new city onboarding, and the partnerships needed to scale MOYA's water monitoring network nationwide."
            />
            <ImpactCard
              icon={Users}
              color="#f43f5e"
              stat="6×"
              statLabel="Events planned this year"
              title="Improving Our National Events"
              description="From Nile cleanup drives to Alexandria coastline surveys. Your support covers logistics, equipment, and coordination for on-the-ground volunteer events that restore water bodies."
            />
            <ImpactCard
              icon={BookOpen}
              color="#a78bfa"
              stat="1000+"
              statLabel="Students we aim to reach"
              title="Providing Educational Support"
              description="Fund water literacy workshops, expand our Game Hub content, and bring MOYA's educational programs to schools so the next generation understands water conservation."
            />
          </div>
        </div>
      </section>

      {/* ── How Your Donation Helps ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
              How Your Donation
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 to-teal-300">
                Might Help Us Be Better
              </span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto">
              Every contribution, large or small, flows directly into making MOYA stronger for all Egyptians.
            </p>
          </div>

          {/* Timeline steps */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/40 via-ocean-500/30 to-transparent hidden sm:block" style={{ transform: 'translateX(-50%)' }} />

            <div className="flex flex-col gap-10 sm:gap-14">
              {[
                {
                  side: 'left',
                  icon: Server,
                  title: 'Faster Reporting Infrastructure',
                  body: 'Fund server costs, map APIs, and admin dashboards that let our team review and approve water-issue reports in real time — so problems get fixed, not forgotten.',
                  color: '#0ea5e9'
                },
                {
                  side: 'right',
                  icon: Globe,
                  title: 'National Reach & Partnerships',
                  body: "Support the outreach work that brings MOYA to new Egyptian cities, and the institutional partnerships that get reports in front of the people who can actually fix water infrastructure.",
                  color: '#14b8a6'
                },
                {
                  side: 'left',
                  icon: Waves,
                  title: 'On-the-Ground Volunteer Events',
                  body: "Cover the real costs behind every cleanup drive and survey — transport, safety gear, equipment rental, and event coordination so more volunteers can show up and make a difference.",
                  color: '#f43f5e'
                },
                {
                  side: 'right',
                  icon: GraduationCap,
                  title: 'Water Education Programs',
                  body: 'Bring water science, conservation, and civic awareness to Egyptian schools through workshops, Game Hub expansions, and accessible learning materials.',
                  color: '#a78bfa'
                },
              ].map(({ side, icon: StepIcon, title, body, color }, i) => (
                <div key={i} className={`relative flex items-center gap-6 sm:gap-0 ${side === 'right' ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                  {/* Content */}
                  <div className={`flex-1 ${side === 'right' ? 'sm:pl-12' : 'sm:pr-12'}`}>
                    <div className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors group hover:scale-[1.02] duration-300"
                      style={{ boxShadow: `0 4px 30px ${color}08` }}>
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
                          <StepIcon size={19} style={{ color }} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{title}</h3>
                          <p className="text-white/55 text-sm leading-relaxed">{body}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 items-center justify-center z-10"
                    style={{ background: '#082f49', borderColor: color, boxShadow: `0 0 12px ${color}60` }} />

                  {/* Spacer for opposite side */}
                  <div className="flex-1 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-28 bg-ocean-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-16 border border-white/10"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(14,165,233,0.05), rgba(244,63,94,0.07))' }}>
            <div className="absolute inset-0 pointer-events-none">
              <FloatingOrb style={{ top: '-20%', right: '-10%', width: 280, height: 280, background: 'rgba(244,63,94,0.12)' }} />
              <FloatingOrb style={{ bottom: '-20%', left: '-10%', width: 240, height: 240, background: 'rgba(20,184,166,0.1)', animationDelay: '1.5s' }} />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.4)', boxShadow: '0 0 30px rgba(244,63,94,0.25)' }}>
                <Heart size={28} className="text-rose-300 fill-rose-300" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Be Part of the Flow
              </h2>
              <p className="text-white/55 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Whether it's $5 or $500, every donation puts us one step closer to cleaner water, stronger communities, and a better-managed Egypt.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://hcb.hackclub.com/donations/start/moya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-base sm:text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                    boxShadow: '0 6px 30px rgba(244,63,94,0.4)',
                  }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
                  <Heart size={19} className="fill-white relative z-10" />
                  <span className="relative z-10">Donate Now</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link to="/volunteer"
                  className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-sm sm:text-base w-full sm:w-auto justify-center">
                  <Users size={17} />
                  Volunteer Instead
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 text-white/25 text-xs">
                <span className="flex items-center gap-1.5"><Lock size={11} />Secure via Hack Club Bank</span>
                <span>·</span>
                <span>501(c)(3) Fiscal Sponsor</span>
                <span>·</span>
                <span>Tax-deductible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}