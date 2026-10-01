import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEnvelope, faLayerGroup, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

import SelectField from "./SelectField";
import { TextField } from "./Fields";
import {
  startContactStep,
  startFieldLabels,
  startNeedOptions,
  startValidation,
} from "../../data/startPage";
import type { StartFieldErrors } from "./types";

type ContactStepProps = {
  values: {
    fullName: string;
    email: string;
    phone: string;
    need: string;
  };
  errors: StartFieldErrors;
  submitting: boolean;
  onChange: (patch: Partial<ContactStepProps["values"]>) => void;
  onBlur: (field: keyof ContactStepProps["values"]) => void;
  onAddDetails: () => void;
};

const NEED_OPTIONS = startNeedOptions.map((option) => ({
  value: option.id,
  label: option.label,
}));

function ContactStep({
  values,
  errors,
  submitting,
  onChange,
  onBlur,
  onAddDetails,
}: ContactStepProps) {
  const showHint = Boolean(errors.fullName || errors.email || errors.phone || errors.need);

  return (
    <div className="start-panel__step" aria-labelledby="start-contact-title">
      <header className="start-panel__head">
        <h2 className="start-panel__title" id="start-contact-title">
          {startContactStep.title}
        </h2>
        <p className="start-panel__description">{startContactStep.description}</p>
      </header>

      <div className="start-fields">
        <TextField
          id="start-name"
          label={startFieldLabels.fullName}
          value={values.fullName}
          placeholder="Your full name"
          autoComplete="name"
          icon={faUser}
          disabled={submitting}
          onChange={(event) => onChange({ fullName: event.target.value })}
          onBlur={() => onBlur("fullName")}
          error={errors.fullName}
        />

        <TextField
          id="start-email"
          label={startFieldLabels.email}
          type="email"
          inputMode="email"
          value={values.email}
          placeholder="you@example.com"
          autoComplete="email"
          icon={faEnvelope}
          disabled={submitting}
          onChange={(event) => onChange({ email: event.target.value })}
          onBlur={() => onBlur("email")}
          error={errors.email}
        />

        <TextField
          id="start-phone"
          label={startFieldLabels.phone}
          type="tel"
          inputMode="tel"
          value={values.phone}
          placeholder="+212 6XX XXX XXX"
          autoComplete="tel"
          icon={faPhone}
          disabled={submitting}
          onChange={(event) => onChange({ phone: event.target.value })}
          onBlur={() => onBlur("phone")}
          error={errors.phone}
        />

        <SelectField
          id="start-need"
          label={startFieldLabels.need}
          options={NEED_OPTIONS}
          value={values.need}
          placeholder={startFieldLabels.needPlaceholder}
          icon={faLayerGroup}
          error={errors.need}
          disabled={submitting}
          onChange={(need) => {
            onChange({ need });
            onBlur("need");
          }}
        />
      </div>

      <div className="start-actions">
        <button className="start-button start-button--primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : startContactStep.submitLabel}
          {!submitting && <FontAwesomeIcon className="start-button__icon" icon={faArrowRight} aria-hidden="true" />}
        </button>

        <button
          className="start-button start-button--optional"
          type="button"
          onClick={onAddDetails}
          disabled={submitting}
        >
          <span className="start-button__label">{startContactStep.moreLabel}</span>
          <FontAwesomeIcon className="start-button__icon" icon={faArrowRight} aria-hidden="true" />
        </button>
        <p className="start-actions__note">{startContactStep.moreNote}</p>

        {showHint && (
          <p className="start-actions__hint" role="alert">
            {startValidation.submitHint}
          </p>
        )}
      </div>

      <p className="start-panel__reassurance">{startContactStep.reassurance}</p>
    </div>
  );
}

export default ContactStep;
