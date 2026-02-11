
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, Zap, Lock, BarChart3, Users, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-muted mb-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Powered by AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
            Intelligent Content Moderation <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Made Simple & Instant
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
            Protect your community with real-time AI analysis. We automatically detect toxicity,
            hate speech, NSFW images, and more—instantaneously flagging harmful content for review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/new">
              <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105">
                Start Moderating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                View Live Feed
              </Button>
            </Link>
          </div>

          {/* Stats / Trust Badges */}
          <div className="mt-16 flex items-center justify-center gap-8 md:gap-16 text-slate-400 grayscale opacity-70">
            <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6" /> <span>Enterprise Security</span></div>
            <div className="flex items-center gap-2"><Zap className="h-6 w-6" /> <span>Real-time API</span></div>
            <div className="flex items-center gap-2"><Users className="h-6 w-6" /> <span>Community First</span></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose ContentModerator?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform combines advanced AI with intuitive human review tools to keep your platform safe and healthy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-amber-500" />}
              title="Lightning Fast AI"
              description="Content is analyzed in milliseconds. Our AI detects spam, toxicity, and inappropriate images before they reach your users."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-emerald-500" />}
              title="Automated Protection"
              description="Set your rules and let the AI do the heavy lifting. Auto-approve safe content and flag suspicious items for review."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-indigo-500" />}
              title="Insightful Analytics"
              description="Track moderation volume, user behavior, and community health with our comprehensive admin dashboard."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent z-0"></div>

            <StepCard
              number="1"
              title="User Posts Content"
              description="Users submit text or images to your community feed via our simple API or interface."
            />
            <StepCard
              number="2"
              title="AI Scans Instantly"
              description="Our Gemini-powered engine analyzes the content for violations against your safety guidelines."
            />
            <StepCard
              number="3"
              title="Action Taken"
              description="Safe content goes live immediately. Harmful content is blocked or flagged for moderator review."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to secure your community?</h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of communities using ContentModerator to foster healthy online environments.
              </p>
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 bg-white text-indigo-600 hover:bg-indigo-50 border-none">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-indigo-600 text-white p-1 rounded-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">ContentModerator</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ContentModerator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="mb-6 bg-white dark:bg-slate-800 p-3 w-fit rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center relative z-10">
      <div className="w-12 h-12 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-indigo-500/20 ring-4 ring-white dark:ring-slate-900">
        {number}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  )
}
