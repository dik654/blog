import { motion } from "framer-motion";
import { AlertBox, DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const enter = (delay: number) => ({
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  transition: { delay },
});

export function StepFailure() {
  const layers = [
    { label: "메모리 오류", action: "ECC 교정 · 감지", color: C.server },
    { label: "PSU 고장", action: "다른 전원 경로", color: C.ok },
    { label: "드라이브 고장", action: "중복본 + 핫스왑", color: C.desktop },
  ];
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        장애를 교체 가능한 단위로 제한
      </text>
      {layers.map((layer, i) => {
        const y = 47 + i * 47;
        return (
          <motion.g key={layer.label} {...enter(0.08 + i * 0.12)}>
            <AlertBox
              x={25}
              y={y}
              w={126}
              h={34}
              label={layer.label}
              color={C.err}
            />
            <line
              x1={157}
              y1={y + 17}
              x2={196}
              y2={y + 17}
              stroke={layer.color}
              strokeWidth={1.2}
            />
            <ModuleBox
              x={202}
              y={y - 3}
              w={158}
              h={40}
              label={layer.action}
              color={layer.color}
            />
            <DataBox
              x={377}
              y={y + 3}
              w={78}
              h={28}
              label="서비스 유지"
              color={C.ok}
            />
          </motion.g>
        );
      })}
      <text
        x={240}
        y={194}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        중복 구성도 용량·배선·복구 절차가 맞아야 동작
      </text>
    </g>
  );
}

export function StepDecision() {
  const choices = [
    { x: 18, label: "Desktop", sub: "1 GPU · 로컬 운영", color: C.desktop },
    { x: 174, label: "Workstation", sub: "확장 I/O · ECC", color: C.hw },
    { x: 330, label: "Server", sub: "원격 · 중복 · 밀도", color: C.server },
  ];
  return (
    <g>
      <text
        x={240}
        y={23}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        요구량을 적고 가장 작은 플랫폼부터 검증
      </text>
      {choices.map((choice, i) => (
        <motion.g key={choice.label} {...enter(0.08 + i * 0.13)}>
          <ModuleBox
            x={choice.x}
            y={58}
            w={132}
            h={66}
            label={choice.label}
            sub={choice.sub}
            color={choice.color}
          />
          {i < choices.length - 1 && (
            <line
              x1={choice.x + 134}
              y1={91}
              x2={choice.x + 153}
              y2={91}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
            />
          )}
        </motion.g>
      ))}
      <motion.g {...enter(0.56)}>
        <DataBox
          x={86}
          y={148}
          w={308}
          h={32}
          label="장치 수 · 메모리 · RTO · 현장 접근성으로 결정"
          color={C.ok}
        />
      </motion.g>
    </g>
  );
}
