# g-ac 수식 주석 재작성 원장 (2026-10-09, 2차 범용 템플릿 문구)

대상 27개 파일, 33개 식의 `annotatedFormula`와 `operations`를 다시 썼다. `formula`·`question`·`idea`·`terms`·`interpretation`·`assumptions`·본문은 바꾸지 않았다(`terms[].name`은 모두 뜻이 있어 유지).

공통 문제는 두 가지였다. 범용 라벨(`기준량당 비율`, `허용 경계 판정`, `경계 후보 선택`, `판정 조건 결합`)과, underbrace 하나가 `,\qquad`를 넘어 서로 다른 두 식을 통째로 감싸는 구조다. SchwartzZippel은 `\Pr[R(r)=\underbrace{0]\le…}`처럼 괄호 중간에서 잘려 있기도 했다. 이번에 각 항·분자·분모·조건마다 underbrace를 따로 달고, annotation에는 글의 `interpretation`·`idea`에 있는 수치를 대입했다.

## 파일별 재작성 수

| 파일 (src/pages/articles/blockchain/) | 식 수 |
|---|---|
| drand/ModernArticle.tsx | 1 |
| dydx/ModernArticle.tsx | 1 |
| evmos/ModernArticle.tsx | 1 |
| fft/Butterfly.tsx | 1 |
| fft/UnitRoot.tsx | 1 |
| fft/ZKUsage.tsx | 1 |
| field-arithmetic/Montgomery.tsx | 1 |
| filecoin-lotus/ModernArticle.tsx | 1 |
| finite-field-theory/PolynomialArithmetic.tsx | 1 |
| finite-field-theory/PrimeField.tsx | 2 |
| finite-field-theory/SchwartzZippel.tsx | 1 |
| gossipbft/ModernArticle.tsx | 1 |
| gpu-architecture/MemoryHierarchy.tsx | 1 |
| gpu-architecture/Warp.tsx | 1 |
| impl-field-arithmetic/ModernArticle.tsx | 4 |
| iroh/ModernArticle.tsx | 1 |
| lagrange/Formula.tsx | 1 |
| lagrange/Usage.tsx | 1 |
| longest-chain/ModernArticle.tsx | 2 |
| lotus-market/ModernArticle.tsx | 1 |
| lotus-mpool/ModernArticle.tsx | 1 (3번째 식) |
| proofs-snark/ModernArticle.tsx | 1 (3번째 식) |
| reed-solomon/Encoding.tsx | 1 |
| reed-solomon/ErrorCorrection.tsx | 2 |
| reed-solomon/ZKConnection.tsx | 1 |
| scroll-zkevm/ModernArticle.tsx | 1 |
| smr-theory/LogReplication.tsx | 1 |
| **합계** | **33** |

## 대표 before/after (gossipbft/ModernArticle.tsx)

Before:
- `w(Q_1\cap Q_2)\ge \underbrace{q_1+q_2-W>\frac W3}_{\text{허용 경계 판정}}`
- annotation `["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","두 signer 집합의 power 합에서 전체 W를 빼면","교집합 power의 하한을 얻습니다."]`

After:
- `\underbrace{w(Q_1\cap Q_2)}_{\text{양쪽에 서명한 power}}\ge \underbrace{q_1+q_2-W}_{\text{겹침 하한}}>\underbrace{\frac W3}_{\text{Byzantine 한도}}`
- `q_1+q_2-W`: `["두 signer 집합 power를 더하고 전체 W를","빼면 겹친 power의 최소치가 남습니다","W=120에서 81+81−120=42"]`
- `\frac W3`: `["각 quorum이 2W/3 초과면 겹침은 W/3 초과","Byzantine power가 40 미만이면","겹침에 honest power가 반드시 있습니다"]`

## 검증

- 2차 범용 문구 grep: 0건. 1차 기계 marker grep: 0건.
- `node scripts/audit-formula-annotations.mjs --strict --require-explicit`: 통과 (1475/1475).
- `npx eslint <27 files>`: 0 error.
- KaTeX `throwOnError:true, strict:"error"`: 27개 파일의 annotatedFormula와 operations.expression(`\underbrace{}`로 감싼 형태) 125개 문자열 모두 렌더 성공.
- 추가 기계 검사: 재작성한 33개 식에서 underbrace를 걷어낸 annotatedFormula가 공백을 빼고 `formula`와 같다. 모든 expression이 `formula`의 실제 부분 문자열이다. annotation은 연산당 1~3줄이고 한 줄 34자 이내다. `\text{}` 라벨에는 그리스 문자, `^`, `_`, `\`가 없다.
- `npx tsc -b --noEmit`: 저장소 전체 실행은 node OOM(exit 134)으로 끝났다. 대신 27개 파일만 `tsconfig.app.json`을 extends해 검사했고, 이 파일들에서 난 오류는 0건이다. 남은 5건은 filecoin-lotus/codeRefs.ts의 `?raw` import인데, 격리 검사에서 `vite/client` 타입을 뺐기 때문에 생긴 것이라 이번 수정과 관계없다.

## 검토 필요

1. **impl-field-arithmetic/ModernArticle.tsx, n′ 정의 불일치 (`formula` prop)**: 1번째 식은 `n'=-p_0^{-1}\bmod 2^w`(word 단위 상수)로 정의한다. 3번째 식 `m=(T\bmod R)n'\bmod R`는 같은 n′를 R 전체 폭의 −p⁻¹ mod R처럼 쓰고, 3번째 식 terms도 "-p^(-1) mod R이며 word implementation은 낮은 words부터 적용"이라고 적는다. 같은 글에서 기호 하나가 두 뜻을 가진다. 기호를 나누거나(예: n′₀ vs N′) 3번째 식을 word-serial(CIOS) 형태로 고칠지 저자 판단이 필요하다. 주석은 각 식의 현재 정의를 따랐다.
2. **impl-field-arithmetic 3번째 식의 conditional subtraction**: 주석의 "bounded된 u에서 p를 한 번 빼 [0,p)로"는 u<2p, 즉 T<pR 전제가 있어야 성립한다. 글의 `assumptions`에는 이 전제가 명시되어 있지 않다.
3. **reed-solomon/ErrorCorrection.tsx 1번째 식**: `2e+s`가 식에 두 번 나온다. 앞쪽 하나에만 "소모하는 distance" 라벨을 달고 operation은 `2e+s\le n-k`에 붙였다.
4. **iroh/ModernArticle.tsx**: 라벨 "같은 tier, 5ms 이득"은 `T_c=T_o\land …` 조건 전체를 감싼다. 숫자 대입(18+5>20 유지, 11+5≤20 교체)은 interpretation 그대로다.
5. 그 밖에 모든 식의 수치 사례를 다시 계산했고 오류는 없었다. 확인한 값: Montgomery p=17·R=32의 m=27과 REDC 결과 15→1, F₁₇의 ω=9와 order 8, 3⁸≡16, (1/9)⁶≈1.88e-6, (10,6) RS 경계, GF(7) [2,5,1,4], lotus-mpool min(3,2)=2, iroh bias 계산, gossipbft 42>40.
