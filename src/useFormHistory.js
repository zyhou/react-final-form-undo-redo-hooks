import React from "react";
import isEqual from "lodash.isequal";

const useFormHistory = form => {
  const lastActive = React.useRef();
  const needUndo = React.useRef(false);
  const { values } = form.getState();

  const [entries, setEntries] = React.useState([values]);
  const lastEntry = entries[entries.length - 1];

  const subscriber = React.useCallback(
    ({ active, values }) => {
      if (lastActive.current !== active) {
        lastActive.current = active;

        if (!isEqual(lastEntry, values)) {
          setEntries([...entries, values]);
        }
      }
    },
    [entries, lastEntry]
  );

  const snapshot = () => {
    const { values } = form.getState();
    setEntries([...entries, values]);
  };

  const undo = () => {
    if (entries.length > 1) {
      needUndo.current = true;
      const newEntries = entries.slice(0, -1);
      setEntries(newEntries);
    }
  };

  const clear = () => {
    lastActive.current = undefined;
    setEntries([values]);
  };

  React.useEffect(() => {
    const unsubscribe = form.subscribe(subscriber, {
      active: true,
      values: true
    });
    return unsubscribe;
  }, [form]);

  React.useEffect(() => {
    if (needUndo.current && lastEntry) {
      needUndo.current = false;
      form.initialize(lastEntry);
    }
  }, [lastEntry]);

  return {
    lastEntry,
    snapshot,
    entries,
    undo,
    clear
  };
};

export default useFormHistory;
