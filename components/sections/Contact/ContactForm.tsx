"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Content } from "@/types/content";
import {
  contactFieldsSchema,
  requiredFields,
  type ContactErrorResponse,
  type ContactField,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button/Button";
import { CheckboxField, errorId, Field, Input, Select, Textarea } from "@/components/ui/Field/Field";
import { TextLink } from "@/components/ui/TextLink/TextLink";
import styles from "./ContactForm.module.css";

type FormContent = Content["contact"]["form"];
type Props = {
  form: FormContent;
  /** Mailversand nicht konfiguriert: nach gültigem Absenden auf WhatsApp verweisen */
  demo: boolean;
  whatsappUrl: string;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

type Values = Record<ContactField, string>;
type Errors = Partial<Record<ContactField | "privacy", string>>;
type Status = "idle" | "invalid" | "demo-sent" | "submitting" | "error";

const REQUIRED: readonly ContactField[] = requiredFields;
const EMPTY: Values = { name: "", email: "", phone: "", company: "", topic: "", message: "" };

function messageFor(field: ContactField, value: string, form: FormContent): string {
  const f = form.fields;
  const result = contactFieldsSchema.shape[field].safeParse(value);
  if (result.success) return "";
  switch (field) {
    case "name":
      return f.name.error;
    case "email":
      return value.trim() ? f.email.errorInvalid : f.email.errorEmpty;
    case "phone":
      return value.trim() ? f.phone.errorInvalid : f.phone.errorEmpty;
    default:
      return "";
  }
}

// Macht ein Wort im Text zum Link (Datenschutzerklärung, WhatsApp)
function LinkedText({ text, word, href }: { text: string; word: string; href: string }) {
  const [before, after] = text.split(word);
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <TextLink href={href} inline>
        {word}
      </TextLink>
      {after}
    </>
  );
}

export function ContactForm({ form, demo, whatsappUrl, className, ...rest }: Props) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const touched = useRef(new Set<ContactField>());
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const validate = (field: ContactField, value: string) => {
    if (!REQUIRED.includes(field)) return true;
    const message = messageFor(field, value, form);
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
    return !message;
  };

  const focusField = (field: ContactField | "privacy") => {
    const control = formRef.current?.elements.namedItem(field);
    if (control instanceof HTMLElement) control.focus();
  };

  // Prüfung erst nach dem ersten Verlassen, danach live (wie im Prototyp)
  type ControlEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

  const onBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = event.target.name as ContactField;
    if (values[field].trim() || touched.current.has(field)) validate(field, values[field]);
    touched.current.add(field);
  };

  const onChange = (event: ControlEvent) => {
    const field = event.target.name as ContactField;
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) validate(field, value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    let firstInvalid: ContactField | "privacy" | null = null;
    const nextErrors: Errors = {};
    for (const field of REQUIRED) {
      const message = messageFor(field, values[field], form);
      if (message) {
        nextErrors[field] = message;
        firstInvalid ??= field;
      }
    }
    if (!privacy) {
      nextErrors.privacy = form.fields.privacy.error;
      firstInvalid ??= "privacy";
    }
    setErrors(nextErrors);
    if (firstInvalid) {
      setStatus("invalid");
      focusField(firstInvalid);
      return;
    }

    // Demo: kein Versand, bis der Mailversand konfiguriert ist
    if (demo) {
      setStatus("demo-sent");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, privacy, website: honeypot, startedAt: startedAt.current }),
      });
      if (response.ok) {
        router.push("/danke");
        return;
      }
      if (response.status === 400) {
        const data = (await response.json().catch(() => ({}))) as ContactErrorResponse;
        const serverErrors: Errors = {};
        for (const field of data.fieldErrors ?? []) {
          serverErrors[field] =
            field === "privacy" ? form.fields.privacy.error : messageFor(field, values[field], form) || form.status.invalid;
        }
        if (Object.keys(serverErrors).length) {
          setErrors(serverErrors);
          setStatus("invalid");
          focusField((data.fieldErrors ?? [])[0]);
          return;
        }
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const f = form.fields;

  return (
    <form
      ref={formRef}
      className={[styles.form, className].filter(Boolean).join(" ")}
      noValidate
      aria-labelledby="form-title"
      aria-busy={status === "submitting"}
      onSubmit={onSubmit}
      {...rest}
    >
      <h3 className={styles.title} id="form-title">
        {form.title}
      </h3>

      <div className={styles.row}>
        <Field label={f.name.label} id="f-name" required error={errors.name}>
          <Input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-describedby={errorId("f-name")}
            invalid={Boolean(errors.name)}
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
          />
        </Field>
        <Field label={f.phone.label} id="f-phone" required error={errors.phone}>
          <Input
            id="f-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-describedby={errorId("f-phone")}
            invalid={Boolean(errors.phone)}
            value={values.phone}
            onChange={onChange}
            onBlur={onBlur}
          />
        </Field>
      </div>

      <Field label={f.email.label} id="f-email" required error={errors.email}>
        <Input
          id="f-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          required
          aria-describedby={errorId("f-email")}
          invalid={Boolean(errors.email)}
          value={values.email}
          onChange={onChange}
          onBlur={onBlur}
        />
      </Field>

      <Field label={f.company.label} id="f-company" optionalLabel={f.company.optionalLabel}>
        <Input
          id="f-company"
          name="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={onChange}
        />
      </Field>

      <Field label={f.topic.label} id="f-topic" optionalLabel={f.topic.optionalLabel}>
        <Select
          id="f-topic"
          name="topic"
          placeholder={f.topic.placeholder}
          options={f.topic.options}
          value={values.topic}
          onChange={onChange}
        />
      </Field>

      <Field label={f.message.label} id="f-message" optionalLabel={f.message.optionalLabel}>
        <Textarea id="f-message" name="message" rows={4} value={values.message} onChange={onChange} />
      </Field>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input
          id="f-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <CheckboxField
        id="f-privacy"
        name="privacy"
        required
        checked={privacy}
        error={errors.privacy}
        onChange={(checked) => {
          setPrivacy(checked);
          if (checked) setErrors((prev) => ({ ...prev, privacy: undefined }));
        }}
        label={<LinkedText text={f.privacy.label} word="Datenschutzerklärung" href="/datenschutz" />}
      />

      <p className={styles.legal}>{form.legal}</p>

      <Button variant="primary" block type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Wird gesendet …" : form.submit}
      </Button>

      <div className={styles.status} role="status" aria-live="polite">
        {status === "invalid" && <p className={styles.note}>{form.status.invalid}</p>}
        {status === "demo-sent" && (
          <p className={styles.note}>
            <LinkedText text={form.status.demo} word="WhatsApp" href={whatsappUrl} />
          </p>
        )}
      </div>
      {status === "error" && (
        <p className={styles.error} role="alert">
          <LinkedText text={form.status.error} word="WhatsApp" href={whatsappUrl} />
        </p>
      )}
    </form>
  );
}
