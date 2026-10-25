import type { ReactNode } from "react";

interface WideSvgViewportProps {
  children: ReactNode;
}

/** 좁은 화면에서 구조 그림의 글자 크기를 지키며 좌우로 살펴보게 합니다. */
export default function WideSvgViewport({ children }: WideSvgViewportProps) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs leading-5 text-muted-foreground sm:hidden">
        그림을 좌우로 밀어 전체 경로를 확인합니다.
      </p>
      <div
        className="overflow-x-auto pb-2"
        role="region"
        aria-label="좌우로 이동할 수 있는 구조 그림"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
