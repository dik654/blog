import { motion } from "framer-motion";
import { ModuleBox, DataBox, AlertBox } from "@/components/viz/boxes";
import { C } from "./EngineeringRecoveryVizData";

/** Step 0: 두 갈래 레버 — PCIe 상수를 중심으로 byte 축소 / time 은폐로 분기 */
export function Step0() {
  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.pcie}
      >
        엔지니어링의 두 갈래
      </text>

      {/* PCIe 상수 박스 */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AlertBox
          x={180}
          y={26}
          w={120}
          h={40}
          label="PCIe raw bandwidth"
          sub="소프트웨어로 못 바꾸는 상수"
          color={C.pcie}
        />
      </motion.g>

      {/* 좌 분기 화살표 */}
      <motion.line
        x1={205}
        y1={68}
        x2={140}
        y2={104}
        stroke={C.byte}
        strokeWidth={1.2}
        markerEnd="url(#erArrow0L)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.35 }}
      />
      {/* 우 분기 화살표 */}
      <motion.line
        x1={275}
        y1={68}
        x2={340}
        y2={104}
        stroke={C.time}
        strokeWidth={1.2}
        markerEnd="url(#erArrow0R)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.35 }}
      />

      {/* 좌: 바이트 수 줄이기 */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
      >
        <ModuleBox
          x={30}
          y={108}
          w={190}
          h={54}
          label="바이트 수를 줄인다"
          sub="A) Expert 배치 · C) Quantization"
          color={C.byte}
        />
      </motion.g>

      {/* 우: 시간을 숨긴다 */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
      >
        <ModuleBox
          x={260}
          y={108}
          w={190}
          h={54}
          label="시간을 연산으로 가린다"
          sub="B) TP→PP · D) Batching"
          color={C.time}
        />
      </motion.g>

      <motion.text
        x={240}
        y={188}
        textAnchor="middle"
        fontSize={8}
        fontWeight={600}
        fill={C.pcie}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        두 갈래 다 PCIe 상한 자체는 못 올린다
      </motion.text>

      <defs>
        <marker
          id="erArrow0L"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.byte} />
        </marker>
        <marker
          id="erArrow0R"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.time} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: A) Expert 배치 — before(경계를 넘는 라우팅) → after(같은 GPU로 재배치) */
export function Step1() {
  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.expertA}
      >
        A) Expert 배치 최적화
      </text>
      <text
        x={240}
        y={30}
        textAnchor="middle"
        fontSize={7.5}
        fill="var(--muted-foreground)"
      >
        자주 함께 뽑히는 E7·E12 — 같은 GPU로 옮기면 경계를 넘지 않는다
      </text>

      {/* GPU 0 */}
      <ModuleBox
        x={30}
        y={44}
        w={190}
        h={120}
        label="GPU 0"
        color={C.expertA}
      />
      {/* GPU 1 */}
      <ModuleBox
        x={260}
        y={44}
        w={190}
        h={120}
        label="GPU 1"
        color={C.expertA}
      />

      {/* 고정: E7 — 항상 GPU0 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DataBox x={50} y={78} w={64} h={28} label="E7" color={C.expertA} />
      </motion.g>

      {/* 공유 expert — 양쪽 GPU에 복제 (경계를 애초에 안 만듦) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <DataBox
          x={50}
          y={122}
          w={64}
          h={26}
          label="E_shared"
          sub="복제"
          color={C.ok}
          outlined
        />
        <DataBox
          x={366}
          y={122}
          w={64}
          h={26}
          label="E_shared"
          sub="복제"
          color={C.ok}
          outlined
        />
      </motion.g>

      {/* before: 경계 통과 라우팅 화살표 + E12가 GPU1에 (fade out) */}
      <motion.g
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.25, duration: 0.3 }}
      >
        <DataBox x={366} y={78} w={64} h={28} label="E12" color={C.warn} />
        <path
          d="M 118 92 C 220 60, 300 60, 362 92"
          fill="none"
          stroke={C.warn}
          strokeWidth={1.2}
          strokeDasharray="4 3"
          markerEnd="url(#erArrow1cross)"
        />
        <text
          x={240}
          y={58}
          textAnchor="middle"
          fontSize={7.5}
          fontWeight={600}
          fill={C.warn}
        >
          dispatch/combine이 매번 경계를 넘음
        </text>
      </motion.g>

      {/* after: E12가 GPU0로 이동, 경계 통과 없음 (fade in) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.35 }}
      >
        <DataBox x={130} y={78} w={64} h={28} label="E12" color={C.ok} />
        <text
          x={240}
          y={58}
          textAnchor="middle"
          fontSize={7.5}
          fontWeight={600}
          fill={C.ok}
        >
          같은 GPU — 경계를 넘는 라우팅이 사라짐
        </text>
      </motion.g>

      <defs>
        <marker
          id="erArrow1cross"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 2: B) TP → PP — before(layer마다 all-reduce 왕복) → after(구간 경계 activation 1회) */
export function Step2() {
  const layerX = [78, 205, 332];
  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.ppB}
      >
        B) Tensor Parallel → Pipeline Parallel
      </text>

      {/* 레인 라벨 — 항상 표시 */}
      <text x={16} y={54} fontSize={7.5} fontWeight={600} fill="var(--foreground)">
        GPU 0
      </text>
      <text x={16} y={116} fontSize={7.5} fontWeight={600} fill="var(--foreground)">
        GPU 1
      </text>
      <line x1={50} y1={50} x2={460} y2={50} stroke="var(--border)" strokeWidth={0.8} />
      <line x1={50} y1={112} x2={460} y2={112} stroke="var(--border)" strokeWidth={0.8} />

      {/* before: TP — layer마다 double all-reduce (fade out) */}
      <motion.g
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.3, duration: 0.3 }}
      >
        {layerX.map((x, i) => (
          <g key={`tp${i}`}>
            <ModuleBox x={x - 32} y={30} w={64} h={26} label={`L${i + 1}`} color={C.ppB} />
            <ModuleBox x={x - 32} y={92} w={64} h={26} label={`L${i + 1}`} color={C.ppB} />
            <motion.line
              x1={x}
              y1={57}
              x2={x}
              y2={91}
              stroke={C.warn}
              strokeWidth={1.2}
              markerEnd="url(#erArrow2tp)"
              markerStart="url(#erArrow2tp)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.15 * i, duration: 0.3 }}
            />
          </g>
        ))}
        <text x={240} y={140} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.warn}>
          매 layer all-reduce ×2 — PCIe를 매번 왕복
        </text>
      </motion.g>

      {/* after: PP — 구간 경계 activation 1회 (fade in) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.55, duration: 0.35 }}
      >
        <ModuleBox x={60} y={30} w={170} h={26} label="Stage A: L1–L2" sub="GPU 0" color={C.ppB} />
        <ModuleBox x={300} y={92} w={140} h={26} label="Stage B: L3" sub="GPU 1" color={C.ppB} />
        <motion.line
          x1={230}
          y1={44}
          x2={296}
          y2={104}
          stroke={C.ok}
          strokeWidth={1.2}
          markerEnd="url(#erArrow2pp)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.75, duration: 0.3 }}
        />
        <text x={264} y={70} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.ok}>
          activation
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.ok}>
          구간 경계에서 딱 1번 — all-reduce 자체가 없음
        </text>
      </motion.g>

      {/* 버블 리스크 경고 — 항상 표시 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
      >
        <AlertBox
          x={110}
          y={156}
          w={260}
          h={32}
          label="마이크로배치가 작으면 파이프라인 버블 발생"
          color={C.warn}
        />
      </motion.g>

      <defs>
        <marker id="erArrow2tp" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={4.5} markerHeight={4.5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
        </marker>
        <marker id="erArrow2pp" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.ok} />
        </marker>
      </defs>
    </g>
  );
}
