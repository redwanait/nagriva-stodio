import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type FieldShellProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  /** FontAwesome glyph rendered inside the control, on the leading edge. */
  icon?: IconDefinition;
};

type TextFieldProps = FieldShellProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

type TextAreaFieldProps = FieldShellProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

function FieldIcon({ icon, modifier }: { icon?: IconDefinition; modifier?: string }) {
  if (!icon) return null;
  return (
    <span
      className={`start-control__icon${modifier ? ` ${modifier}` : ""}`}
      aria-hidden="true"
    >
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}

function FieldFooter({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="start-error" role="alert">
        {error}
      </p>
    );
  }
  if (hint) {
    return <p className="start-help">{hint}</p>;
  }
  return null;
}

/** Focus lives on the control, so the icon tints via :focus-within on the wrapper. */
function RequiredMark({ optional }: { optional?: boolean }): ReactNode {
  return optional ? (
    <span className="start-optional">Optional</span>
  ) : (
    <span className="start-required" aria-hidden="true">
      *
    </span>
  );
}

export function TextField({
  id,
  label,
  optional,
  error,
  hint,
  icon,
  ...inputProps
}: TextFieldProps) {
  return (
    <div className="start-field">
      <label className="start-label" htmlFor={id}>
        {label}
        <RequiredMark optional={optional} />
      </label>
      <div className={`start-control${icon ? " start-control--icon" : ""}`}>
        <FieldIcon icon={icon} />
        <input
          {...inputProps}
          id={id}
          className="start-input"
          aria-required={!optional || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <FieldFooter id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  optional,
  error,
  hint,
  icon,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <div className="start-field">
      <label className="start-label" htmlFor={id}>
        {label}
        {optional && <span className="start-optional">Optional</span>}
      </label>
      <div className={`start-control start-control--icon${icon ? " start-control--area" : ""}`}>
        <FieldIcon icon={icon} />
        <textarea
          {...textareaProps}
          id={id}
          className="start-input start-input--textarea"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <FieldFooter id={id} error={error} hint={hint} />
    </div>
  );
}
