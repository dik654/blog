import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 모든 장면을 같은 grid 칸에 겹쳐 두고 현재 장면만 보이게 합니다.
 * 칸 높이가 어느 폭에서든 가장 큰 장면에 맞춰지므로 장면을 넘겨도 아래 조작부와 frame이 움직이지 않습니다.
 * 보이지 않는 장면은 inert로 두어 focus와 보조기술에서 빠집니다.
 */
export function StableSceneStack({
  active,
  scenes,
  className,
}: {
  active: number;
  scenes: readonly ReactNode[];
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0", className)}>
      {scenes.map((node, index) => (
        <div
          key={index}
          className={cn("col-start-1 row-start-1 min-w-0", index === active ? "visible" : "invisible")}
          aria-hidden={index !== active}
          inert={index !== active}
        >
          {node}
        </div>
      ))}
    </div>
  );
}
