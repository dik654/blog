import CodePanel from '@/components/ui/code-panel';
import TokenizerCompareViz from './viz/TokenizerCompareViz';

const compCode = `# 토크나이저별 한국어 처리 비교
text = "인공지능이 세상을 바꾸고 있다"

# GPT-4 (tiktoken, cl100k_base BPE)
→ ["인공", "지능", "이", " 세상", "을", " 바꾸", "고", " 있다"]
# 8 토큰, 한글 2~3 바이트 단위로 쪼개짐

# BERT (WordPiece, multilingual 30K)
→ ["인공", "##지", "##능이", "세상", "##을", "바꾸", "##고", "있다"]
# 8 토큰, ## 접두사로 단어 내부 표시

# LLaMA (SentencePiece Unigram, 32K)
→ ["▁인공지능이", "▁세상을", "▁바꾸고", "▁있다"]
# 4 토큰! 한국어 어절 단위에 가장 효율적`;

const compAnnotations = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: 'GPT-4 BPE — 바이트 기반' },
  { lines: [8, 10] as [number, number], color: 'emerald' as const, note: 'BERT WordPiece — ## 접두사' },
  { lines: [12, 14] as [number, number], color: 'amber' as const, note: 'LLaMA Unigram — 어절 효율적' },
];

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토크나이저 비교 & 한국어</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          토크나이저 선택은 모델 성능에 직접적 영향<br />
          특히 <strong>한국어</strong>처럼 교착어(agglutinative, 어근에 접사가 붙는 언어)는 토크나이저에 따라 효율 차이가 극심
        </p>

        <h3>핵심 차이</h3>
        <ul>
          <li><strong>BPE</strong> — 빈도 기반 병합, 바이트 레벨로 OOV 없음</li>
          <li><strong>WordPiece</strong> — 우도 기반 병합, ## 접두사로 위치 정보</li>
          <li><strong>Unigram</strong> — 확률 기반 가지치기, 다국어에 유리</li>
        </ul>
        <CodePanel title="한국어 토큰화 비교" code={compCode} annotations={compAnnotations} />
      </div>
      <div className="not-prose mt-8">
        <TokenizerCompareViz />
      </div>
    </section>
  );
}
