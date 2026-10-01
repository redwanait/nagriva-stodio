import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  placeholder: string;
  optional?: boolean;
  error?: string;
  disabled?: boolean;
  /** FontAwesome glyph rendered inside the control, on the leading edge. */
  icon?: IconDefinition;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

/**
 * Custom listbox dropdown. The repo has no native `<select>` anywhere and the
 * browser-default control clashes with the Nagriva input styling, so this
 * follows the ARIA combobox pattern: focus stays on the trigger while
 * `aria-activedescendant` moves through the option list.
 */
function SelectField({
  id,
  label,
  options,
  value,
  placeholder,
  optional,
  error,
  disabled,
  icon,
  onChange,
  onBlur,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listId = `${id}-list`;
  const errorId = `${id}-error`;
  const optionId = useCallback((index: number) => `${id}-option-${index}`, [id]);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const hasValue = selectedIndex !== -1;

  const openMenu = useCallback(() => {
    setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex);
    setOpen(true);
  }, [selectedIndex]);

  const closeMenu = useCallback((returnFocus: boolean) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Keep the highlighted option inside the scroll area while arrowing through a
  // long list on a small screen.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex))}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, optionId]);

  // Pointer down outside the control dismisses it, matching the dismiss-on-outside
  // behaviour used by the call modal.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [closeMenu, open]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    closeMenu(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const isOpenKey =
      event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ";

    if (!open) {
      if (isOpenKey) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (current <= 0 ? options.length : current) - 1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="start-field">
      <span className="start-label" id={labelId}>
        {label}
        {optional ? (
          <span className="start-optional">Optional</span>
        ) : (
          <span className="start-required" aria-hidden="true">
            *
          </span>
        )}
      </span>

      <div className={`start-select${icon ? " start-select--icon" : ""}`} ref={rootRef}>
        {icon && (
          <span className="start-control__icon" aria-hidden="true">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        <button
          ref={triggerRef}
          type="button"
          className="start-select__trigger"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-required={!optional || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          onClick={() => (open ? closeMenu(true) : openMenu())}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // Only report a real exit from the control. Dismissing on blur here
            // would race the option click: the option rows are not focusable,
            // so pressing one blurs the trigger and unmounts the list before
            // `click` ever fires. Dismissal is handled by the outside-pointer
            // listener and by Tab in `handleKeyDown` instead.
            onBlur?.();
          }}
        >
          <span
            id={valueId}
            className={`start-select__value ${
              hasValue ? "start-select__value--filled" : "start-select__value--placeholder"
            }`}
          >
            {hasValue ? options[selectedIndex].label : placeholder}
          </span>
        </button>

        <span className="start-select__chevron" aria-hidden="true">
          <FontAwesomeIcon icon={faChevronDown} />
        </span>

        {open && (
          <ul className="start-select__list" id={listId} role="listbox" ref={listRef}>
            {options.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                className="start-select__option"
                role="option"
                aria-selected={option.value === value}
                data-active={index === activeIndex}
                onPointerDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(index)}
              >
                <span>{option.label}</span>
                <FontAwesomeIcon
                  className="start-select__check"
                  icon={faCheck}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p id={errorId} className="start-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectField;
