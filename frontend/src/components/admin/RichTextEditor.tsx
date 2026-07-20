import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Quote,
  Undo2,
  Redo2,
  Eraser,
} from "lucide-react";

/**
 * Lightweight dependency-free WYSIWYG editor built on contentEditable.
 * Emits HTML. Good enough for a frontend-only admin; swap for a heavier
 * editor later without touching consumers.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the program story…",
  minHeight = 220,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set initial HTML once (and when the external value changes while unfocused)
  // so typing doesn't reset the caret.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement !== el && el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const addLink = () => {
    const url = window.prompt("Link URL", "https://");
    if (url) exec("createLink", url);
  };

  const btn =
    "grid h-8 w-8 place-items-center rounded-md text-text/70 transition-colors hover:bg-primary-pale hover:text-primary";
  const Divider = () => <span className="mx-1 h-5 w-px bg-border" />;

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
        <button type="button" title="Bold" onClick={() => exec("bold")} className={btn}>
          <Bold style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" title="Italic" onClick={() => exec("italic")} className={btn}>
          <Italic style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" title="Underline" onClick={() => exec("underline")} className={btn}>
          <Underline style={{ width: 16, height: 16 }} />
        </button>
        <Divider />
        <button type="button" title="Heading" onClick={() => exec("formatBlock", "<h2>")} className={btn}>
          <Heading2 style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" title="Subheading" onClick={() => exec("formatBlock", "<h3>")} className={btn}>
          <Heading3 style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" title="Quote" onClick={() => exec("formatBlock", "<blockquote>")} className={btn}>
          <Quote style={{ width: 16, height: 16 }} />
        </button>
        <Divider />
        <button type="button" title="Bulleted list" onClick={() => exec("insertUnorderedList")} className={btn}>
          <List style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" title="Numbered list" onClick={() => exec("insertOrderedList")} className={btn}>
          <ListOrdered style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" title="Add link" onClick={addLink} className={btn}>
          <Link2 style={{ width: 16, height: 16 }} />
        </button>
        <Divider />
        <button type="button" title="Undo" onClick={() => exec("undo")} className={btn}>
          <Undo2 style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" title="Redo" onClick={() => exec("redo")} className={btn}>
          <Redo2 style={{ width: 16, height: 16 }} />
        </button>
        <button
          type="button"
          title="Clear formatting"
          onClick={() => exec("removeFormat")}
          className={btn}
        >
          <Eraser style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="rte-content px-4 py-3 text-sm leading-relaxed text-text outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}
