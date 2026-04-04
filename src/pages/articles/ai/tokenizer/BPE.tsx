import CodePanel from '@/components/ui/code-panel';
import BPEMergeViz from './viz/BPEMergeViz';

const bpeCode = `# BPE (Byte Pair Encoding) — GPT 계열의 토크나이저
# 1. 초기: 모든 문자를 개별 토큰으로 시작
vocab = {a, b, c, ..., z, ...}        # byte 단위 256개

# 2. 가장 빈번한 인접 쌍을 반복 병합
while len(vocab) < target_size:
    pair = most_frequent_pair(corpus)  # e.g. ('t','h') → 'th'
    vocab.add(merge(pair))             # 'th' 토큰 추가
    corpus = apply_merge(corpus, pair) # 코퍼스 전체에 병합 적용

# 3. GPT-2: byte-level BPE (UTF-8 바이트 기반)
# 어떤 문자열이든 바이트로 분해 가능 → OOV 없음
# GPT-4: tiktoken — cl100k_base (100K 어휘)`;

const bpeAnnotations = [
  { lines: [1, 3] as [number, number], color: 'sky' as const, note: '초기 어휘: byte 단위' },
  { lines: [5, 9] as [number, number], color: 'emerald' as const, note: '빈도 기반 반복 병합' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: 'GPT: byte-level BPE' },
];

export default function BPE() {
  return (
    <section id="bpe" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BPE (Byte Pair Encoding)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        GPT 계열의 토크나이저 — 가장 빈번한 문자 쌍을 반복 병합하여 어휘 구축.<br />
        Byte-level BPE → 어떤 문자열이든 OOV 없음.
      </p>
      <BPEMergeViz />
      <div className="mt-6">
        <CodePanel title="BPE 알고리즘" code={bpeCode} annotations={bpeAnnotations} />
      </div>
    </section>
  );
}
