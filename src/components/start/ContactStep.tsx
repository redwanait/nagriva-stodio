import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faEnvelope,
  faHashtag,
  faLayerGroup,
  faPhone,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "./SelectField";
import { TextField } from "./Fields";
import {
  startContactStep,
  startFieldLabels,
  startNeedOptions,
  startValidation,
} from "../../data/startPage";
import type { PortfolioProjectMatch } from "../../lib/projectReference";
import type { StartFieldErrors } from "./types";

type ContactStepProps = {
  values: {
    fullName: string;
    email: string;
    phone: string;
    need: string;
    projectId: string;
  };
  errors: StartFieldErrors;
  projectReference: {
    match: PortfolioProjectMatch | null;
    notFound: boolean;
  };
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
  projectReference,
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
          autoCapitalize="words"
          maxLength={120}
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
          autoCapitalize="none"
          spellCheck={false}
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
          maxLength={20}
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

        <div className="start-field start-project-ref">
          <label className="start-label" htmlFor="start-project-id">
            {startFieldLabels.projectId}
            <span className="start-optional">Optional</span>
          </label>
          <div className="start-control start-control--icon">
            <span className="start-control__icon" aria-hidden="true">
              <FontAwesomeIcon icon={faHashtag} />
            </span>
            <input
              id="start-project-id"
              className="start-input"
              type="text"
              value={values.projectId}
              placeholder={startFieldLabels.projectIdPlaceholder}
              maxLength={32}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={submitting}
              aria-describedby="start-project-id-help start-project-id-status"
              onChange={(event) => onChange({ projectId: event.target.value })}
              onBlur={() => onBlur("projectId")}
            />
          </div>
          <p id="start-project-id-help" className="start-help">
            {startFieldLabels.projectIdHint}
          </p>
          <div
            id="start-project-id-status"
            className="start-project-ref__feedback"
            role="status"
            aria-live="polite"
          >
            {projectReference.match && (
              <p className="start-project-ref__status">
                <FontAwesomeIcon className="start-project-ref__check" icon={faCheck} aria-hidden="true" />
                <span>{startFieldLabels.projectIdMatched}</span>{" "}
                <span className="start-project-ref__title">{projectReference.match.title}</span>
              </p>
            )}
            {projectReference.notFound && (
              <p className="start-project-ref__note">{startFieldLabels.projectIdNotFound}</p>
            )}
          </div>
        </div>
      </div>

      <div className="start-actions">
        <button className="start-button start-button--primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : startContactStep.submitLabel}
          <FontAwesomeIcon
            className="start-button__icon"
            icon={submitting ? faSpinner : faArrowRight}
            spin={submitting}
            aria-hidden="true"
          />
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
