import TemplateSignalViz from './viz/TemplateSignalViz';
import CodePanel from '@/components/ui/code-panel';

const TEMPLATE_CODE = `// Circom 템플릿 정의
template Multiplier2() {
    signal input a;       // 입력 신호
    signal input b;       // 입력 신호
    signal output c;      // 출력 신호

    c <== a * b;          // 제약 + 대입 동시
}

// 컴포넌트 인스턴스화
component main = Multiplier2();`;

const SIGNAL_CODE = `// 신호 타입 3종
signal input  x;    // 외부에서 주입 (public/private)
signal output y;    // 외부로 노출
signal        z;    // 중간 계산용 (intermediate)

// 배열 신호
signal input in[4];
signal output out[2];

// 태그로 public/private 구분
component main {public [a]} = Circuit();`;

export default function TemplateSignal({ title }: { title?: string }) {
  return (
    <section id="template-signal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '템플릿 & 시그널'}</h2>
      <div className="not-prose mb-8">
        <TemplateSignalViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Circom의 핵심 추상화는 <strong>템플릿(Template)</strong>과 <strong>시그널(Signal)</strong>입니다.<br />
          템플릿은 재사용 가능한 회로 블록이고, 시그널은 유한체 위의 값을 나타냅니다.
          <code>{'<=='}</code> 연산자는 제약 생성과 값 대입을 동시에 수행합니다.
        </p>
        <CodePanel
          title="템플릿 & 컴포넌트 기본 구조"
          code={TEMPLATE_CODE}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'Input/Output 시그널 선언' },
            { lines: [7, 7], color: 'emerald', note: '<== : 제약 + 대입 동시' },
            { lines: [11, 11], color: 'amber', note: 'main 컴포넌트 인스턴스화' },
          ]}
        />
        <CodePanel
          title="신호 타입 & 가시성"
          code={SIGNAL_CODE}
          annotations={[
            { lines: [2, 4], color: 'sky', note: '3가지 신호 타입' },
            { lines: [7, 8], color: 'emerald', note: '배열 신호 지원' },
            { lines: [11, 11], color: 'amber', note: 'public 태그로 공개 입력 지정' },
          ]}
        />
      </div>
    </section>
  );
}
