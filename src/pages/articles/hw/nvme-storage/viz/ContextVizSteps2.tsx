import { motion } from "framer-motion";
import { ActionBox, AlertBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 7 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

export function StepService() {
  const layers = [
    {
      y: 42,
      label: "애플리케이션",
      sub: "중복 데이터 · I/O 중지",
      color: C.ok,
    },
    {
      y: 79,
      label: "OS + PCIe",
      sub: "namespace 제거 · hot-plug 처리",
      color: C.m2,
    },
    {
      y: 116,
      label: "백플레인 + 베이",
      sub: "전원 제어 · presence · LED",
      color: C.u2,
    },
    {
      y: 153,
      label: "드라이브",
      sub: "외부 접근 가능한 커넥터와 캐리어",
      color: C.e1s,
    },
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
        안전한 교체에 필요한 전체 스택
      </text>
      {layers.map((layer, index) => (
        <motion.g key={layer.label} {...reveal(0.08 + index * 0.11)}>
          <ActionBox
            x={62}
            y={layer.y}
            w={356}
            h={30}
            label={layer.label}
            sub={layer.sub}
            color={layer.color}
          />
        </motion.g>
      ))}
    </g>
  );
}

export function StepDecision() {
  const choices = [
    { x: 18, label: "M.2", sub: "내부 · 공간 절약", color: C.m2 },
    { x: 174, label: "U.2 / U.3", sub: "기존 2.5-inch bay", color: C.u2 },
    { x: 330, label: "E1.S / E3.S", sub: "고밀도 · airflow", color: C.e1s },
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
        운영 조건에서 폼팩터 후보 도출
      </text>
      {choices.map((choice, index) => (
        <motion.g key={choice.label} {...reveal(0.08 + index * 0.14)}>
          <ModuleBox
            x={choice.x}
            y={59}
            w={132}
            h={64}
            label={choice.label}
            sub={choice.sub}
            color={choice.color}
          />
        </motion.g>
      ))}
      <motion.g {...reveal(0.58)}>
        <AlertBox
          x={75}
          y={149}
          w={330}
          h={34}
          label="최종 선택은 SSD와 서버의 호환성 목록으로 검증"
          color={C.err}
        />
      </motion.g>
    </g>
  );
}
