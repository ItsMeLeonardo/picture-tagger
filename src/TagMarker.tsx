import { useState } from "react";
import type { Tag } from "./App";
export type Props = {
  tag: Tag;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onRemoveTag: () => void;
};

export default function TagMarker(props: Props) {
  const { tag, onMouseEnter, onMouseLeave, onRemoveTag } = props;

  const [isHovering, setIsHovering] = useState(false);

  const { selectionEnd } = tag;

  const handleMouseEnter = () => {
    setIsHovering(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    onMouseLeave();
  };

  const handleRemoveTag = () => {
    if (!isHovering) return;
    onRemoveTag();
  };

  return (
    <div
      className="tab-marker-container"
      style={{
        transform: `translate(${selectionEnd.x}px, ${selectionEnd.y - 40}px)`,
      }}
    >
      <div
        className="tab-marker-button-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="tag-marker-button"
          onClick={handleRemoveTag}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          <picture className="tag-marker-picture">
            {isHovering ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 7.27757L1.52852 11.749C1.36122 11.9163 1.14829 12 0.889734 12C0.631179 12 0.418251 11.9163 0.25095 11.749C0.0836498 11.5817 0 11.3688 0 11.1103C0 10.8517 0.0836498 10.6388 0.25095 10.4715L4.72243 6L0.25095 1.52852C0.0836498 1.36122 0 1.14829 0 0.889734C0 0.631179 0.0836498 0.418251 0.25095 0.25095C0.418251 0.0836498 0.631179 0 0.889734 0C1.14829 0 1.36122 0.0836498 1.52852 0.25095L6 4.72243L10.4715 0.25095C10.6388 0.0836498 10.8517 0 11.1103 0C11.3688 0 11.5817 0.0836498 11.749 0.25095C11.9163 0.418251 12 0.631179 12 0.889734C12 1.14829 11.9163 1.36122 11.749 1.52852L7.27757 6L11.749 10.4715C11.9163 10.6388 12 10.8517 12 11.1103C12 11.3688 11.9163 11.5817 11.749 11.749C11.5817 11.9163 11.3688 12 11.1103 12C10.8517 12 10.6388 11.9163 10.4715 11.749L6 7.27757Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <img
                className="tag-marker-avatar"
                src="https://i.pinimg.com/236x/ad/f6/47/adf647058715361e83c3a302f1994842.jpg"
                alt=""
              />
            )}
          </picture>
        </button>
        {isHovering && <div className="tag-marker-text">{tag.tagText}</div>}
      </div>
    </div>
  );
}
