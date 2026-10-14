import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import KvCellArrayViz from "./viz/KvCellArrayViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function Foundations() {
  return (
    <>
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 작은 기기 한 대에 8B 모델과 네 대화를 맞춥니다</h2>
        <div className={prose}>
          <p className="text-lg leading-8">
            GPU 메모리가 6GB인 노트북 한 대로 Llama 3.1 8B를 띄우고, 네 사람의 대화를 동시에 받는다고 해 봅시다. (가정) 가중치를 2 byte씩 그대로 두면
            16GB가 넘어 아예 올라가지 않습니다. 대화 기록인 KV cache도 16,384 token분이면 2GiB가 더 듭니다.
          </p>
          <p>
            llama.cpp는 이 상황을 세 가지 선택으로 풉니다. 첫째, KV를 요청마다 주소 표로 쪼개지 않고 cell 배열 하나에 적은 뒤 다른 대화의 칸은 계산에서
            지웁니다. 둘째, 가중치를 256개 묶음마다 144 byte로 줄인 그대로 두고 정수 곱셈으로 바로 계산합니다. 셋째, 층 일부만 GPU에 올리고 나머지는
            CPU가 계산합니다.
          </p>
          <p>
            세 선택 모두 데이터센터 엔진이 처리량을 올리려고 쓰는 장치를 덜어 내고 한 대의 기기에 맞춘 결과입니다. 그래서 각 선택이 무엇을 얻고 무엇을
            포기하는지가 이 글의 질문입니다. 같은 문제를 GPU 여러 장 위에서 푸는 방식은{" "}
            <Link to="/cs/ai/vllm-paged-attention#overview">vLLM의 PagedAttention</Link>에서 봅니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 입력은 token과 대화 번호, 출력은 다음 token 점수입니다</h2>
        <div className={prose}>
          <p>
            밖에서 보면 llama.cpp 서버는 단순합니다. 요청마다 token 목록과 그 요청이 속한 대화 번호를 받고, 대화마다 다음 token의 점수를 돌려줍니다. 대화
            번호를 sequence id라고 부르며, 서버의 slot 하나가 대화 하나를 맡습니다.
          </p>
          <p>
            안에는 세 부품이 있습니다. 대화의 기록을 적는 KV 배열, 양자화된 채 메모리에 놓인 가중치, 그리고 층마다 CPU와 GPU 중 어디서 계산할지 정한
            배치입니다. 세 부품은 서로 독립적으로 바꿀 수 있어 이 글도 하나씩 나눠 봅니다.
          </p>
          <p>
            먼저 KV 배열부터 봅니다. 대화가 넷이면 기록도 넷이어야 할 것 같지만 llama.cpp는 기본으로 배열 하나에 네 대화를 섞어 적습니다. 섞인 기록에서 각
            대화가 자기 것만 읽게 만드는 방법이 첫 질문입니다.
          </p>
        </div>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 16칸 배열에 두 대화를 적어 봅니다</h2>
        <div className={prose}>
          <p>
            칸이 16개인 배열을 준비합니다. (가정) 대화 A는 system prompt 4 token 뒤에 질문 3 token을 붙여 모두 7 token입니다. 각 token의 기록을 칸 0부터
            6까지 차례로 적고, 칸마다 그 token이 문장에서 몇 번째였는지를 0부터 6까지 함께 적습니다.
          </p>
          <p>
            대화 B도 같은 system prompt 4 token으로 시작하고 질문 2 token이 다릅니다. B의 앞 4 token 기록은 A가 이미 칸 0~3에 적어 두었습니다. 그래서 칸
            0~3에 B도 이 칸을 쓴다는 표시만 더하고, B의 뒷부분 2 token은 다음 빈칸 7·8에 위치 4·5로 적습니다.
          </p>
          <p>
            이제 두 대화가 한 token씩 더 만듭니다. A의 위치 7은 칸 9에, B의 위치 6은 칸 10에 들어갑니다. 사용 중인 칸은 7 + 2 + 2 = 11개이고, B가 가진 칸은
            0~3, 7, 8, 10의 7개입니다. B의 칸은 배열 안에서 연속이 아닙니다.
          </p>
          <p>
            B가 다음 token을 고르려면 자기 칸 7개의 기록만 읽어야 합니다. 칸 4·5·6·9는 A의 질문이라 B의 답에 섞이면 안 됩니다. A가 대화를 끝내면 A만 쓰던
            칸 4개는 비고, 둘이 함께 쓰던 칸 0~3은 B를 위해 남아야 합니다.
          </p>
        </div>
      </section>

      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 칸마다 위치 하나와 대화 표시 묶음을 적습니다</h2>
        <div className={prose}>
          <p>
            앞 절의 요구를 채우려면 칸 하나에 두 가지만 있으면 됩니다. 그 칸의 token 위치, 그리고 그 칸을 쓰는 대화들의 표시입니다. 표시는 대화마다 비트
            하나를 두어 켜고 끕니다. 공유는 비트를 하나 더 켜는 일이고, 대화가 끝나면 그 대화의 비트만 끕니다.
          </p>
          <p>
            읽을 때는 거꾸로 묻습니다. B의 질문 token은 배열의 칸을 앞에서부터 보며 B 비트가 켜진 칸만 남기고 나머지 칸의 점수를 지웁니다. 지운 칸은 계산에
            남아 있어도 결과에 아무 영향을 주지 않습니다. 그림의 다섯째 장면이 B가 읽는 한 행입니다.
          </p>
        </div>
        <KvCellArrayViz />
        <div className={prose}>
          <p>
            마지막 장면에서 A를 지운 뒤에도 칸 0~3이 남는 이유는 B 비트가 켜져 있어서입니다. 칸을 비울지는 그 칸의 비트가 모두 꺼졌는지만 보면 됩니다.
            누가 그 칸을 몇 번 빌렸는지 따로 셀 필요가 없습니다.
          </p>
        </div>
      </section>

      <section id="why-mask" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 주소 표 대신 지우기를 쓰면 표가 없어지고 읽을 칸이 늘어납니다</h2>
        <div className={prose}>
          <p>
            vLLM은 같은 문제를 반대로 풉니다. 대화마다 자기 기록이 놓인 block 번호의 목록을 들고 있고, 계산할 때 그 목록을 따라가 자기 block만 읽습니다.
            B는 [공유 block, B block] 같은 목록을 갖고 A의 block은 처음부터 보지 않습니다. 자세한 주소 변환은{" "}
            <Link to="/cs/ai/vllm-paged-attention#logical-physical-address">logical→physical 주소</Link> 절에 있습니다.
          </p>
          <p>
            llama.cpp에는 이 목록이 없습니다. 대신 배열의 앞쪽 칸을 한 범위로 통째로 넘기고, 다른 대화의 칸을 지우는 표를 함께 넘깁니다. 대화가 하나나 둘인
            기기에서는 목록을 관리하고 따라가는 장치가 없어도 되니 구현과 kernel이 단순합니다.
          </p>
          <p>
            대가는 읽을 범위입니다. B의 칸은 7개지만 B는 칸 0부터 사용 중인 마지막 칸까지를 범위로 받습니다. 대화가 많고 길수록 한 대화가 받은 범위에서 자기
            칸의 비율은 줄어듭니다. 이 비율을 숫자로 세는 일은 10절에서 합니다.
          </p>
          <p>
            칸이 부족할 때의 행동도 다릅니다. vLLM은 다른 요청을 밀어내고 그 block을 빼앗는 선점 경로가 있습니다. llama.cpp는 빈칸을 찾지 못하면 배열을 한 번
            정리해 본 뒤 decode 호출에 실패 값 1을 돌려줍니다. 다른 대화의 cell을 빼앗지는 않습니다. 배열을 빌려 쓰는 대화 수가 적다는 전제가 여기서도 보입니다.
          </p>
        </div>
      </section>

      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 칸·대화 표시·지우는 표에 이름을 붙입니다</h2>
        <div className={prose}>
          <p>
            배열의 칸 하나를 KV cell이라고 부릅니다. cell에는 token 위치 pos와 대화 표시 묶음이 있습니다. 대화 하나를 llama.cpp는 sequence라고 부르고, 표시
            묶음은 sequence마다 비트 하나를 둔 bitset입니다. 비트 수는 256개로 고정입니다.
          </p>
          <p>
            배열에서 이번 계산이 읽는 범위의 칸 수를 n_kv라고 부릅니다. 사용 중인 가장 뒤 cell 번호에 1을 더한 뒤 256의 배수로 올린 값입니다. 3절의 마지막
            사용 cell은 10번이라 11을 올린 256입니다.
          </p>
          <p>
            지우는 표는 KQ mask입니다. query token 하나마다 n_kv칸짜리 행이 있고, 남길 칸은 0, 지울 칸은 −∞입니다. attention 점수에 이 값을 더한 뒤
            softmax를 하면 e<sup>−∞</sup> = 0이라 지운 칸의 V가 출력에 들어가지 않습니다.
          </p>
          <p>
            서버에서 대화 하나를 맡는 자리는 slot입니다. slot들이 cell 배열 하나를 함께 쓰면 unified KV, slot마다 따로 쓰면 stream이 여럿인 구성입니다. 이 둘의
            차이는 10절에서 다룹니다.
          </p>
        </div>
      </section>

      <section id="request-trace" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. B의 decode 한 step을 cell 찾기부터 mask까지 따라갑니다</h2>
        <div className={prose}>
          <p>
            3절의 넷째 장면, B가 위치 6을 만드는 step을 따라갑니다. 먼저 새 token을 쓸 cell을 찾습니다. 배열의 head는 직전에 쓴 칸 다음을 가리키고, 그
            자리부터 빈 cell을 찾습니다. A가 방금 칸 9를 썼으므로 B는 칸 10을 받습니다.
          </p>
          <p>
            칸 10의 pos를 6으로 적고 B 비트를 켭니다. 다음으로 n_kv를 정합니다. 사용 중인 마지막 cell은 10번이라 11을 256으로 올려 n_kv = 256입니다. 이번 계산의
            K와 V는 cell 0~255 범위를 그대로 넘깁니다.
          </p>
          <p>
            마지막으로 mask 행을 채웁니다. 256칸 각각에 대해 빈 cell이면 −∞, B 비트가 없으면 −∞, pos가 6보다 크면 −∞, 나머지는 0입니다. 남는 칸은 0~3, 7, 8,
            10의 7칸이고 249칸이 지워집니다. 아래 의사코드는 같은 순서를 한 줄씩 보여 줍니다.
          </p>
        </div>
        <AlgorithmBlock
          title="B의 위치 6 token 하나를 처리하는 KV 단계 (의사코드)"
          input={["cells: 16칸, cell 0~9 사용 중", "token: sequence B, 위치 6", "head = 10"]}
          steps={[
            { code: "idx ← head부터 첫 빈 cell", note: "칸 10이 비어 있어 idx = 10입니다." },
            { code: "cells[idx].pos ← 6; cells[idx].seq ← {B}", note: "B 비트 하나만 켭니다." },
            { code: "n_kv ← pad(마지막 사용 cell + 1, 256)", note: "pad(11, 256) = 256입니다." },
            { code: "for j in 0..n_kv-1: mask[j] ← (빈칸 또는 B 아님 또는 pos > 6) ? −∞ : 0", note: "0인 칸은 0~3, 7, 8, 10의 7칸입니다." },
            { code: "attention(Q_B, K[0..255], V[0..255], mask)", note: "−∞ 칸은 softmax 뒤 가중치 0이 됩니다." },
          ]}
          output="B의 위치 6 출력은 B의 cell 7개의 V만 섞은 값입니다."
        />
        <div className={prose}>
          <p>
            이 흐름에서 B의 기록을 어디서 찾을지 정하는 목록은 한 번도 나오지 않았습니다. 정한 것은 범위 하나와 mask 한 행입니다. 다음 두 절은 이 단계가 실제
            원문의 어느 줄에 있는지 확인합니다.
          </p>
        </div>
      </section>
    </>
  );
}
