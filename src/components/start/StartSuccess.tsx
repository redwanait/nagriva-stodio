import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import {
  startSuccess,
  startSuccessMessages,
  startWhatsappUrl,
} from "../../data/startPage";

const TYPE_MS = 40;
const DELETE_MS = 24;
const PAUSE_MS = 1900;
const SWAP_MS = 60;

type StartSuccessProps = {
  name: string;
};

function useSuccessTypewriter(active: boolean) {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const [text, setText] = useState(() => (reduced ? startSuccessMessages[0].text : ""));
  const [dir, setDir] = useState<"ltr" | "rtl">(startSuccessMessages[0].dir);
  const [full, setFull] = useState<string>(startSuccessMessages[0].text);

  useEffect(() => {
    if (!active || reduced) return;

    let messageIndex = 0;
    let current = startSuccessMessages[0];
    let charIndex = 0;
    let timers: number[] = [];

    const schedule = (run: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers = timers.filter((timer) => timer !== id);
        run();
      }, delay);
      timers.push(id);
    };

    const typeNext = () => {
      if (charIndex >= current.text.length) {
        schedule(() => schedule(deleteNext, DELETE_MS), PAUSE_MS);
        return;
      }
      charIndex += 1;
      setText(current.text.slice(0, charIndex));
      schedule(typeNext, TYPE_MS);
    };

    const deleteNext = () => {
      if (charIndex <= 0) {
        messageIndex = (messageIndex + 1) % startSuccessMessages.length;
        const next = startSuccessMessages[messageIndex];
        current = next;
        charIndex = 0;
        setDir(next.dir);
        setFull(next.text);
        setText("");
        schedule(typeNext, SWAP_MS);
        return;
      }
      charIndex -= 1;
      setText(current.text.slice(0, charIndex));
      schedule(deleteNext, DELETE_MS);
    };

    schedule(typeNext, 0);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [active, reduced]);

  return { text, dir, full };
}

function StartSuccess({ name }: StartSuccessProps) {
  const message = useSuccessTypewriter(true);
  const firstName = name.trim().split(/\s+/)[0] ?? "";

  return (
    <section className="start-success" aria-labelledby="start-success-title">
      <div className="start-success__panel">
        <span className="start-success__mark" aria-hidden="true">
          <FontAwesomeIcon icon={faCheck} />
        </span>

        <h2 className="start-success__title" id="start-success-title">
          {firstName
            ? `Thanks, we got it, ${firstName}.`
            : startSuccess.title}
        </h2>
        <p className="start-success__description">{startSuccess.description}</p>

        <div className="start-success__message">
          <p dir={message.dir} aria-hidden="true">
            {message.text}
          </p>
          <span className="visually-hidden" aria-live="polite">
            {message.full}
          </span>
        </div>

        <div className="start-success__actions">
          <a className="start-button start-button--primary" href={startWhatsappUrl}>
            {startSuccess.whatsappLabel}
          </a>
          <a className="start-button start-button--secondary" href="/">
            {startSuccess.homeLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export default StartSuccess;