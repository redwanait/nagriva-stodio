import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import {
  startReplyChannel,
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
  email: string;
  /** Backend contact value: "WhatsApp" | "Email" | "Phone". */
  contactMethod: string;
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

function StartSuccess({ name, email, contactMethod }: StartSuccessProps) {
  const message = useSuccessTypewriter(true);
  const firstName = name.trim().split(/\s+/)[0] ?? "";
  const replyChannel = startReplyChannel[contactMethod] ?? startReplyChannel.Email;

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
        <p className="start-success__confirm">
          {startSuccess.confirmationLabel} <strong>{email}</strong>. {startSuccess.replyLabel}{" "}
          {replyChannel}.
        </p>

        <div className="start-success__message">
          <p dir={message.dir} aria-hidden="true">
            {message.text}
          </p>
          {/* No live region here: the rotating text would otherwise be re-announced every few seconds. */}
          <span className="visually-hidden">{message.full}</span>
        </div>

        <div className="start-success__actions">
          <a className="start-button start-button--whatsapp" href={startWhatsappUrl}>
            {startSuccess.whatsappLabel}
            <span className="whatsapp-icon">
              <FontAwesomeIcon className="button--primary-2-icon" icon={faWhatsapp} aria-hidden="true" />
            </span>
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