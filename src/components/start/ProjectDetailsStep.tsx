import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBuilding,
  faCheck,
  faClock,
  faCoins,
  faHashtag,
  faPaperPlane,
  faPenToSquare,
  faSpinner,
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
import type { PortfolioProjectMatch } from "../../lib/projectReference";

type ProjectDetailsStepProps = {
  values: {
    budget: string;
    timeline: string;
    contactMethod: string;
    company: string;
    description: string;
    projectId: string;
  };
  contactSummary: {
    name: string;
    email: string;
    phone: string;
  };
  projectReference: {
    match: PortfolioProjectMatch | null;
    notFound: boolean;
  };
  submitting: boolean;
  onChange: (patch: Partial<ProjectDetailsStepProps["values"]>) => void;
  onBlur: (field: keyof ProjectDetailsStepProps["values"]) => void;
  onBack: () => void;
};

const BUDGET_OPTIONS = startBudgetOptions.map((value) => ({ value, label: value }));
const TIMELINE_OPTIONS = startTimelineOptions.map((value) => ({ value, label: value }));
const CONTACT_OPTIONS = startContactOptions.map((value) => ({ value, label: value }));

function ProjectDetailsStep({
  values,
  contactSummary,
  projectReference,
  submitting,
  onChange,
  onBlur,
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
          maxLength={5000}
          value={values.description}
          placeholder={startFieldLabels.descriptionPlaceholder}
          hint={startFieldLabels.descriptionHint}
          icon={faPenToSquare}
          disabled={submitting}
          onChange={(event) => onChange({ description: event.target.value })}
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

      <div className="start-actions start-actions__stack">
        <button className="start-button start-button--primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : startDetailsStep.submitLabel}
          <FontAwesomeIcon
            className="start-button__icon"
            icon={submitting ? faSpinner : faArrowRight}
            spin={submitting}
            aria-hidden="true"
          />
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
