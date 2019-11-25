import React from "react";

const initialState = {
  past: [],
  present: null,
  future: []
};

const reducer = (state, action) => {
  const { past, present, future } = state;

  switch (action.type) {
    case "UNDO":
      console.log("undo");
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    case "REDO":
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    case "SET":
      const { newPresent } = action;

      if (newPresent === present) {
        return state;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    case "CLEAR":
      const { initialPresent } = action;

      return {
        ...initialState,
        present: initialPresent
      };
  }
};

const useHistory = initialPresent => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    present: initialPresent
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = React.useCallback(() => {
    if (canUndo) {
      dispatch({ type: "UNDO" });
    }
  }, [canUndo, dispatch]);

  const redo = React.useCallback(() => {
    if (canRedo) {
      dispatch({ type: "REDO" });
    }
  }, [canRedo, dispatch]);

  const set = React.useCallback(
    newPresent => dispatch({ type: "SET", newPresent }),
    [dispatch]
  );

  const clear = React.useCallback(
    () => dispatch({ type: "CLEAR", initialPresent }),
    [dispatch]
  );

  return {
    ...state,
    set,
    undo,
    redo,
    clear,
    canUndo,
    canRedo
  };
};

export default useHistory;
