import React from "react";
import isEqual from "lodash.isequal";

import useHistory from "./useHistory";

const useFormHistory = form => {
  const { values, active } = form.getState();

  const {
    present,
    past,
    future,
    set,
    undo,
    redo,
    clear,
    canUndo,
    canRedo
  } = useHistory(values);

  const willInitialize = React.useRef(false);

  React.useEffect(() => {
    if (!active && !isEqual(present, values)) {
      set(values);
    }
  }, [active]);

  React.useEffect(() => {
    if (willInitialize.current) {
      form.initialize(present);
      willInitialize.current = false;
    }
  }, [present]);

  const formUndo = () => {
    willInitialize.current = true;
    undo();
  };

  const formRedo = () => {
    willInitialize.current = true;
    redo();
  };

  const formClear = () => {
    willInitialize.current = true;
    clear();
  };

  return {
    present,
    past,
    future,
    undo: formUndo,
    redo: formRedo,
    clear: formClear,
    canUndo,
    canRedo
  };
};

export default useFormHistory;
