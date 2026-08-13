import type { ReactNode } from "react";

interface DiagramCanvasProps {
  children: ReactNode;
  contentWidth?: number;
  contentHeight?: number;
  className?: string;
}

/**
 * 단계형 SVG의 공통 480×200 캔버스.
 *
 * 기존 장면 좌표계를 그대로 유지하면서 가운데 배치할 수 있어, renderer마다
 * viewBox·여백을 복제하지 않고 흐름 데이터와 그림 전환을 독립적으로 다룬다.
 */
export default function DiagramCanvas({
  children,
  contentWidth = 480,
  contentHeight = 200,
  className = "w-full max-w-3xl",
}: DiagramCanvasProps) {
  const offsetX = (480 - contentWidth) / 2;
  const offsetY = (200 - contentHeight) / 2;

  return (
    <svg viewBox="0 0 480 200" className={className} style={{ height: "auto" }}>
      <g transform={`translate(${offsetX} ${offsetY})`}>{children}</g>
    </svg>
  );
}
