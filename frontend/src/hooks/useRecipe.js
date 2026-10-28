import { useEffect, useRef, useState } from "react";
import api from "../api";

// Loads a recipe's details. Keeps the last recipe after `id` goes away so
// its pages can still be drawn while the book flips back to the pantry,
// and remembers recipes already opened so revisiting one is instant.
function useRecipe(id) {
  const [state, setState] = useState({ id: null, recipe: null, error: "" });
  const cache = useRef({});

  useEffect(() => {
    if (!id) return;
    if (cache.current[id]) {
      setState({ id, recipe: cache.current[id], error: "" });
      return;
    }

    let cancelled = false;
    setState({ id, recipe: null, error: "" });

    api
      .get(`/api/recipes/${id}/`)
      .then((res) => {
        cache.current[id] = res.data;
        if (!cancelled) setState({ id, recipe: res.data, error: "" });
      })
      .catch((err) => {
        console.log(err);
        if (cancelled) return;
        setState({
          id,
          recipe: null,
          error:
            err.response?.status === 404
              ? "We couldn't find that recipe."
              : "We couldn't load this recipe right now. Please try again.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

export default useRecipe;
