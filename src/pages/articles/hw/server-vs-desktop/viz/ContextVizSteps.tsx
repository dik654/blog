import { motion } from "framer-motion";
import {
  ActionBox,
  DataBox,
  ModuleBox,
  StatusBox,
} from "@/components/viz/boxes";
import { C } from "./ContextVizData";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Arrow({
  x1,
  x2,
  y,
  delay,
}: {
  x1: number;
  x2: number;
  y: number;
  delay: number;
}) {
  return (
    <motion.line
      x1={x1}
      y1={y}
      x2={x2}
      y2={y}
      stroke="var(--muted-foreground)"
      strokeWidth={1.2}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay, duration: 0.25 }}
    />
  );
}

export function StepGoal() {
  return (
    <g>
      <text
        x={240}
        y={24}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        빠른 부품보다 맞는 플랫폼
      </text>
      <motion.g {...reveal(0.08)}>
        <ModuleBox
          x={28}
          y={52}
          w={184}
          h={72}
          label="데스크톱"
          sub="반응성 · 단일 사용자 · 비용"
          color={C.desktop}
        />
        <DataBox
          x={59}
          y={141}
          w={122}
          h={30}
          label="짧은 장애 허용"
          color={C.desktop}
        />
      </motion.g>
      <motion.g {...reveal(0.22)}>
        <ModuleBox
          x={268}
          y={52}
          w={184}
          h={72}
          label="서버"
          sub="지속 처리량 · 원격 운영"
          color={C.server}
        />
        <DataBox
          x={299}
          y={141}
          w={122}
          h={30}
          label="복구시간 제한"
          color={C.server}
        />
      </motion.g>
      <text
        x={240}
        y={191}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        경계는 제품명이 아니라 운영 요구에 따라 달라짐
      </text>
    </g>
  );
}

export function StepCapacity() {
  const resources = [
    { label: "CPU", sub: "병렬 작업 수", color: C.desktop },
    { label: "Memory", sub: "용량 · 채널", color: C.server },
    { label: "PCIe", sub: "GPU · NVMe · NIC", color: C.ok },
  ];
  return (
    <g>
      <text
        x={240}
        y={24}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        플랫폼 용량 게이트
      </text>
      {resources.map((item, i) => (
        <motion.g key={item.label} {...reveal(0.08 + i * 0.12)}>
          <StatusBox
            x={16 + i * 154}
            y={52}
            w={140}
            h={64}
            label={item.label}
            sub={item.sub}
            progress={[0.55, 0.78, 0.68][i]}
            color={item.color}
          />
        </motion.g>
      ))}
      <motion.g {...reveal(0.5)}>
        <DataBox
          x={80}
          y={143}
          w={320}
          h={30}
          label="하나라도 초과하면 상위 플랫폼 후보로 이동"
          color={C.err}
        />
      </motion.g>
      <text
        x={240}
        y={193}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        물리 슬롯 수와 CPU 직결 대역폭은 같은 값이 아님
      </text>
    </g>
  );
}

export function StepOperations() {
  return (
    <g>
      <text
        x={240}
        y={24}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        호스트 경로와 관리 경로
      </text>
      <motion.g {...reveal(0.08)}>
        <ModuleBox
          x={24}
          y={54}
          w={126}
          h={62}
          label="서비스 OS"
          sub="애플리케이션 실행"
          color={C.desktop}
        />
      </motion.g>
      <Arrow x1={156} x2={194} y={85} delay={0.22} />
      <motion.g {...reveal(0.3)}>
        <ModuleBox
          x={200}
          y={48}
          w={116}
          h={74}
          label="BMC"
          sub="standby power"
          color={C.server}
        />
      </motion.g>
      <Arrow x1={322} x2={360} y={85} delay={0.44} />
      <motion.g {...reveal(0.52)}>
        <ModuleBox
          x={366}
          y={54}
          w={90}
          h={62}
          label="관리망"
          sub="원격 콘솔"
          color={C.ok}
        />
      </motion.g>
      <motion.g {...reveal(0.68)}>
        <ActionBox
          x={121}
          y={145}
          w={238}
          h={34}
          label="OS 정지 → BMC로 진단 · 전원 제어"
          color={C.server}
        />
      </motion.g>
    </g>
  );
}
