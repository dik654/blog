import type { CodeRef } from "@/components/code/types";
import fft from "./codebase/kiss/kiss_fft.c?raw";
import guts from "./codebase/kiss/_kiss_fft_guts.h?raw";
import run from "./codebase/verify_kiss.c?raw";
import audio from "./codebase/whisper/whisper/audio.py?raw";
const common={path:"kissfft/kiss_fft.c",code:fft,lang:"c" as const};
export const fftCodeRefs:Record<string,CodeRef>={
state:{path:"kissfft/_kiss_fft_guts.h",code:guts,lang:"c",highlight:[27,42],desc:"KISS FFT commit e5e3fac4의 수정하지 않은 내부 헤더입니다. 상태 필드와 float·고정소수점의 다른 배율 처리를 확인합니다.",annotations:[{lines:[27,31],color:"sky",note:"길이 4, inverse=0, 분해 [4,1]과 회전표를 하나의 상태에 보관합니다."},{lines:[84,90],color:"emerald",note:"FIXED_POINT를 정의하지 않은 빌드에서 C_FIXDIV는 NOOP입니다. 함수 이름만 보고 실제 나눗셈으로 세지 않습니다."}]},
factor:{...common,highlight:[274,327],desc:"같은 원문의 입력 복사·butterfly 분기·인수 분해입니다. 본문의 길이 4는 실제로 radix-4를 택합니다.",annotations:[{lines:[307,327],color:"sky",note:"p=4부터 검사해 n=4를 나누고 [p,m]=[4,1]을 기록합니다."},{lines:[274,296],color:"emerald",note:"m=1이면 네 입력을 복사합니다. p=4 분기가 kf_bfly4를 부르며 두 번의 radix-2 재귀는 실행하지 않습니다."}]},
butterfly:{...common,highlight:[38,84],desc:"실제로 실행한 길이 4 경로입니다. m=1에서 회전표의 첫 원소 1을 곱한 뒤 네 출력을 조립합니다.",annotations:[{lines:[57,64],color:"sky",note:"scratch[0..2]는 2,3,4입니다. scratch[5]=−2, 첫 임시 값 4, scratch[3]=6, scratch[4]=−2가 됩니다."},{lines:[65,80],color:"emerald",note:"첫·셋째 출력은 10과 −2입니다. inverse=0 분기는 둘째·넷째 출력을 −2+2i와 −2−2i로 만듭니다."}]},
alias:{...common,highlight:[375,403],desc:"입출력 포인터를 같게 준 경우의 실제 메모리 처리입니다. API 사용 가능성과 추가 작업 배열 없는 계산을 구별합니다.",annotations:[{lines:[377,395],color:"sky",note:"임시 복소 배열을 할당하고 그곳에 계산한 뒤 원래 배열에 memcpy합니다. 본문 실험은 이 분기를 실행했습니다."}]},
run:{path:"article/verify_kiss.c",code:run,lang:"c",highlight:[9,20],desc:"글에서 작성한 검증 호출 예제입니다. 실제 고정 C 원문을 cc -std=c11 -Wall -Wextra -O2로 컴파일해 CPU에서 실행했습니다. 속도 측정은 하지 않았습니다.",annotations:[{lines:[10,15],color:"sky",note:"같은 입력 [1,2,3,4]를 순방향으로 계산하고 실수부·허수부를 각각 비교합니다."},{lines:[16,19],color:"emerald",note:"원시 역변환 [4,8,12,16]을 4로 나눈 값을 비교한 뒤 같은 포인터 경로도 확인합니다."}]},
whisper:{path:"whisper/whisper/audio.py",code:audio,lang:"python",highlight:[143,157],desc:"Whisper commit 86098128의 전체 audio.py 원문입니다. 실제 실행한 모델 결과가 아니라 코드의 데이터 흐름을 추적합니다.",annotations:[{lines:[12,16],color:"sky",note:"표본률 16000, 변환 길이 400, 이동 길이 160입니다. 25 ms와 10 ms를 직접 계산할 수 있습니다."},{lines:[147,153],color:"emerald",note:"abs() ** 2는 복소 길이의 제곱입니다. [..., :-1]은 마지막 시간 구간을 제외하고 Mel 필터 행렬이 주파수 축을 섞습니다."},{lines:[154,157],color:"sky",note:"로그와 하한 처리 뒤 (값+4)/4를 적용합니다. 이 특징값은 원래의 모든 복소 계수와 다릅니다."}]},
};
