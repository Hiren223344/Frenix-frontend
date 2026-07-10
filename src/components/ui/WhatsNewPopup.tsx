'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowUpRight, ArrowRight, ArrowLeft, Check } from 'lucide-react'

/**
 * Dismissible "What's New" multi-slide modal.
 *
 * Three announcement slides, stepped through with a Next button:
 *   1. Join Our Telegram Channel
 *   2. Frenix Now Powers AHAMAI
 *   3. Want Pro on the API? → message us on Telegram
 *
 * - Centered on the full viewport, above everything else, with a dimmed + blurred
 *   backdrop (scrim) so it reads as a modal sitting on top of the hero.
 * - Fires once per `version` after a short delay on homepage load.
 * - Dismissal: X button, backdrop click, Escape, or "Got it" on the last slide.
 *   Persists in localStorage, keyed by the update version, so it reappears only
 *   for a genuinely new update (bump `version`).
 * - Proper modal a11y: focus trap, initial focus, focus return, body-scroll
 *   lock, aria-modal. Reduced-motion users get crossfades instead of slides.
 *
 * No live changelog feed exists in the codebase yet, so the slides below are a
 * clearly-marked placeholder. Swap for a real source when one lands.
 */

type Slide = {
  tag: string
  title: string
  body: string
  // Optional primary CTA for the slide (e.g. Telegram link).
  cta?: { label: string; href: string }
}

// ── PLACEHOLDER: replace with a real changelog source when one exists ──
const slides: Slide[] = [
  {
    tag: "What's new",
    title: 'Join Our Telegram Channel',
    body: 'Be first to see new model rollouts, routing updates, and platform status. We post everything there as it ships.',
    cta: { label: 'Join on Telegram', href: 'https://t.me/frenixai' },
  },
  {
    tag: "What's new",
    title: 'Frenix Now Powers AHAMAI',
    body: 'AHAMAI now runs on the Frenix gateway — one unified endpoint, the same low-latency routing and zero-retention posture we ship to everyone.',
  },
  {
    tag: "What's new",
    title: 'Want Pro on the API?',
    body: 'DM @itsmehiren on Telegram and we’ll send you everything you need to upgrade your account to Pro.',
    cta: { label: 'DM @itsmehiren', href: 'https://t.me/itsmehiren' },
  },
]

// Bump this string when a new update ships — it's the dismissal key.
const VERSION = '2026-07-10-telegram-news'
const STORAGE_KEY = 'frenix:whatsnew:v:' + VERSION
const ENTER_DELAY_MS = 1500

export default function WhatsNewPopup() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1) // 1 = forward, -1 = back (for slide direction)

  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const lastStep = slides.length - 1

  // Resolve reduced-motion + dismissal + delayed reveal, client-side only.
  useEffect(() => {
    let dismissed = false
    try {
      dismissed =
        typeof window !== 'undefined' &&
        window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      // Private mode / disabled storage — treat as not dismissed so the
      // update still surfaces; it just won't persist a dismissal.
      dismissed = false
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    setReduced(prefersReduced)
    setMounted(true)
    if (dismissed) return

    const t = window.setTimeout(
      () => setVisible(true),
      prefersReduced ? 0 : ENTER_DELAY_MS
    )
    return () => window.clearTimeout(t)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* storage unavailable — dismissal just won't persist this session */
    }
  }, [])

  const goNext = useCallback(() => {
    setStep((s) => {
      if (s >= lastStep) {
        close()
        return s
      }
      setDir(1)
      return s + 1
    })
  }, [lastStep, close])

  const goBack = useCallback(() => {
    setStep((s) => {
      if (s <= 0) return s
      setDir(-1)
      return s - 1
    })
  }, [])

  const goTo = useCallback((i: number) => {
    setStep((s) => {
      if (i === s) return s
      setDir(i > s ? 1 : -1)
      return i
    })
  }, [])

  // While open: Esc to close, body-scroll lock, initial focus, focus trap.
  useEffect(() => {
    if (!visible) return

    previouslyFocused.current =
      (document.activeElement as HTMLElement) ?? null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return

      // Trap focus within the dialog.
      const root = dialogRef.current
      if (!root) return
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus()
    }, reduced ? 0 : 120)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.clearTimeout(focusTimer)
      previouslyFocused.current?.focus?.()
    }
  }, [visible, reduced, close])

  if (!mounted) return null

  const cardTransition = reduced
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }
  const backdropTransition = reduced ? { duration: 0.2 } : { duration: 0.3 }

  const slideVariants = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
      }
  const slideTransition = reduced ? { duration: 0.2 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }

  const slide = slides[step]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // Backdrop + centering surface. Click on the empty area dismisses.
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-md p-4 sm:p-6"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsnew-title"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={cardTransition}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-[min(92vw,480px)] flex-col overflow-hidden rounded-3xl border border-white/[0.08] backdrop-blur-2xl sm:w-[min(90vw,600px)] xl:w-[min(80vw,680px)]"
            style={{
              // Layered surface: lighter top fading to ink — reads as a real
              // elevated card, not a flat plate. Blue accent tied to the hero.
              background:
                'linear-gradient(180deg, #1a1a1a 0%, #131313 55%, #0f0f0f 100%)',
              boxShadow:
                '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 24px 70px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.5)',
            }}
          >
            {/* Crisp top accent hairline — replaces the blurry corner blob */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(125,170,255,0.55), transparent)',
              }}
            />
            {/* Subtle inner top highlight for physical depth */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                background:
                  'radial-gradient(120% 60% at 50% -10%, rgba(255,255,255,0.06), transparent 60%)',
              }}
            />

            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label="Dismiss"
              className="absolute right-3.5 top-3.5 z-10 grid size-8 place-items-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <X size={16} strokeWidth={2.25} />
            </button>

            {/* Slide body */}
            <div className="relative flex-1 px-7 py-8 sm:px-10 sm:py-10 xl:px-14 xl:py-12">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideTransition}
                >
                  {/* "New" indicator — sharp blue dot tied to the hero accent */}
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="inline-flex size-1.5 rounded-full bg-[#7daaff] shadow-[0_0_10px_rgba(125,170,255,0.8)]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white/80 xl:text-[12px]">
                      {slide.tag}
                    </span>
                  </div>

                  <h3
                    id="whatsnew-title"
                    className="text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[28px] xl:text-[34px]"
                  >
                    {slide.title}
                  </h3>

                  <p className="mt-3 text-[14.5px] leading-relaxed text-white/70 xl:mt-4 xl:text-[16px] xl:leading-relaxed">
                    {slide.body}
                  </p>

                  {slide.cta && (
                    <a
                      href={slide.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/cta mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-bold text-black transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] xl:mt-7"
                      style={{ boxShadow: '0 4px 20px -4px rgba(255,255,255,0.25)' }}
                    >
                      {slide.cta.label}
                      <ArrowUpRight
                        size={15}
                        strokeWidth={2.5}
                        className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                      />
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer: progress dots + Back / Next|Done */}
            <div className="relative flex items-center justify-between gap-4 border-t border-white/[0.06] px-7 py-4 sm:px-10 xl:px-14">
              <div className="flex items-center gap-2" role="group" aria-label="Slide navigation">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === step}
                    className="group/dot p-1"
                  >
                    <span
                      className={
                        'block h-1.5 rounded-full transition-all duration-300 ' +
                        (i === step
                          ? 'w-6 bg-white'
                          : 'w-1.5 bg-white/25 group-hover/dot:bg-white/50')
                      }
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 text-[13px] font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
                  >
                    <ArrowLeft size={14} strokeWidth={2.5} />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-[13px] font-bold text-black transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {step >= lastStep ? (
                    <>
                      Got it
                      <Check size={15} strokeWidth={2.75} />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
