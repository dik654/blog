import CodePanel from '@/components/ui/code-panel';
import WordPieceViz from './viz/WordPieceViz';

const wpCode = `# WordPiece — BERT의 토크나이저
# BPE와 유사하나 병합 기준이 다름

# BPE: 단순 빈도 (가장 많이 등장하는 쌍)
score_bpe = count(pair)

# WordPiece: 우도(likelihood) 최대화
score_wp = count("ab") / (count("a") * count("b"))
# 개별 빈도 대비 함께 나타날 때 정보 이득이 큰 쌍을 우선 병합

# "##" 접두사로 단어 내부 조각 표시
"unhappiness" → ["un", "##happy", "##ness"]
# "##"은 이 토큰이 단어 시작이 아님을 의미`;

const wpAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: 'BPE — 단순 빈도 기준' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'WordPiece — 우도 기준' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: '## 접두사 — 위치 정보' },
];

export default function WordPiece() {
  return (
    <section id="wordpiece" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WordPiece (BERT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>WordPiece</strong> — Google이 BERT에 사용한 토크나이저<br />
          BPE와 구조적으로 유사하나, 병합 기준을 <strong>우도(likelihood)</strong>로 변경<br />
          개별적으로 흔하지만 함께 나오면 드문 쌍보다, 함께 나올 때 정보가 큰 쌍을 우선
        </p>

        <h3>## 접두사 규칙</h3>
        <p>
          단어의 첫 번째 토큰에는 접두사 없음, 이후 조각에 "##" 부착<br />
          이 규칙으로 디코딩 시 원래 단어 경계를 복원 가능
        </p>
        <CodePanel title="WordPiece vs BPE" code={wpCode} annotations={wpAnnotations} />
      </div>
      <div className="not-prose mt-8">
        <WordPieceViz />
      </div>
    </section>
  );
}
