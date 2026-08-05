import { createContext, useContext, type ReactNode } from 'react';

const MathAnnotationContext = createContext(false);

export function MathAnnotationProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return (
    <MathAnnotationContext.Provider value={enabled}>
      {children}
    </MathAnnotationContext.Provider>
  );
}

export function useMathAnnotations() {
  return useContext(MathAnnotationContext);
}
