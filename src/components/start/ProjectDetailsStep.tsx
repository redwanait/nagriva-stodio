import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBuilding,
  faClock,
  faCoins,
  faPaperPlane,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import SelectField from "./SelectField";
import { TextAreaField, TextField } from "./Fields";
import {
  startBudgetOptions,
  startContactOptions,
  startDetailsStep,
  startFieldLabels,
  startTimelineOptions,
} from "../../data/startPage";

type ProjectDetailsStepProps = {
  values: {
    budget: string;
    timeline: string;
    contactMethod: string;
    company: string;
    description: string;
  };
  contactSummary: {
    name: string;
    email: string;
    phone: string;
  };
  submitting: boolean;
  onChange: (patch: Partial<ProjectDetailsStepProps["values"]>) => void;
  onBack: () => void;
};

const BUDGET_OPTIONS = startBudgetOptions.map((value) => ({ value, label: value }));
const TIMELINE_OPTIONS = startTimelineOptions.map((value) => ({ value, label: value }));
const CONTACT_OPTIONS = startContactOptions.map((value) => ({ value, label: value }));

function ProjectDetailsStep({
  values,
  contactSummary,
  submitting,
  onChange,
  onBack,
}: ProjectDetailsStepProps) {
  return (
    <div className="start-panel__step" aria-labelledby="start-details-title">
      <header className="start-panel__head">
        <h2 className="start-panel__title" id="start-details-title">
          {startDetailsStep.title}
        </h2>
        <p className="start-panel__description">{startDetailsStep.optionalBadge}</p>
      </header>

      <p className="start-panel__carryover">
        <span className="start-panel__carryover-label">{startDetailsStep.carryoverLabel} </span>
        <span className="start-panel__carryover-values">
          {contactSummary.name} · {contactSummary.email} · {contactSummary.phone}
        </span>
      </p>

      <div className="start-fields start-fields--pair">
        <SelectField
          id="start-budget"
          label={startFieldLabels.budget}
          options={BUDGET_OPTIONS}
          value={values.budget}
          placeholder="Select a range"
          icon={faCoins}
          optional
          disabled={submitting}
          onChange={(budget) => onChange({ budget })}
        />

        <SelectField
          id="start-timeline"
          label={startFieldLabels.timeline}
          options={TIMELINE_OPTIONS}
          value={values.timeline}
          placeholder="Select a timeline"
          icon={faClock}
          optional
          disabled={submitting}
          onChange={(timeline) => onChange({ timeline })}
        />
      </div>

      <div className="start-fields">
        <TextField
          id="start-company"
          label={startFieldLabels.company}
          optional
          value={values.company}
          placeholder="Your company or brand"
          autoComplete="organization"
          icon={faBuilding}
          disabled={submitting}
          onChange={(event) => onChange({ company: event.target.value })}
        />

        <SelectField
          id="start-contact-method"
          label={startFieldLabels.contactMethod}
          options={CONTACT_OPTIONS}
          value={values.contactMethod}
          placeholder="Select a method"
          icon={faPaperPlane}
          optional
          disabled={submitting}
          onChange={(contactMethod) => onChange({ contactMethod })}
        />

        <TextAreaField
          id="start-description"
          label={startFieldLabels.description}
          optional
          rows={3}
          value={values.description}
          placeholder={startFieldLabels.descriptionPlaceholder}
          hint={startFieldLabels.descriptionHint}
          icon={faPenToSquare}
          disabled={submitting}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>

      <div className="start-actions start-actions__stack">
        <button className="start-button start-button--primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : startDetailsStep.submitLabel}
          {!submitting && <FontAwesomeIcon className="start-button__icon" icon={faArrowRight} aria-hidden="true" />}
        </button>

        <button
          className="start-button start-button--ghost start-actions__back"
          type="button"
          onClick={onBack}
          disabled={submitting}
        >
          <FontAwesomeIcon className="start-button__icon" icon={faArrowLeft} aria-hidden="true" />
          {startDetailsStep.backLabel}
        </button>
      </div>
    </div>
  );
}

export default ProjectDetailsStep;
