"use client"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, HeartHandshake, ArrowRight, Sparkles, GraduationCap, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("HomePage")
  const common = useTranslations("Common")

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-48 lg:pb-32">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
          <div className="absolute -bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-pink-500/20 blur-[120px]" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <Sparkles className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
              <span>{t("hero.badge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {t("hero.title")} <br />
              <span className="gradient-text">{t("hero.subtitle")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/browse">
                <Button size="lg" className="h-12 px-8 text-lg glow gap-2">
                  <Search className="h-5 w-5" /> {common("findBook")}
                </Button>
              </Link>
              <Link href="/dashboard/listings/new">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg gap-2 hover-lift">
                  <HeartHandshake className="h-5 w-5" /> {common("donateNow")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">
              {t("features.title")}
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              {t("features.description")}
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <motion.div
              whileHover={{ y: -10 }}
              className="glass rounded-2xl p-8 flex flex-col gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("features.academic.title")}</h3>
              <p className="text-muted-foreground">
                {t("features.academic.description")}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="glass rounded-2xl p-8 flex flex-col gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("features.community.title")}</h3>
              <p className="text-muted-foreground">
                {t("features.community.description")}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="glass rounded-2xl p-8 flex flex-col gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t("features.eco.title")}</h3>
              <p className="text-muted-foreground">
                {t("features.eco.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl sm:px-16 sm:py-24">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {t("cta.title")}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
                {t("cta.description")}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-lg hover-lift">
                    {t("cta.button")}
                  </Button>
                </Link>
                <Link href="/about" className="text-sm font-semibold leading-6 flex items-center gap-1 hover:underline">
                  {t("cta.learnMore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
