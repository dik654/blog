import { motion } from "framer-motion";
import { AlertBox, DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./ContextVizData";

function Gpu({ x, label, color }: { x: number; label: string; color: string }) {
  return (
    <g>
      <rect
        x={x}
        y={69}
        width={74}
        height={60}
        rx={8}
        fill="var(--card)"
        stroke={color}
      />
      <circle cx={x + 26} cy={99} r={16} fill={`${color}18`} stroke={color} />
      <circle cx={x + 26} cy={99} r={6} fill={color} opacity={0.7} />
      <rect
        x={x + 49}
        y={82}
        width={12}
        height={34}
        rx={2}
        fill={`${color}55`}
      />
      <text
        x={x + 37}
        y={145}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

export function StepScale() {
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        다중 GPU에서는 연결선도 연산 장치
      </text>
      <Gpu x={35} label="GPU 0" color={C.consumer} />
      <Gpu x={371} label="GPU 1" color={C.consumer} />
      <ModuleBox
        x={190}
        y={34}
        w={100}
        h={48}
        label="CPU root"
        sub="host memory"
        color={C.neutral}
      />
      <path
        d="M109 83 C145 43 160 53 188 58"
        fill="none"
        stroke={C.neutral}
        strokeWidth={2}
      />
      <path
        d="M292 58 C320 53 335 43 371 83"
        fill="none"
        stroke={C.neutral}
        strokeWidth={2}
      />
      <text x={150} y={51} textAnchor="middle" fontSize={8} fill={C.neutral}>
        PCIe
      </text>
      <text x={330} y={51} textAnchor="middle" fontSize={8} fill={C.neutral}>
        PCIe
      </text>
      <motion.path
        d="M110 112 H370"
        fill="none"
        stroke={C.datacenter}
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <text
        x={240}
        y={105}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.datacenter}
      >
        직접 연결 · NVLink
      </text>
      <DataBox
        x={181}
        y={133}
        w={118}
        label="all-reduce"
        sub="bucket merge"
        color={C.compute}
      />
      <text
        x={240}
        y={181}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        통신이 드문 작업은 PCIe로 충분 · 반복 합산은 링크 대역폭에 민감
      </text>
    </g>
  );
}

export function StepCooling() {
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        같은 전력도 열을 버리는 경로가 다름
      </text>
      <rect
        x={24}
        y={41}
        width={206}
        height={119}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={127}
        y={60}
        textAnchor="middle"
        fontSize={9.5}
        fontWeight={700}
        fill={C.consumer}
      >
        워크스테이션 · 오픈에어
      </text>
      <Gpu x={90} label="GeForce" color={C.consumer} />
      {[-1, 0, 1].map((d) => (
        <motion.path
          key={d}
          d={`M127 92 C${105 + d * 22} ${74 + d * 7} ${77 + d * 31} ${69 + d * 9} ${54 + d * 38} ${65 + d * 12}`}
          fill="none"
          stroke={C.danger}
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.1 + (d + 1) * 0.12 }}
        />
      ))}
      <text x={127} y={158} textAnchor="middle" fontSize={8} fill={C.danger}>
        열을 케이스 내부로 확산
      </text>

      <rect
        x={250}
        y={41}
        width={206}
        height={119}
        rx={10}
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text
        x={353}
        y={60}
        textAnchor="middle"
        fontSize={9.5}
        fontWeight={700}
        fill={C.datacenter}
      >
        서버 · 전면 → 후면
      </text>
      <rect
        x={274}
        y={79}
        width={158}
        height={49}
        rx={5}
        fill={`${C.datacenter}10`}
        stroke={C.datacenter}
      />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M281 ${91 + i * 13} H423`}
          stroke={i === 1 ? C.danger : C.memory}
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.12 }}
        />
      ))}
      <text
        x={353}
        y={149}
        textAnchor="middle"
        fontSize={8}
        fill={C.datacenter}
      >
        섀시 팬이 일정한 압력으로 배기
      </text>
      <text
        x={240}
        y={184}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={C.ok}
      >
        TGP 합계뿐 아니라 슬롯 간격 · 흡기 온도 · 팬 곡선까지 검증
      </text>
    </g>
  );
}

export function StepDecision() {
  const items = [
    { x: 18, label: "1 · 용량", sub: "peak VRAM", color: C.memory },
    { x: 112, label: "2 · 병목", sub: "bytes / ops", color: C.compute },
    { x: 206, label: "3 · 확장", sub: "PCIe / NVLink", color: C.datacenter },
    { x: 300, label: "4 · 배치", sub: "power / cooling", color: C.consumer },
  ];
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--foreground)"
      >
        사양표를 후보 제거용 필터로 사용
      </text>
      {items.map((item, i) => (
        <motion.g
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}
        >
          <ModuleBox
            x={item.x}
            y={64}
            w={82}
            h={55}
            label={item.label}
            sub={item.sub}
            color={item.color}
          />
          {i < items.length - 1 && (
            <path
              d={`M${item.x + 84} 91 H${item.x + 92}`}
              stroke="var(--muted-foreground)"
            />
          )}
        </motion.g>
      ))}
      <motion.path
        d="M384 91 H414"
        stroke={C.ok}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.55 }}
      />
      <AlertBox
        x={416}
        y={64}
        w={48}
        h={55}
        label="측정"
        sub="실데이터"
        color={C.ok}
      />
      <rect
        x={81}
        y={142}
        width={318}
        height={23}
        rx={11.5}
        fill="var(--border)"
        opacity={0.3}
      />
      <motion.rect
        x={81}
        y={142}
        height={23}
        rx={11.5}
        fill={C.ok}
        initial={false}
        width={318}
        animate={{ width: 318 }}
        transition={{ duration: 0.9, delay: 0.4 }}
      />
      <text
        x={240}
        y={157}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill="#ffffff"
      >
        동일 커널 · 동일 입력 · 동일 정밀도
      </text>
      <text
        x={240}
        y={184}
        textAnchor="middle"
        fontSize={9}
        fill="var(--muted-foreground)"
      >
        CUDA 코어 수만으로 서로 다른 아키텍처의 성능을 예측하지 않기
      </text>
    </g>
  );
}
