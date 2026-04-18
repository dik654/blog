import { motion } from 'framer-motion';
import { JSON_C, XML_C, FC_C, TIP_C } from './StructuredOutputDetailVizData';

export function JsonSchemaStep() {
  const methods = [
    { num: '1', label: '자연어 설명', desc: '"name (string), revenue (number)"', c: '#94a3b8' },
    { num: '2', label: 'JSON Schema', desc: '{"type":"object","properties":{...}}', c: JSON_C },
    { num: '3', label: '예시 포함', desc: '실제 출력 예시 → 준수율 95%+', c: FC_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={JSON_C}>JSON Schema 지정 3가지 방식</text>
      {methods.map((m, i) => (
        <motion.g key={m.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <circle cx={40} cy={38 + i * 42} r={11} fill={m.c + '18'} stroke={m.c} strokeWidth={1} />
          <text x={40} y={42 + i * 42} textAnchor="middle" fontSize={10} fontWeight={700} fill={m.c}>{m.num}</text>
          <text x={60} y={36 + i * 42} fontSize={9.5} fontWeight={600} fill="var(--foreground)">{m.label}</text>
          <text x={60} y={50 + i * 42} fontSize={8} fill="var(--muted-foreground)">{m.desc}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <text x={240} y={152} textAnchor="middle" fontSize={8} fontWeight={600} fill={FC_C}>예시 1개 = 준수율 50% → 95%+ (가장 효과적인 단일 개선책)</text>
      </motion.g>
    </g>
  );
}

export function XmlTagStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={XML_C}>XML 태그 방식 (Claude 권장)</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={60} y={26} width={360} height={70} rx={6} fill={XML_C + '10'} stroke={XML_C} strokeWidth={1} />
        <text x={80} y={44} fontSize={9} fill={XML_C} fontWeight={600}>{'<response>'}</text>
        <text x={100} y={58} fontSize={8.5} fill="var(--foreground)">{'<name>Apple</name>'}</text>
        <text x={100} y={72} fontSize={8.5} fill="var(--foreground)">{'<revenue>394328</revenue>'}</text>
        <text x={80} y={86} fontSize={9} fill={XML_C} fontWeight={600}>{'</response>'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={60} y={106} width={360} height={35} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={120} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">파싱 견고성 (이스케이프 불필요) + Claude 최적화</text>
        <text x={240} y={134} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">긴 텍스트 섞여도 태그 기준 추출 용이</text>
      </motion.g>
    </g>
  );
}

export function FunctionCallingStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={FC_C}>Function Calling + 파싱 안정성</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={210} height={55} rx={6} fill={FC_C + '10'} stroke={FC_C} strokeWidth={1} />
        <text x={125} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={FC_C}>Function Calling</text>
        <text x={30} y={58} fontSize={8} fill="var(--muted-foreground)">API 레벨 스키마 강제</text>
        <text x={30} y={70} fontSize={8} fill="var(--muted-foreground)">Structured Output (2024): 100%</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={26} width={210} height={55} rx={6} fill={JSON_C + '10'} stroke={JSON_C} strokeWidth={1} />
        <text x={355} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={JSON_C}>파싱 안정성 4단계</text>
        <text x={260} y={58} fontSize={8} fill="var(--muted-foreground)">① try/except → ② Pydantic</text>
        <text x={260} y={70} fontSize={8} fill="var(--muted-foreground)">③ retry+error → ④ Guardrails</text>
      </motion.g>
    </g>
  );
}

export function PracticalTipsStep() {
  const tips = ['경계 표시: "JSON만 출력"', '필드 타입 명시', '예시 1개+ 제공', '에러 케이스 처리', '필수/선택 구분'];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={JSON_C}>실무 팁 5가지</text>
      {tips.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <circle cx={40} cy={32 + i * 25} r={8} fill={JSON_C + '18'} stroke={JSON_C} strokeWidth={0.8} />
          <text x={40} y={36 + i * 25} textAnchor="middle" fontSize={8} fontWeight={700} fill={JSON_C}>{i + 1}</text>
          <text x={60} y={36 + i * 25} fontSize={9} fill="var(--foreground)">{t}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function TemplateStep() {
  const layers = [
    { label: 'System', desc: 'JSON 스키마 따라 응답', c: JSON_C },
    { label: 'Schema', desc: '{schema}', c: XML_C },
    { label: 'Example', desc: '{example}', c: FC_C },
    { label: 'Input', desc: '{user_input}', c: '#8b5cf6' },
    { label: 'Output', desc: '{JSON}', c: TIP_C },
  ];
  return (
    <g>
      <text x={240} y={10} textAnchor="middle" fontSize={10} fontWeight={700} fill={FC_C}>프롬프트 템플릿</text>
      {layers.map((l, i) => (
        <motion.g key={l.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <rect x={80} y={22 + i * 26} width={130} height={20} rx={4} fill={l.c + '15'} stroke={l.c} strokeWidth={0.8} />
          <text x={145} y={36 + i * 26} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={l.c}>{l.label}</text>
          <text x={225} y={36 + i * 26} fontSize={8} fill="var(--muted-foreground)">{l.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function ModelCompareStep() {
  const models = [
    { name: 'OpenAI GPT-4', feat: 'JSON mode + Structured Output', c: FC_C },
    { name: 'Claude', feat: 'XML 권장, JSON 지원', c: XML_C },
    { name: 'Gemini', feat: '기본 JSON 지원', c: JSON_C },
    { name: 'LLaMA/OSS', feat: '세심한 프롬프트 필요', c: TIP_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={JSON_C}>모델별 특성</text>
      {models.map((m, i) => (
        <motion.g key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <rect x={30} y={26 + i * 32} width={420} height={24} rx={5} fill={m.c + '08'} stroke={m.c} strokeWidth={0.5} />
          <text x={50} y={42 + i * 32} fontSize={9} fontWeight={600} fill={m.c}>{m.name}</text>
          <text x={200} y={42 + i * 32} fontSize={8.5} fill="var(--muted-foreground)">{m.feat}</text>
        </motion.g>
      ))}
    </g>
  );
}
