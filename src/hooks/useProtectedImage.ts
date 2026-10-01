import { useMemo, type DragEvent, type SyntheticEvent } from "react";

/*
 * Props that discourage casual copying of an image: the right-click menu,
 * drag-and-drop, native image dragging, and text selection are all suppressed.
 * `-webkit-touch-callout: none` lives in the stylesheet, because iOS Safari
 * ignores the DOM events and only honours the CSS property.
 *
 * This is deterrence, not protection. The browser has already downloaded the
 * bytes by the time these handlers run, so anyone determined can still pull the
 * file from devtools, the network tab, or the asset URL itself. It only removes
 * the one-click paths.
 */

type ProtectedImageProps = {
  draggable: false;
  onContextMenu: (event: SyntheticEvent) => void;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onSelectStart: (event: SyntheticEvent) => void;
};

export function useProtectedImage(): ProtectedImageProps {
  return useMemo(
    () => ({
      draggable: false,
      onContextMenu: (event) => event.preventDefault(),
      onDragStart: (event) => event.preventDefault(),
      onSelectStart: (event) => event.preventDefault(),
    }),
    [],
  );
}