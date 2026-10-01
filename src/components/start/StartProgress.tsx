import { startProgress } from "../../data/startPage";

export type StartStep = "contact" | "details";

type StartProgressProps = {
  step: StartStep;
};

/**
 * Single-step indicator. Only the step the visitor is on is rendered, so Step 02
 * never reads as a second form waiting underneath Step 01.
 */
function StartProgress({ step }: StartProgressProps) {
  const active = startProgress.steps[step === "contact" ? 0 : 1];

  return (
    <p className="start-progress">
      <span className="start-progress__index">{active.index}</span>
      <span className="start-progress__total">/ {startProgress.total}</span>
      <span className="start-progress__label">{active.label}</span>
    </p>
  );
}

export default StartProgress;
