"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./NewsletterSubscription.module.css";
export default function NewsletterSubscription() {
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const sending = useRef(false);
  useEffect(() => {
    setReady(true);
  }, []);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (sending.current || !form.reportValidity()) return;
    sending.current = true;
    const fields = new FormData(form);
    setPending(true);
    setStatus("");
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.get("email"),
          firstName: fields.get("firstName"),
          lastName: fields.get("lastName"),
          consent: fields.get("consent") === "on",
          website: fields.get("website"),
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      setStatus(
        typeof result.message === "string"
          ? result.message
          : "Sign-up is temporarily unavailable. Please try again later.",
      );
      if (response.ok) form.reset();
    } catch {
      setStatus("We could not connect. Please try again in a moment.");
    } finally {
      sending.current = false;
      setPending(false);
    }
  }
  return (
    <section
      className={styles["newsletter"]}
      aria-label="Newsletter subscription"
    >
      <div className={styles["newsletter-copy"]}>
        <p>
          A monthly selection of art, culture, favorite places and curated
          finds.
        </p>
      </div>

      <form
        className={styles["newsletter-form"]}
        aria-busy={pending}
        action="/api/newsletter"
        method="post"
        onSubmit={handleSubmit}
      >
        <div className={styles["name-fields"]}>
          <label className={styles["sr-only"]} htmlFor="newsletter-first-name">
            First name
          </label>
          <input
            id="newsletter-first-name"
            name="firstName"
            autoComplete="given-name"
            placeholder="First name"
            maxLength={100}
            required
          />
          <label className={styles["sr-only"]} htmlFor="newsletter-last-name">
            Last name
          </label>
          <input
            id="newsletter-last-name"
            name="lastName"
            autoComplete="family-name"
            placeholder="Last name"
            maxLength={100}
            required
          />
        </div>
        <label className={styles["sr-only"]} htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email address"
          maxLength={254}
          required
        />

        <button type="submit" disabled={!ready || pending}>
          {pending ? "Signing up…" : "Sign up"}
        </button>
        <div className={styles["sr-only"]} aria-hidden="true">
          <label htmlFor="newsletter-website">Leave this field empty</label>
          <input
            id="newsletter-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label className={styles["consent"]}>
          <input type="checkbox" name="consent" required />
          <span>
            I would like to receive KÜNDA’s monthly newsletter. I can
            unsubscribe at any time.
          </span>
        </label>
      </form>

      <p
        className={styles["newsletter-status"]}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </p>
      <noscript>
        Please enable JavaScript to sign up for the newsletter.
      </noscript>
      <p className={styles["privacy-note"]}>We respect your privacy.</p>
    </section>
  );
}
