import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'types', label: '핵심 타입' },
  { id: 'ssz', label: 'SSZ 인코딩' },
  { id: 'fork', label: '포크별 변형' },
] as const;

const types = [
  { name: 'BeaconState', desc: '검증자 레지스트리, 잔액, 슬롯, 체크포인트 등 전체 상태', fields: 'slot, fork, validators, balances, ...' },
  { name: 'BeaconBlock', desc: '슬롯, 제안자, 블록 바디 (attestation, deposit 등)', fields: 'slot, proposer_index, parent_root, body' },
  { name: 'Attestation', desc: '검증자의 투표 데이터 (커밋티 비트, 서명)', fields: 'aggregation_bits, data, signature' },
  { name: 'Validator', desc: '검증자 정보 (공개키, 잔액, 활성화/탈출 에폭)', fields: 'pubkey, withdrawal_credentials, ...' },
];

const sszFeatures = [
  { feature: 'ssz_derive 매크로', desc: '#[derive(Encode, Decode, TreeHash)] 자동 구현' },
  { feature: 'BitList / BitVector', desc: '가변/고정 길이 비트 컬렉션 (커밋티 투표)' },
  { feature: 'FixedVector / VariableList', desc: '고정/가변 길이 컨테이너' },
  { feature: 'Tree Hash', desc: '머클 트리 루트 계산 (상태 루트)' },
  { feature: 'Milhouse', desc: '영구 데이터용 List, Vector (Copy-on-Write)' },
];

const forks = ['Base', 'Altair', 'Bellatrix', 'Capella', 'Deneb', 'Electra', 'Fulu'];

export default function SSZTypeViz() {
  const [tab, setTab] = useState<string>('types');

  return (
    <div className="not-prose rounded-xl border bg-card p-5">
      <p className="text-sm font-semibold mb-3 text-foreground/80">SSZ 타입 시스템</p>
      <div className="flex gap-1 mb-4 p-1 rounded-lg border border-border w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium
              ${tab === t.id ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'types' && (
            <div className="flex flex-col gap-1.5">
              {types.map(t => (
                <div key={t.name} className="rounded border px-3 py-2">
                  <p className="text-xs font-mono font-medium">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                  <p className="text-[10px] font-mono text-foreground/50 mt-0.5">{t.fields}</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'ssz' && (
            <div className="flex flex-col gap-1.5">
              {sszFeatures.map(f => (
                <div key={f.feature} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium">{f.feature}</p>
                    <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'fork' && (
            <div>
              <p className="text-[11px] text-muted-foreground mb-2">
                #[superstruct] 매크로로 포크별 변형을 컴파일 타임에 생성
              </p>
              <div className="flex gap-1 flex-wrap">
                {forks.map((f, i) => (
                  <motion.div key={f} initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                    className="rounded-md border px-2 py-1 text-[10px] font-medium
                      bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                    {f}
                  </motion.div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                각 포크는 이전 필드를 상속하고 새 필드를 추가 (예: Electra에서 committee_bits 추가)
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
