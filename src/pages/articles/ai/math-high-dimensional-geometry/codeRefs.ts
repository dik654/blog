import type { CodeRef } from "@/components/code/types";
import source from "./codebase/scikit-learn/sklearn/random_projection.py?raw";
const common={path:"scikit-learn/sklearn/random_projection.py",code:source,lang:"python" as const};
export const projectionCodeRefs:Record<string,CodeRef>={
gaussian:{...common,highlight:[201,206],desc:"scikit-learn 1.7.2 고정 원문 전체입니다. 표준편차는 1/√k이므로 분산은 1/k입니다. 같은 입력 집합에 한 번 만든 행렬을 공통으로 사용합니다.",annotations:[{lines:[203,205],color:"sky",note:"k=1, D=4이면 성분 네 개를 표준정규분포에서 뽑습니다. 본문의 [1/2,1/2,1/2,1/2]는 직접 정한 행렬이며 이 생성기의 고정 출력이 아닙니다."}]},
transform:{...common,highlight:[604,612],desc:"같은 원문의 GaussianRandomProjection.transform입니다. 점을 행으로 둔 X에 사영 행렬의 전치를 곱합니다.",annotations:[{lines:[612,612],color:"sky",note:"네 점의 X는 4×4, 한 칸을 만드는 components_는 1×4입니다. 설명용 행렬을 대입하면 출력 4×1의 값은 0,2,4,6입니다."}]},
auto:{...common,highlight:[389,408],desc:"자동 크기는 johnson_lindenstrauss_min_dim을 부릅니다. 같은 파일 145–146행은 실수 식을 np.int64로 바꾸어 양수의 소수부를 버립니다. n=4와 ε=0.2의 반환값 319는 올림한 수학적 충분 크기 320과 다릅니다.",annotations:[{lines:[392,394],color:"sky",note:"n=4, ε=0.2이면 원문이 계산하는 차원은 319입니다. 데이터의 직선 구조는 이 계산에 들어가지 않습니다."},{lines:[402,408],color:"emerald",note:"319가 입력의 4좌표보다 크므로 자동 모드는 ValueError를 냅니다. 특정 데이터가 한 칸으로 압축 불가능하다는 증명은 아닙니다."}]},
};
