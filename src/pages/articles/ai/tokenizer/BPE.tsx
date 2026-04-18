import BPEMergeViz from './viz/BPEMergeViz';
import { BPETrainViz, ByteLevelBPEViz } from './viz/BPEDetailViz';
import M from '@/components/ui/math';

export default function BPE() {
  return (
    <section id="bpe" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BPE (Byte Pair Encoding)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        GPT 계열의 토크나이저 — 가장 빈번한 문자 쌍을 반복 병합하여 어휘 구축.<br />
        Byte-level BPE → 어떤 문자열이든 OOV 없음.
      </p>
      <BPEMergeViz />

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">BPE 알고리즘 흐름</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          BPE는 <strong>빈도 기반 반복 병합</strong>으로 어휘를 구축한다.
          초기 바이트 단위에서 출발해 목표 어휘 크기에 도달할 때까지 병합을 반복.
        </p>
        <div className="grid gap-3">
          {[
            {
              step: 1,
              name: '초기 어휘 구성',
              desc: 'UTF-8 바이트 단위(0x00~0xFF)로 기본 어휘 256개를 생성한다. 모든 텍스트는 바이트 시퀀스로 분해 가능하므로 OOV(미등록 단어)가 원천 차단된다.',
              op: 'vocab = {0x00, ..., 0xFF}  → 256개',
            },
            {
              step: 2,
              name: '인접 쌍 빈도 집계',
              desc: '코퍼스 전체에서 연속된 두 토큰의 등장 빈도를 센다. 예: ("t","h")가 가장 많이 등장하면 이 쌍이 병합 후보.',
              op: 'best_pair = argmax freq(a, b)',
            },
            {
              step: 3,
              name: '최빈 쌍 병합',
              desc: '가장 빈번한 쌍을 하나의 새 토큰으로 합치고 어휘에 추가한다. 코퍼스 내 해당 쌍의 모든 출현을 새 토큰으로 교체.',
              op: 'vocab.add("th")  → 코퍼스 전체 적용',
            },
            {
              step: 4,
              name: '목표 크기까지 반복',
              desc: '2~3단계를 목표 어휘 크기에 도달할 때까지 반복한다. GPT-2는 50,257개, GPT-4(cl100k_base)는 100K, GPT-4o는 200K 어휘를 사용.',
              op: 'while |vocab| < target_size: repeat',
            },
          ].map(({ step, name, desc, op }) => (
            <div
              key={step}
              className="flex gap-4 rounded-lg border bg-card p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 font-bold text-sm">
                {step}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm mb-1">{name}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">{desc}</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{op}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BPE 학습 알고리즘 상세</h3>
        <M display>
          {`\\underbrace{\\text{best\\_pair} = \\arg\\max_{(a,b)} \\text{freq}(a, b)}_{\\text{가장 빈번한 인접 쌍 선택}}`}
        </M>
      </div>
      <BPETrainViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Byte-level BPE의 혁신</h3>
      </div>
      <ByteLevelBPEViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-2">
        <p className="leading-7">
          요약 1: BPE는 <strong>빈도 기반 반복 병합</strong> — 자주 나오는 쌍부터 하나의 토큰으로 합침.<br />
          요약 2: <strong>Byte-level BPE</strong>는 UTF-8 바이트 기반이라 OOV가 원천 차단됨.<br />
          요약 3: GPT-4o의 200K 어휘는 다국어 효율 개선의 결과 — 한국어 토큰 수 ~40% 감소.
        </p>
      </div>
    </section>
  );
}
