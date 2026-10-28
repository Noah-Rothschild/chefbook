import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import Book, { Page } from "../components/book/Book";
import PantryPage from "../components/book/PantryPage";
import SuggestionsPage from "../components/book/SuggestionsPage";
import RecipeInfoPage from "../components/book/RecipeInfoPage";
import RecipeMethodPage from "../components/book/RecipeMethodPage";
import usePantry from "../hooks/usePantry";
import useRecipe from "../hooks/useRecipe";

function canAnimate() {
  return window.matchMedia("(min-width: 861px) and (prefers-reduced-motion: no-preference)")
    .matches;
}

// The pantry (/pantry) and a recipe (/recipes/:id) are two spreads of the
// same book; moving between them turns the page.
function Cookbook() {
  const match = useMatch("/recipes/:id");
  const spread = match ? "recipe" : "pantry";

  const pantry = usePantry();
  const recipeState = useRecipe(match?.params.id);
  const preview = pantry.recipes.find((r) => String(r.id) === String(recipeState.id));

  const [shown, setShown] = useState(spread);
  const [flip, setFlip] = useState(null);

  if (spread !== shown) {
    setShown(spread);
    setFlip(canAnimate() ? { from: shown, to: spread } : null);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [spread]);

  const pages = {
    pantry: {
      left: (
        <Page side="left" number={2}>
          <PantryPage {...pantry} />
        </Page>
      ),
      right: (
        <Page side="right" number={3}>
          <SuggestionsPage {...pantry} />
        </Page>
      ),
    },
    recipe: {
      left: (
        <Page side="left" number={4}>
          <RecipeInfoPage {...recipeState} preview={preview} />
        </Page>
      ),
      right: (
        <Page side="right" number={5}>
          <RecipeMethodPage {...recipeState} />
        </Page>
      ),
    },
  };

  if (!flip) {
    return <Book left={pages[shown].left} right={pages[shown].right} />;
  }

  const from = pages[flip.from];
  const to = pages[flip.to];
  const forward = flip.to === "recipe";

  return (
    <Book
      left={forward ? from.left : to.left}
      right={forward ? to.right : from.right}
      flip={{
        dir: forward ? "forward" : "backward",
        front: forward ? from.right : from.left,
        back: forward ? to.left : to.right,
      }}
      onFlipEnd={() => setFlip(null)}
    />
  );
}

export default Cookbook;
