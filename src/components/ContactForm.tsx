"use client";

import { useState } from "react";
import type { FormEvent } from "react";

// Create a form at https://formspree.io (free), then replace this with your
// form ID (the part after /f/ in the endpoint Formspree gives you), or set
// NEXT_PUBLIC_FORMSPREE_ID in your environment.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "YOUR_FORM_ID";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-status" role="status">
        Message sent — thanks for writing. We&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-row">
        <div className="contact-field">
          <input
            className="contact-input"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder=" "
            required
          />
          <label className="contact-label" htmlFor="name">
            Name
          </label>
        </div>

        <div className="contact-field">
          <input
            className="contact-input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder=" "
            required
          />
          <label className="contact-label" htmlFor="email">
            Email
          </label>
        </div>
      </div>

      <div className="contact-field">
        <textarea
          className="contact-input contact-textarea"
          id="message"
          name="message"
          rows={5}
          placeholder=" "
          required
        />
        <label className="contact-label" htmlFor="message">
          Message
        </label>
      </div>

      <button className="contact-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send"}
      </button>

      {status === "error" && (
        <p className="contact-form-status contact-form-status-error" role="alert">
          Something went wrong — please try again, or email us directly.
        </p>
      )}
    </form>
  );
}
