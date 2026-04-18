import R1CSGenViz from './viz/R1CSGenViz';
import M from '@/components/ui/math';

export default function R1CSGen({ title }: { title?: string }) {
  return (
    <section id="r1cs-gen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'R1CS 제약 생성'}</h2>
      <div className="not-prose mb-8">
        <R1CSGenViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>constraint_generation</code> 모듈은 Circom 컴파일러의 핵심입니다.<br />
          파싱된 AST를 실제 R1CS(Rank-1 Constraint System) 제약으로 변환하며,
          DAG 기반 최적화로 불필요한 제약을 제거합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">build_circuit — 제약 생성 진입점</h3>
        <div className="not-prose rounded-lg border p-4 text-sm space-y-3 mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">① 인스턴스화: 템플릿 → 컴포넌트</p>
            <div className="font-mono text-xs">
              <p>instantiation(&program, flags, &config.prime)</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">재귀적 템플릿 언롤링</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">② 내보내기: ExecutedProgram → DAG + VCP</p>
            <div className="font-mono text-xs">
              <p>export(exe, program, flags)</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">DAG + Variable CP 구조로 변환</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">③ 최적화: DAG 기반 제약 단순화</p>
            <div className="font-mono text-xs">
              <p>simplification_process(&mut vcp, dag, &config)</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">DAG 기반 제약 최적화</p>
          </div>
        </div>

        <h3>R1CS 제약 형식</h3>
        <p>
          모든 제약은 <strong>A * B = C</strong> 형태입니다.
          <code>{'c <== a * b'}</code>는 단일 R1CS 제약으로 변환되지만,
          <code>{'c <== a * b + d'}</code>는 중간 시그널을 추가하여 두 개의 제약으로 분해됩니다.
        </p>
        <M display>{'\\langle A, s \\rangle \\times \\langle B, s \\rangle = \\langle C, s \\rangle'}</M>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">컴파일 파이프라인</h3>

        <div className="not-prose flex flex-col gap-2 mb-6">
          {[
            { step: 1, label: 'Parsing', detail: 'LALRPOP LR(1) 파서 → AST (Template, Function, Component, Statement, Expression)' },
            { step: 2, label: 'Type Analysis', detail: '시그널 타입 추론, 매개변수 검증, signal vs var 검사, 차원 불일치 감지' },
            { step: 3, label: 'Instantiation', detail: '모든 루프 언롤링 (정적 바운드 필수), 구체적 매개변수로 템플릿 확장' },
            { step: 4, label: 'DAG Construction', detail: '각 제약을 A, B, C 선형 결합으로 표현. 시그널 = 노드, 제약 = 하이퍼엣지' },
            { step: 5, label: 'Simplification', detail: '미사용 시그널 제거, 선형 제약 대체, 항등 제약 제거, 상수 전파' },
            { step: 6, label: 'Serialization', detail: '.r1cs 바이너리 (Header + Constraints + Map), .sym, .json (선택)' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
              <span className="flex-none w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs font-bold">{s.step}</span>
              <div>
                <span className="font-medium">{s.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">제약 생성 규칙</h3>
        <div className="not-prose space-y-3 mb-6">
          <div className="rounded-lg border p-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
                <p className="text-xs font-medium mb-1">c <code>{'<=='}</code> a * b</p>
                <p className="text-xs text-muted-foreground">→ 1 R1CS 제약: A=a, B=b, C=c</p>
              </div>
              <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
                <p className="text-xs font-medium mb-1">c <code>{'<=='}</code> a + b</p>
                <p className="text-xs text-muted-foreground">→ 선형 제약 (a+b-c=0). R1CS 0개 (흡수 가능)</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
                <p className="text-xs font-medium mb-1">c <code>{'<=='}</code> (a+b) * (d+e)</p>
                <p className="text-xs text-muted-foreground">→ 1 R1CS: A=a+b, B=d+e, C=c</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3">
                <p className="text-xs font-medium mb-1">c <code>{'<=='}</code> a * b + d</p>
                <p className="text-xs text-muted-foreground">→ 2 R1CS: aux=a*b, c=aux+d(선형 흡수)</p>
              </div>
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded p-3 sm:col-span-2">
                <p className="text-xs font-medium mb-1">c <code>{'<=='}</code> a * b * d (삼중 곱)</p>
                <p className="text-xs text-muted-foreground">→ 2 R1CS: aux=a*b, c=aux*d</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">최적화 패스</h3>
        <div className="not-prose grid gap-2 sm:grid-cols-2 mb-6">
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-sky-600 dark:text-sky-400 mb-2">Pass A: 미사용 시그널 제거</p>
            <p className="text-xs text-muted-foreground">어떤 출력에도 기여하지 않는 시그널 삭제</p>
          </div>
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mb-2">Pass B: 선형 제약 소거</p>
            <p className="text-xs text-muted-foreground">
              x = sum(k_i * s_i) 형태의 선형 관계 → x를 모든 곳에서 대체. 중간 시그널 제거
            </p>
          </div>
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-amber-600 dark:text-amber-400 mb-2">Pass C: 항등 제약 감지</p>
            <p className="text-xs text-muted-foreground">0 = 0 제거, 상수 전파</p>
          </div>
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-violet-600 dark:text-violet-400 mb-2">Pass D: 커스텀 게이트 인식</p>
            <p className="text-xs text-muted-foreground">제약 그룹을 템플릿으로 매핑 (고급)</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">선형 결합 최적화</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <p className="text-xs text-muted-foreground mb-2">
            Circom은 "선형 결합"을 1급 객체로 추적:
          </p>
          <M display>{'LC = \\{ s_1: k_1, s_2: k_2, \\ldots \\} \\quad \\Rightarrow \\quad \\sum k_i \\cdot s_i'}</M>
          <p className="text-xs text-muted-foreground mt-2">가능하면 LC를 A 또는 B 열에 병합 → R1CS 제약 수 ~30-50% 감소</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">DAG 최적화 예시</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
              <p className="text-xs font-semibold mb-1">최적화 전 (제약 2개)</p>
              <div className="font-mono text-xs space-y-1">
                <p>d <code>{'==='}</code> a + b + c</p>
                <p>c <code>{'==='}</code> 2 * b</p>
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
              <p className="text-xs font-semibold mb-1">최적화 후 (제약 1개)</p>
              <div className="font-mono text-xs space-y-1">
                <p className="text-muted-foreground">c는 b에 대해 선형 → c 제거</p>
                <p>d = a + b + 2b = a + 3b</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">실전 최적화 수치</h3>
        <div className="not-prose overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">프로젝트</th>
                <th className="text-left py-2 px-3">원래 제약</th>
                <th className="text-left py-2 px-3">최적화 후</th>
                <th className="text-left py-2 px-3">감소율</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3 font-medium">Semaphore v4</td>
                <td className="py-2 px-3 font-mono text-xs">~12,000</td>
                <td className="py-2 px-3 font-mono text-xs">~8,500</td>
                <td className="py-2 px-3 text-muted-foreground">~30%</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3 font-medium">Tornado Cash</td>
                <td className="py-2 px-3 font-mono text-xs">~24,000</td>
                <td className="py-2 px-3 font-mono text-xs">~12,000</td>
                <td className="py-2 px-3 text-muted-foreground">~50%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-semibold mt-6 mb-3">빌드 설정 플래그</h4>
        <div className="not-prose grid gap-2 sm:grid-cols-2 mb-4">
          {[
            { flag: '--O0', desc: '최적화 없음 (빠른 컴파일)' },
            { flag: '--O1', desc: '기본 최적화 (기본값)' },
            { flag: '--O2', desc: '전체 단순화 (느리지만 작은 R1CS)' },
            { flag: '-f / --fast', desc: '일부 최적화 건너뛰기' },
          ].map(f => (
            <div key={f.flag} className="rounded-lg border p-3 text-sm flex items-center gap-3">
              <code className="font-mono text-xs font-semibold flex-none">{f.flag}</code>
              <span className="text-muted-foreground text-xs">{f.desc}</span>
            </div>
          ))}
        </div>

        <h4 className="font-semibold mt-6 mb-3">.r1cs 바이너리 포맷</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-4">
          <p className="text-xs text-muted-foreground mb-2">iden3/r1csfile 스펙 기준</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded bg-sky-50 dark:bg-sky-950/30 p-2 text-xs">
              <p className="font-semibold">Header</p>
              <p className="text-muted-foreground">필드 소수, 제약 수, 시그널 수</p>
            </div>
            <div className="rounded bg-emerald-50 dark:bg-emerald-950/30 p-2 text-xs">
              <p className="font-semibold">Constraint Section</p>
              <p className="text-muted-foreground">각 제약마다 3개의 선형 결합</p>
            </div>
            <div className="rounded bg-amber-50 dark:bg-amber-950/30 p-2 text-xs">
              <p className="font-semibold">Map Section</p>
              <p className="text-muted-foreground">시그널 인덱스 → 라벨 문자열</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
