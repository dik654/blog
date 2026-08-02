import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import type { CodeRef } from '@/components/code/types';
import AutodiffGraphLab from './AutodiffGraphLab';
import { runtimeCodeRefs } from '../dezero-shared/runtimeCodeRefs';
import { CodeEvidence, Formula, Prose, SectionTitle } from '../dezero-shared/ArticleFrame';

export default function AutodiffArticle({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <section id="overview" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="01"
          kicker="문제와 경계"
          promise="미분 공식을 많이 저장하는 대신, 실행한 계산을 다시 걸어갈 수 있는 최소 기록이 무엇인지부터 정합니다."
        >
          자동 미분은 식을 예쁘게 변형하는 일이 아니라 실행 기록을 역으로 재생하는 일이다
        </SectionTitle>
        <QuestionLead
          question="프로그램 안에 if, 반복, 공유된 중간값이 있어도 출력이 각 입력에 얼마나 의존했는지 정확히 계산하려면 무엇을 기억해야 할까?"
          answer="각 operation의 입력과 출력 연결, 그 operation까지의 깊이, 같은 값으로 되돌아온 기울기를 더하는 규칙을 기억해야 한다. Reverse-mode 자동 미분은 forward 때 이 동적 계산 그래프를 만들고 scalar 출력에서 입력 방향으로 vector-Jacobian product를 전파한다."
        />
        <ConceptPrimer items={[
          {
            term: 'Value',
            meaning: '숫자 data와 그 숫자에 도착한 gradient, creator를 가진 handle이다.',
            why: '같은 parameter나 중간값이 여러 경로에 쓰여도 같은 계산 노드라는 identity를 보존한다.',
          },
          {
            term: 'Operation',
            meaning: '입력 Value를 출력 Value로 바꾼 한 번의 계산이다.',
            why: 'Backward 때 어떤 local derivative를 적용하고 어느 입력으로 돌아갈지 알려준다.',
          },
          {
            term: 'Generation',
            meaning: '계산 그래프에서 operation과 output이 놓인 깊이다.',
            why: '출력에 가까운 operation을 먼저 처리해 필요한 gradient가 준비된 뒤 입력으로 이동하게 한다.',
          },
          {
            term: 'Gradient accumulation',
            meaning: '같은 Value에 여러 경로의 미분 기여가 도착하면 모두 더하는 규칙이다.',
            why: '공유 subgraph와 parameter 재사용의 total derivative를 정확히 만든다.',
          },
        ]} />
        <Prose>
          <p>
            수치 미분은 입력을 조금 흔들어 함수를 다시 실행한다. 구현은 쉽지만 입력 하나마다 추가 실행이 필요하고
            step 크기에 따른 반올림·절단 오차가 생긴다. 기호 미분은 식 자체를 변형하지만 일반 프로그램의 runtime
            control flow를 그대로 다루기 어렵다. 자동 미분은 실제로 실행된 elementary operation의 local derivative를
            chain rule로 합성한다.
          </p>
          <p>
            이 글의 Rust 코드는 공식 DeZero의 Rust판이 아니다. 공식 교재와 저장소는 Python으로 계산 그래프를
            단계적으로 만든다. 여기서는 그 <strong>행동 계약</strong>을 Rust의 <code>Rc</code>,
            <code>RefCell</code>, <code>Weak</code>로 다시 세운 교육용 재구성을 직접 컴파일한다.
          </p>
        </Prose>
        <Misconception>
          자동 미분은 수치 오차가 전혀 없는 기호 대수기가 아니다. Local derivative는 해석적으로 적용하지만 data와
          gradient 계산은 여전히 부동소수점 연산이다. 또한 미분 불가능한 점에서는 구현이 선택한 subgradient 규칙을 따른다.
        </Misconception>
        <CodeEvidence
          codeKey="autodiff-value"
          codeRef={runtimeCodeRefs['autodiff-value']}
          onCodeRef={onCodeRef}
          title="Value의 identity와 graph 연결을 실제 Rust allocation으로 확인"
        >
          같은 값을 복사하는 것이 아니라 같은 <code>Rc&lt;RefCell&lt;Node&gt;&gt;</code> handle을 clone한다.
        </CodeEvidence>
      </section>

      <section id="forward" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="02"
          kicker="순전파 기록"
          promise="숫자 계산과 graph 기록을 분리하고, generation과 소유권 방향을 한 번의 operation 생성에서 닫습니다."
        >
          출력값과 “누가 이 값을 만들었는가”를 함께 만든다
        </SectionTitle>
        <Prose>
          <p>
            Operation을 호출하면 먼저 입력 data로 출력 숫자를 계산한다. 기록 모드라면 operation은 입력 Value를 강하게
            소유하고, 출력 Value는 creator operation을 강하게 소유한다. Operation에서 output으로 돌아가는 방향만
            <code>Weak</code>로 둔다. 이렇게 해야 출력이 살아 있는 동안 역전파 경로가 유지되면서도
            <code>output → creator → output</code> 참조 cycle은 생기지 않는다.
          </p>
          <p>
            Operation의 generation은 입력 generation의 최댓값이다. 출력은 그보다 한 단계 뒤이므로 1을 더한다.
            이 두 값을 섞어 쓰면 backward queue가 잘못 정렬된다. 공식은 짧지만 실제 코드의 두 assignment에서 각각
            확인해야 하는 불변식이다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{g_f}_{\text{operation 깊이}}
            =
            \max_i\underbrace{g_{x_i}}_{\text{입력 깊이}},
            \qquad
            \underbrace{g_y}_{\text{출력 깊이}}
            =
            g_f+1
          `}
          meaning="Operation은 가장 늦게 만들어진 입력이 준비된 뒤 실행되므로 입력 generation의 최댓값을 갖는다. 출력 Value는 그 operation 결과이므로 한 단계 뒤다. Backward에서는 큰 generation의 operation부터 처리한다."
          symbols={[
            [String.raw`g_{x_i}`, 'i번째 입력 Value가 계산 그래프에서 놓인 깊이'],
            [String.raw`g_f`, '현재 operation의 queue 정렬 기준'],
            [String.raw`g_y`, '현재 operation이 만든 output Value의 깊이'],
            ['max', '입력이 여러 개일 때 가장 긴 선행 경로를 선택'],
          ]}
        />
        <CodeEvidence
          codeKey="autodiff-apply"
          codeRef={runtimeCodeRefs['autodiff-apply']}
          onCodeRef={onCodeRef}
          title="generation +1과 Weak output이 실제로 생기는 한 지점"
        >
          설명만으로 숨기지 않고 <code>apply</code> 안의 operation 생성과 output node 갱신을 함께 보여준다.
        </CodeEvidence>
      </section>

      <section id="backward" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="03"
          kicker="역방향 합성"
          promise="공유 DAG에서 한 operation만 처리하고 멈추거나, 두 번째 gradient를 덮어쓰는 두 가지 실패를 같은 예제로 분리합니다."
        >
          기울기를 전파한 뒤에는 입력의 creator도 queue에 넣어야 한다
        </SectionTitle>
        <Prose>
          <p>
            Scalar 출력 <code>z</code>에서 시작하면 초기 gradient는
            <code>∂z/∂z=1</code>이다. Queue에서 가장 높은 generation의 operation을 꺼내 output gradient와 local
            derivative를 곱한다. 여기까지는 한 층짜리 예제도 통과한다. 진짜 엔진은 각 input에 gradient를 기록한 뒤
            <strong>그 input을 만든 creator를 다시 queue에 넣어</strong> leaf까지 계속 간다.
          </p>
          <p>
            같은 <code>s</code>가 <code>y=s+s</code> 양쪽에 쓰이면 두 edge에서 gradient가 온다. 마지막 값으로
            overwrite하면 함수의 절반만 미분한 셈이다. 새 기여를 기존 gradient에 더해야 computation graph가 DAG일 때의
            total derivative가 된다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{\bar x}_{\text{x에 모인 전체 기울기}}
            =
            \sum_{p\in\operatorname{children}(x)}
            \underbrace{\bar y_p}_{\text{뒤쪽에서 온 기울기}}
            \underbrace{\frac{\partial y_p}{\partial x}}_{\text{현재 edge의 local 미분}}
          `}
          meaning="한 Value가 여러 operation의 입력으로 재사용되면 각 뒤쪽 경로가 만든 gradient contribution을 모두 더한다. 합산은 최적화 옵션이 아니라 multivariable chain rule 자체다."
          symbols={[
            [String.raw`\bar x`, '최종 scalar 출력에 대한 x의 gradient'],
            [String.raw`p`, 'x를 입력으로 사용한 뒤쪽 operation 하나'],
            [String.raw`\bar y_p`, '그 operation output까지 이미 계산된 upstream gradient'],
            [String.raw`\partial y_p/\partial x`, '현재 operation이 제공하는 local derivative'],
          ]}
        />
        <AutodiffGraphLab />
        <CodeEvidence
          codeKey="autodiff-backward"
          codeRef={runtimeCodeRefs['autodiff-backward']}
          onCodeRef={onCodeRef}
          title="누적 뒤 input creator를 enqueue하는 줄까지 확인"
        >
          <code>y=x·x; z=5·(y+y)</code>에서 최종 <code>∂z/∂x=60</code>이 되는 contract test도 같은 소스에 연결된다.
        </CodeEvidence>
      </section>

      <section id="higher-order" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="04"
          kicker="고차 미분"
          promise="Backward 중 계산을 graph로 기록할 때와 기록하지 않을 때를 분리하고, Newton 최적화가 왜 이차 미분을 요구하는지 정확히 연결합니다."
        >
          Gradient도 Value라면 첫 번째 역전파를 다시 역전파할 수 있다
        </SectionTitle>
        <Prose>
          <p>
            <code>create_graph=false</code>에서는 local backward의 곱셈과 덧셈을 기록하지 않는다. 일반 학습은 parameter
            gradient 숫자만 필요하므로 graph와 메모리를 아낀다. <code>true</code>에서는 gradient를 만드는 계산도
            operation graph가 된다. 그 gradient Value에 다시 <code>backward</code>하면 Hessian-vector product나 이차
            미분을 얻는다.
          </p>
          <p>
            Newton의 <strong>근 찾기</strong>는 <code>x←x−f/f′</code>다. 반면 아래 식은
            <code>f′(x)=0</code>인 stationary point를 찾기 위해 Newton법을 derivative에 적용한
            <strong>최적화 갱신</strong>이다. 목적을 섞으면 왜 <code>f″</code>가 필요한지 이해할 수 없다.
          </p>
        </Prose>
        <Formula
          latex={String.raw`
            \underbrace{x_{k+1}}_{\text{다음 위치}}
            =
            \underbrace{x_k}_{\text{현재 위치}}
            -
            \frac{
              \underbrace{f'(x_k)}_{\text{0으로 만들 기울기}}
            }{
              \underbrace{f''(x_k)}_{\text{기울기의 변화율}}
            }
          `}
          meaning="최적화용 Newton step은 f 자체의 근이 아니라 f′의 근, 즉 stationary point를 찾는다. 분자의 1차 미분이 현재 경사이고 분모의 2차 미분이 경사가 얼마나 빠르게 바뀌는지 보정한다."
          symbols={[
            [String.raw`x_k`, 'k번째 반복의 현재 parameter 위치'],
            [String.raw`f'(x_k)`, '0으로 만들고 싶은 현재 gradient'],
            [String.raw`f''(x_k)`, '현재 위치의 curvature. 0에 가까우면 step이 불안정해질 수 있음'],
            ['근 찾기와 차이', 'f(x)=0이면 x−f/f′, f′(x)=0이면 x−f′/f″'],
          ]}
        />
        <CodeEvidence
          codeKey="autodiff-no-grad"
          codeRef={runtimeCodeRefs['autodiff-no-grad']}
          onCodeRef={onCodeRef}
          title="Recording 상태를 scope가 끝날 때 되돌리는 RAII guard"
        >
          <code>no_grad</code>가 끝난 뒤 recording이 꺼진 채 남지 않는지 테스트한다.
        </CodeEvidence>
      </section>

      <section id="memory" className="mb-20 scroll-mt-20">
        <SectionTitle
          number="05"
          kicker="수명과 검증"
          promise="컴파일 성공을 넘어, graph의 정확성·기록 모드·메모리 수명을 각각 독립 contract로 닫습니다."
        >
          Rust가 참조 안전성을 보장해도 계산 그래프의 정답까지 보장하지는 않는다
        </SectionTitle>
        <Prose>
          <p>
            <code>Rc</code>는 single-threaded 공유 소유권이고 <code>RefCell</code>은 borrow 규칙을 runtime에 검사한다.
            따라서 <code>RefCell</code> borrow가 겹치면 compile error가 아니라 panic이 날 수 있다.
            <code>Weak::upgrade()</code>도 output이 이미 drop됐다면 <code>None</code>이다. “Rust니까 안전하다”는 문장은
            메모리 해제 후 접근 같은 일부 위험을 줄인다는 뜻이지, generation 정렬과 gradient 누적이 옳다는 뜻은 아니다.
          </p>
          <p>
            그래서 테스트를 세 층으로 나눈다. 공유된 여러 층 graph가 <code>60</code>을 내는지, 첫 미분 graph로
            <code>x³</code>의 이차 미분 <code>12</code>를 얻는지, output을 drop했을 때 operation도 cycle 없이 사라지는지
            각각 검사한다. 한 개의 “학습됨” test로는 어느 불변식이 깨졌는지 알 수 없다.
          </p>
        </Prose>
        <CodeEvidence
          codeKey="autodiff-tests"
          codeRef={runtimeCodeRefs['autodiff-tests']}
          onCodeRef={onCodeRef}
          title="숫자·순회·기록·수명을 분리한 실행 계약"
        >
          이 글의 코드는 <code>cargo test --manifest-path examples/dezero-rs/Cargo.toml</code>로 실제 실행된다.
        </CodeEvidence>
        <CapabilityCheck items={[
          'Forward에서 data 계산과 graph 기록을 구분할 수 있다.',
          'Generation이 operation과 output에서 왜 1 차이 나는지 설명할 수 있다.',
          '공유 DAG에서 gradient overwrite가 틀린 값을 만드는 예를 계산할 수 있다.',
          'create_graph와 no_grad가 서로 다른 목적이라는 것을 구분할 수 있다.',
          'Rc·RefCell·Weak가 보장하는 것과 보장하지 않는 것을 말할 수 있다.',
          '한 operation 뒤 입력 creator를 enqueue해야 하는 이유를 코드에서 찾을 수 있다.',
        ]} />
        <StopRule>
          여기서는 scalar Value와 작은 동적 graph까지만 만든다. Broadcasting, GPU tensor, 병렬 backward와 production-grade
          allocator까지 내려가지 않는다. 다음 글에서는 이 엔진 위에서 parameter 소유권과 한 번의 완전한 학습 step을 닫는다.
        </StopRule>
        <Prose>
          <p>
            미분의 chain rule 자체가 아직 낯설다면 먼저{' '}
            <InternalLink slug="calculus-computational-graphs" learningPathId="ai-from-scratch-rust">
              미분과 계산 그래프
            </InternalLink>
            에서 숫자로 검산하고 돌아오면 된다. 구현을 계속하려면{' '}
            <InternalLink slug="dezero-nn" learningPathId="ai-from-scratch-rust">
              신경망 Layer 구현
            </InternalLink>
            으로 이어간다.
          </p>
        </Prose>
        <SourceNotes sources={[
          {
            label: 'DeZero 공식 교재 페이지',
            href: 'https://koki0702.github.io/dezero-book/',
            note: '공식 구현의 범위와 Python 원전 위치. 이 글의 Rust 코드는 독립 교육용 재구성이다.',
          },
          {
            label: 'Deep Learning from Scratch 3 공식 저장소',
            href: 'https://github.com/oreilly-japan/deep-learning-from-scratch-3',
            note: '감사 시점 기준 b5f3cf1 commit의 core.py를 행동 참조로 사용했다.',
          },
          {
            label: 'Automatic Differentiation in Machine Learning: a Survey',
            href: 'https://www.jmlr.org/papers/v18/17-468.html',
            note: 'Forward/reverse accumulation과 AD의 수학적·계산적 구분을 정리한 1차 문헌이다.',
          },
          {
            label: 'Rust Book · Rc<T>와 RefCell<T>',
            href: 'https://doc.rust-lang.org/book/ch15-05-interior-mutability.html',
            note: 'Single-threaded 공유 소유권과 interior mutability의 보장 및 runtime borrow 조건.',
          },
          {
            label: 'Rust std::rc::Weak',
            href: 'https://doc.rust-lang.org/std/rc/struct.Weak.html',
            note: '비소유 참조와 upgrade가 None이 될 수 있는 수명 계약.',
          },
        ]} />
      </section>
    </>
  );
}
