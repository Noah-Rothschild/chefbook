import "../../styles/Book.css";

export function Page({ side, number, children }) {
  return (
    <div className={`page page-${side}`}>
      <div className="page-scroll">{children}</div>
      {number && <div className="page-number">{number}</div>}
    </div>
  );
}

/*
 * An open book showing two pages. While `flip` is set, a leaf turns over
 * the spine: `flip.front` is drawn on its front, `flip.back` on its back.
 * "forward" lifts the right page and lays it on the left; "backward" does
 * the reverse. `left` and `right` are the pages left uncovered underneath.
 */
function Book({ left, right, flip, onFlipEnd }) {
  const handleAnimationEnd = (e) => {
    if (e.target === e.currentTarget) onFlipEnd();
  };

  return (
    <div className="book">
      <div className="book-pages">
        <div className="book-slot">{left}</div>
        <div className="book-slot">{right}</div>
        {flip && (
          <div className={`leaf leaf-${flip.dir}`} onAnimationEnd={handleAnimationEnd}>
            <div className="leaf-face">{flip.front}</div>
            <div className="leaf-face leaf-back">{flip.back}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Book;
