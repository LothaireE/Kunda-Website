"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ImageStackContent } from "@/data/ImageStackContent";
import SiteNavigation from "./SiteNavigation";
import NewsletterSubscription from "./NewsletterSubscription";
import styles from "./Landing.module.css";
const cx = (...names: (string | false)[]) =>
  names
    .filter(Boolean)
    .map((name) => styles[name as string])
    .join(" ");
export default function Landing() {
  const intro = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<
    "loading" | "playing" | "leaving" | "complete"
  >("loading");
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let frame = 0;
    async function start() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPhase("complete");
        return;
      }
      const images = Array.from(intro.current?.querySelectorAll("img") ?? []);
      await Promise.all(
        images.map(async (image) => {
          if (!image.complete)
            await new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), {
                once: true,
                signal: controller.signal,
              });
              image.addEventListener("error", () => resolve(), {
                once: true,
                signal: controller.signal,
              });
              controller.signal.addEventListener("abort", () => resolve(), {
                once: true,
              });
            });
          if (image.naturalWidth) await image.decode().catch(() => undefined);
        }),
      );
      if (cancelled) return;
      const cards = Array.from(
        intro.current?.querySelectorAll<HTMLElement>("figure") ?? [],
      );
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      cards.forEach((card, i) =>
        card.style.setProperty("--reveal-index", String(i)),
      );
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          setPhase("playing");
          timers.push(
            setTimeout(() => setPhase("leaving"), 2772),
            setTimeout(() => setPhase("complete"), 3222),
          );
        });
      });
    }
    void start();
    return () => {
      cancelled = true;
      controller.abort();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!reveal.current?.contains(event.target as Node)) {
        setPinned(false);
        setOpen(false);
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setPinned(false);
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const visible = phase === "leaving" || phase === "complete";
  return (
    <div className={styles.landing}>
      <SiteNavigation awaitingIntro={phase !== "complete"} />
      <div
        ref={intro}
        className={cx(
          "image-intro",
          phase !== "loading" && "is-ready",
          phase !== "loading" && "is-playing",
          phase === "leaving" && "is-leaving",
        )}
        hidden={phase === "complete"}
        aria-label="Introduction photographique"
      >
        <div className={styles["image-stack"]}>
          {ImageStackContent.map((image) => (
            <figure
              key={image.src}
              className={styles["stack-card"]}
              style={
                {
                  "--card-left": image.left,
                  "--card-top": image.top,
                  "--card-mobile-left": image.mobileLeft,
                  "--card-mobile-top": image.mobileTop,
                } as CSSProperties
              }
            >
              {/* Preserve the original eager-loaded photo mosaic during migration. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                width={1050}
                height={1400}
                loading="eager"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
      <main
        className={cx("contact-screen", visible && "is-visible")}
        aria-hidden={!visible}
        inert={!visible}
      >
        <div className={styles["contact-content"]}>
          <div className={styles["contact-links"]}>
            <a
              className={styles["email-link"]}
              href="mailto:kunda.contact@gmail.com"
            >
              kunda.contact@gmail.com
            </a>
            <div
              ref={reveal}
              className={cx("newsletter-reveal", open && "is-open")}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => {
                if (!pinned) setOpen(false);
              }}
              onBlur={(event) => {
                if (
                  !pinned &&
                  !event.currentTarget.contains(event.relatedTarget)
                )
                  setOpen(false);
              }}
            >
              <button
                ref={trigger}
                className={styles["newsletter-trigger"]}
                type="button"
                aria-expanded={open}
                aria-controls="newsletter-panel"
                onClick={() => {
                  setPinned(!pinned);
                  setOpen(!pinned);
                }}
              >
                Subscribe to the newsletter
              </button>
              <div
                className={styles["newsletter-panel"]}
                id="newsletter-panel"
                aria-hidden={!open}
                inert={!open}
              >
                <NewsletterSubscription />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
