import {
  FormEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import "./App.css";
import TagMarker from "./TagMarker";

export type Tag = {
  selectionStart: { x: number; y: number };
  selectionEnd: { x: number; y: number };
  tagText: string;
};

const imageSrc =
  "https://i.pinimg.com/236x/80/8d/a9/808da97f849593fa4a139e37d8eedd5c.jpg";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(new Image());
  const cursorRef = useRef<HTMLDivElement>(null);

  const [tags, setTags] = useState<Tag[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    image.src = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const cursor = cursorRef.current;
      const target = event.target as HTMLElement;

      if (!cursor) return;

      if (target.tagName !== "CANVAS") {
        cursor.classList.add("hidden");
        return;
      } else {
        cursor.classList.remove("hidden");
      }

      cursor.style.transform = `translate(${mouseX}px, ${mouseY - 20}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearCanvas();
        setShowTagInput(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function displaySelection() {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

    gradient.addColorStop(0, "#7f00ff");
    gradient.addColorStop(1, "#e100ff");
    const width = selectionEnd.x - selectionStart.x;
    const height = selectionEnd.y - selectionStart.y;

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;

    ctx.lineJoin = "round";
    ctx.miterLimit = 10;
    ctx.lineCap = "round";

    ctx.setLineDash([7, 5]);

    ctx.strokeRect(selectionStart.x, selectionStart.y, width, height);
  }

  function displayTag(tag: Tag) {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

    gradient.addColorStop(0, "#7f00ff");
    gradient.addColorStop(1, "#e100ff");

    const width = tag.selectionEnd.x - tag.selectionStart.x;
    const height = tag.selectionEnd.y - tag.selectionStart.y;

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;

    ctx.lineJoin = "round";
    ctx.miterLimit = 10;
    ctx.lineCap = "round";

    ctx.setLineDash([7, 5]);

    ctx.strokeRect(tag.selectionStart.x, tag.selectionStart.y, width, height);
  }

  function clearCanvas() {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  }

  const handleMouseDown = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    setIsSelecting(true);
    setSelectionStart({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting) {
      return;
    }

    setSelectionEnd({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });

    displaySelection();
  };

  const handleMouseUp = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    setIsSelecting(false);
    setShowTagInput(true);
  };

  const handleAddTag = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const tagInput = form.tag as HTMLInputElement;
    const tagText = tagInput.value;

    setTags((prevTags) => [
      ...prevTags,
      {
        selectionStart: {
          x: selectionStart.x,
          y: selectionStart.y,
        },
        selectionEnd: {
          x: selectionEnd.x,
          y: selectionEnd.y,
        },
        tagText,
      },
    ]);

    setShowTagInput(false);
    clearCanvas();
  };

  return (
    <section className="container">
      <div className="cursor" ref={cursorRef}></div>

      {showTagInput && (
        <div
          className="form-container"
          style={{
            transform: `translate(${selectionEnd.x + 32 + 8}px, ${
              selectionEnd.y - 32
            }px)`,
          }}
        >
          <form className="tag-form" onSubmit={handleAddTag}>
            <input
              type="text"
              autoFocus
              autoComplete="off"
              name="tag"
              className="tag-input"
              placeholder="add a comment"
            />
            <button className="tag-submit">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 14C6.44772 14 6 13.5523 6 13V8H1C0.447715 8 0 7.55228 0 7V7C0 6.44772 0.447715 6 1 6H6V1C6 0.447715 6.44772 0 7 0V0V0C7.55228 0 8 0.447715 8 1V6H13C13.5523 6 14 6.44772 14 7V7C14 7.55228 13.5523 8 13 8H8V13C8 13.5523 7.55228 14 7 14V14Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>
      )}

      {showTagInput && (
        <div
          className="marker"
          style={{
            transform: `translate(${selectionEnd.x}px, ${
              selectionEnd.y - 32
            }px)`,
          }}
        ></div>
      )}
      {tags.map((tag, index) => {
        return (
          <TagMarker
            key={index}
            tag={tag}
            onMouseEnter={() => displayTag(tag)}
            onMouseLeave={() => clearCanvas()}
            onRemoveTag={() => {
              setTags((prevTags) => {
                const newTags = [...prevTags];
                newTags.splice(index, 1);
                return newTags;
              });
              clearCanvas();
            }}
          />
        );
      })}
      <div className="canvas-container">
        <canvas
          id="canvas"
          className="canvas"
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        ></canvas>
        {/* <img src={imageSrc} alt="" ref={imageRef} /> */}
      </div>
    </section>
  );
};

export default App;
