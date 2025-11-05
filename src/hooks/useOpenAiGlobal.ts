import { useSyncExternalStore } from "react";

const SET_GLOBALS_EVENT_TYPE = "openai:set_globals";

export function useOpenAiGlobal<K extends keyof any>(key: K): any {
  return useSyncExternalStore(
    (onChange) => {
      const handleSetGlobal = (event: any) => {
        if (event.detail?.globals?.[key] !== undefined) {
          onChange(); // trigger re-render when updated
        }
      };
      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, { passive: true });
      return () => window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
    },
    () => (window as any).openai?.[key] ?? null
  );
}
