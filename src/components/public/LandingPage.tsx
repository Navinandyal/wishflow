import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LiveDemoGenerator } from './LiveDemoGenerator';
import { Navbar } from '../common/Navbar';
import {
  Sparkles,
  Send,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  MessageCircle,
  Clock,
  BarChart,
  HelpCircle,
  ChevronDown,
  Star,
  Zap,
  LayoutDashboard,
} from 'lucide-react';
import { PLANS } from '../../data/initialData';

export const LandingPage: React.FC = () => {
  const { navigate } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: 'Add customers',
      desc: 'Import from Excel/CSV, scan business cards, or share your branded QR link for customers to register in seconds.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Detect birthdays',
      desc: 'Smart daily cron automatically scans your registry every morning at 07:00 AM IST to flag upcoming birthdays.',
      icon: Calendar,
    },
    {
      step: '03',
      title: 'Generate personalized wishes',
      desc: 'Gemini AI crafts culturally warm greetings in English, Marathi, or Hindi using your relationship context.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Review or automate',
      desc: 'Review in 10 seconds via our 1-click stack, or turn on Autopilot to dispatch automatically with zero friction.',
      icon: Clock,
    },
    {
      step: '05',
      title: 'Send through WhatsApp',
      desc: 'Dispatched through official Meta Cloud API using your verified business number with real-time read receipts.',
      icon: Send,
    },
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Never Forget a Birthday',
      desc: 'Automated 30-day radar, today alerts, and missed birthday follow-ups so no client feels unappreciated.',
    },
    {
      icon: Sparkles,
      title: 'AI Personalized Wishes',
      desc: 'Culturally resonant messages in English, Marathi, and Hindi that sound like they were written by you personally.',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Automation',
      desc: 'Send from your own verified WhatsApp Business Account (Meta Cloud API) with delivery, read, and reply tracking.',
    },
    {
      icon: ShieldCheck,
      title: 'Consent & Privacy Compliance',
      desc: 'Built-in WhatsApp opt-in provenance tracking and DPDP Act compliance. Never get flagged for spam.',
    },
    {
      icon: Award,
      title: 'SCGT Networking Integration',
      desc: 'Special module for SCGT chapter members to exchange warm business milestone greetings and expand referrals.',
    },
    {
      icon: BarChart,
      title: 'Delivery & Reply Analytics',
      desc: 'Real-time dashboards showing delivery rates, read receipts, and positive client engagement funnels.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Patients are genuinely touched when they receive a warm birthday wish in Marathi from our clinic. Our recall appointments grew by 28% within 3 months of using WishFlow AI.',
      author: 'Dr. Rajesh Kulkarni',
      role: 'Chief Dentist & Founder',
      business: 'Sunrise Dental Care, Pune',
      rating: 5,
    },
    {
      quote:
        'As an SCGT member, building strong personal rapport with fellow entrepreneurs is crucial. WishFlow AI makes sending thoughtful milestone greetings completely effortless.',
      author: 'Girish Deshpande',
      role: 'President, SCGT Champions Chapter',
      business: 'Deshpande Legal & IP Associates',
      rating: 5,
    },
    {
      quote:
        'We previously kept an Excel sheet that nobody updated. With WishFlow’s customer QR standee on our billing counter, customers happily add their own birthdays!',
      author: 'Pooja Agarwal',
      role: 'Managing Partner',
      business: 'Aura Lifestyle Boutique, Mumbai',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'Does WishFlow AI send messages from my own WhatsApp number?',
      a: 'Yes! On the Professional plan and above, you connect your own WhatsApp Business phone number directly via official Meta Embedded Signup. The recipient sees your verified clinic/business name and profile picture.',
    },
    {
      q: 'Can I send wishes in Marathi or Hindi?',
      a: 'Absolutely. WishFlow AI was built ground-up for Indian businesses with native support for Marathi (मराठी), Hindi (हिंदी), and English, with proper cultural nuances and honorifics (जी, राव, ताई).',
    },
    {
      q: 'What happens if a customer has not given WhatsApp consent?',
      a: 'WishFlow AI strictly enforces opt-in guardrails. The system prevents automated sending if a contact has not opted in or has withdrawn consent, safeguarding your WhatsApp number from spam penalties.',
    },
    {
      q: 'How does the SCGT Networking feature work?',
      a: 'SCGT members can verify their chapter membership via mobile auto-match or Membership ID. Once verified, you unlock the member birthday radar and networking-tailored congratulatory wish templates.',
    },
    {
      q: 'Can I review wishes before they go out?',
      a: 'Yes. You can choose between "Always Ask" (1-click morning review on your phone) or "Automatic" sending at your preferred time (e.g. 08:30 AM IST).',
    },
  ];

  return (
    <div id="public-landing-page" className="bg-white text-stone-900">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-stone-100 bg-gradient-to-b from-emerald-50/40 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold mb-6 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Meta Cloud API • Culturally Personalised AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 max-w-4xl mx-auto leading-tight">
            Never forget a customer's birthday again.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            WishFlow AI helps your business remember birthdays, create heartfelt personalized
            wishes with AI in English, Marathi & Hindi, and send them automatically through WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-open-app-cta"
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all group"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-200" />
              <span>Open App Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-start-free-cta"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white text-sm font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Start Free Trial</span>
            </button>

            <button
              id="hero-try-demo-cta"
              onClick={() => {
                const el = document.getElementById('live-demo-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 text-sm font-semibold rounded-2xl border border-stone-300 shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Try Live Wish Generator</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              50 Free AI wishes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Setup in 3 minutes
            </span>
          </div>
        </div>
      </section>

      {/* 2. Live Interactive Wish Generator Demo Section */}
      <section id="live-demo-section" className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Interactive Test Drive
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              See the AI magic in action
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              No generic "HBD" spam. WishFlow AI writes warm, authentic greetings tailored to your relationship and client's preferred language.
            </p>
          </div>

          <LiveDemoGenerator />
        </div>
      </section>

      {/* 3. How It Works (5 Steps) */}
      <section className="py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Simple 5-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              How WishFlow AI transforms client relationships
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-stone-300">{s.step}</span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">{s.title}</h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Built For Business Owners
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              Everything you need to turn birthdays into loyalty
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">{f.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SCGT Networking Spotlight */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Special Module for SCGT Members</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              Strengthen ties with your SCGT chapter network
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Verify your SCGT membership to access the member directory, track chapter peer birthdays, and dispatch high-value business milestone greetings with one tap.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => navigate('/scgt-info')}
                className="min-h-[44px] px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Learn About SCGT Benefits
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Pune Champions Chapter</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/40">
                Verified Roster
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-semibold text-white">Girish Deshpande (President)</div>
              <div className="text-[11px] text-stone-300">Deshpande Legal & IP Associates</div>
              <div className="text-[10px] text-emerald-400 font-medium pt-1">🎂 Birthday Today!</div>
            </div>
            <div className="text-[11px] text-stone-300 italic">
              "Networking templates automatically emphasize joint milestones and mutual business value."
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Loved By Indian Businesses
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              Trusted by clinic owners, professionals & entrepreneurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <div className="font-bold text-xs text-stone-900">{t.author}</div>
                  <div className="text-[11px] text-stone-500">{t.role}</div>
                  <div className="text-[10px] font-medium text-emerald-700 mt-0.5">{t.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Pricing Preview */}
      <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Simple Transparent Plans
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              Invest in client retention that pays for itself
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              All plans include WhatsApp message formatting, automated reminders, and consent protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.slice(1, 4).map((p) => (
              <div
                key={p.id}
                className={`p-6 rounded-3xl bg-white border flex flex-col justify-between transition-shadow relative ${
                  p.popular
                    ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20'
                    : 'border-stone-200 shadow-sm'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-base font-bold text-stone-900">{p.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                      ₹{p.priceMonthly.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-500">/ month</span>
                  </div>

                  <div className="text-xs text-emerald-700 font-semibold mt-2">
                    {p.customerLimit.toLocaleString('en-IN')} Contacts • {p.aiCreditsPerMonth} AI Wishes
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-stone-600">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100">
                  <button
                    onClick={() => navigate('/register')}
                    className={`w-full min-h-[44px] py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      p.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    Start 14-Day Trial
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/pricing')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <span>View full feature comparison table & enterprise pricing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-stone-200 rounded-2xl p-4 bg-white cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <p className="mt-3 text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 bg-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to delight your customers on their special day?
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            Join hundreds of Indian businesses making every customer feel valued. Start your 14-day free trial in 3 minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-lg transition-all"
            >
              Get Started Free Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-2xl transition-all"
            >
              Existing User Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
