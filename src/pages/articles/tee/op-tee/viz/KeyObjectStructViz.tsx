import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  info: '#6366f1',
  gen: '#10b981',
  pop: '#0ea5e9',
  load: '#f59e0b',
  hw: '#8b5cf6',
  perf: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'TEE_ObjectInfo — type · size · usage · handleFlags 메타데이터' },
  { label: 'GenerateKey — TRNG로 랜덤 키 생성 (가장 권장)' },
  { label: 'PopulateTransientObject — 외부 평문 키 주입 (test/import용)' },
  { label: 'OpenPersistentObject — secure storage에서 로드' },
  { label: 'HW 가속 자동 선택 — driver가 알고리즘 매칭 시 호출' },
  { label: '성능 비교 — SW(mbedTLS) 50ms vs HW(CAAM) 2ms · 25× 차이' },
];

const INFO_FIELDS = [
  { f: 'objectType', t: 'TEE_TYPE_AES, TEE_TYPE_RSA_KEYPAIR...', color: C.info },
  { f: 'objectSize', t: 'bits (256, 2048, etc.)', color: C.info },
  { f: 'maxObjectSize', t: '최대 허용 size', color: C.info },
  { f: 'objectUsage', t: 'TEE_USAGE_ENCRYPT | DECRYPT | SIGN...', color: C.info },
  { f: 'dataSize', t: 'attribute data 길이', color: C.info },
  { f: 'dataPosition', t: '내부 read offset', color: C.info },
  { f: 'handleFlags', t: 'EXTRACTABLE · INITIALIZED · PERSISTENT', color: C.info },
];

export default function KeyObjectStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            GP TEE Key 객체 — TEE_ObjectInfo + 생성 방법
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.info}>
                typedef struct __TEE_ObjectInfo
              </text>
              {INFO_FIELDS.map((f, i) => (
                <motion.g key={f.f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30} y={48 + i * 22} width={420} height={18} rx={3}
                    fill={`${f.color}10`} stroke={`${f.color}40`} strokeWidth={0.6} />
                  <text x={42} y={61 + i * 22} fontSize={9} fontWeight={700} fontFamily="monospace" fill={f.color}>{f.f}</text>
                  <text x={150} y={61 + i * 22} fontSize={8.5} fill="var(--muted-foreground)">{f.t}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Key 자체는 객체 내부 buffer에만 — TA가 raw bytes 직접 접근 불가
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.gen}>
                1) TEE_GenerateKey — TRNG 랜덤 생성
              </text>
              {[
                { line: 'TEE_AllocateTransientObject(TEE_TYPE_AES, 256, &key_obj);', c: C.info },
                { line: 'TEE_GenerateKey(key_obj,', c: C.gen },
                { line: '    256,         // bits', c: C.gen },
                { line: '    NULL, 0);    // params (대부분 NULL)', c: C.gen },
                { line: '// HW TRNG → DRBG → seed → key bytes', c: C.gen },
                { line: '// 키는 객체 내부 buffer에만 존재', c: C.gen },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={52 + i * 24} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={66 + i * 24} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <DataBox x={130} y={196} w={220} h={26} label="추출 불가 — UNEXTRACTABLE 기본" color={C.gen} />
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.pop}>
                2) TEE_PopulateTransientObject — 평문 주입
              </text>
              {[
                { line: 'TEE_Attribute attrs[1] = {{', c: C.pop },
                { line: '  .attributeID = TEE_ATTR_SECRET_VALUE,', c: C.pop },
                { line: '  .content = { .ref = {', c: C.pop },
                { line: '    .buffer = key_bytes,', c: C.pop },
                { line: '    .length = 32  // 256-bit', c: C.pop },
                { line: '  }} }};', c: C.pop },
                { line: 'TEE_PopulateTransientObject(key_obj, attrs, 1);', c: C.gen },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <rect x={20} y={52 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={64 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <text x={240} y={216} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                Test/import용 — production에서는 GenerateKey 권장
              </text>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.load}>
                3) TEE_OpenPersistentObject — secure storage 로드
              </text>
              {[
                { line: 'TEE_OpenPersistentObject(', c: C.load },
                { line: '    TEE_STORAGE_PRIVATE,  // per-TA storage', c: C.load },
                { line: '    "mykey", 5,           // object ID', c: C.load },
                { line: '    TEE_DATA_FLAG_ACCESS_READ,', c: C.load },
                { line: '    &key_obj);', c: C.load },
                { line: '// HUK로 sealing된 keyfile 자동 복호화', c: C.gen },
                { line: '// 다른 TA는 동일 ID로 열어도 다른 storage', c: C.gen },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={52 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={64 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hw}>
                HW 가속 자동 선택 (driver 등록)
              </text>
              {[
                'algorithm 요청 (예: AES-256-CBC)',
                'crypto driver가 supported_algos[] 검사',
                '지원: HW 호출 (CAAM/CE/PKA register 직접)',
                '미지원: SW fallback (mbedTLS / libtomcrypt)',
                'TA에는 투명 — 알고리즘 ID만 지정',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={52 + i * 28} width={420} height={24} rx={5}
                    fill={`${C.hw}10`} stroke={`${C.hw}45`} strokeWidth={0.6} />
                  <text x={50} y={66 + i * 28} fontSize={9.5} fontWeight={700} fill={C.hw}>{i + 1}.</text>
                  <text x={75} y={68 + i * 28} fontSize={9} fill="var(--muted-foreground)">{t}</text>
                </motion.g>
              ))}
              <ActionBox x={140} y={196} w={200} h={26} label="투명한 가속 — TA 코드 변경 없음" color={C.hw} />
            </g>
          )}
          {step === 5 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.perf}>
                AES-256-CBC, 1MB 데이터 처리 시간
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={62} width={420} height={36} rx={5} fill={`${C.gen}10`} stroke={`${C.gen}50`} strokeWidth={0.7} />
                <rect x={30} y={62} width={3.5} height={36} rx={1} fill={C.gen} />
                <text x={45} y={78} fontSize={10} fontWeight={700} fill={C.gen}>SW (mbedTLS)</text>
                <text x={45} y={92} fontSize={8.5} fill="var(--muted-foreground)">CPU만 사용 — 다양한 플랫폼 호환</text>
                <motion.rect initial={{ width: 0 }} animate={{ width: 360 }} transition={{ duration: 0.8, delay: 0.4 }}
                  x={60} y={84} height={6} rx={3} fill={C.gen} opacity={0.6} />
                <text x={420} y={78} textAnchor="end" fontSize={11} fontWeight={700} fill={C.gen}>~50 ms</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={30} y={108} width={420} height={36} rx={5} fill={`${C.hw}10`} stroke={`${C.hw}50`} strokeWidth={0.7} />
                <rect x={30} y={108} width={3.5} height={36} rx={1} fill={C.hw} />
                <text x={45} y={124} fontSize={10} fontWeight={700} fill={C.hw}>HW (CAAM 가속)</text>
                <text x={45} y={138} fontSize={8.5} fill="var(--muted-foreground)">전용 crypto engine — DMA 기반</text>
                <motion.rect initial={{ width: 0 }} animate={{ width: 14 }} transition={{ duration: 0.6, delay: 0.6 }}
                  x={60} y={130} height={6} rx={3} fill={C.hw} opacity={0.8} />
                <text x={420} y={124} textAnchor="end" fontSize={11} fontWeight={700} fill={C.hw}>~2 ms</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.95 }} transition={{ delay: 0.9 }}>
                <rect x={130} y={156} width={220} height={32} rx={5} fill={`${C.perf}15`} stroke={C.perf} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={240} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.perf}>25× 차이</text>
                <text x={240} y={183} textAnchor="middle" fontSize={8.5} fill={C.perf}>모바일 비디오 decoding 같은 throughput 워크로드에서 중요</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
