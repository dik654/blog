import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import PrefixCachingRadixAttentionViz from "./prefix-caching-radix-attention/viz/PrefixCachingRadixAttentionViz";
import { codeRefs } from "./prefix-caching-radix-attention/codeRefs";
import { prefixTrees } from "./prefix-caching-radix-attention/fileTree";
export default function PrefixCachingRadixAttentionArticle() {const sidebar=useCodeSidebar();return <><div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><span id="problem" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">1. 앞부분을 이미 읽었다면 어디서 이어 계산할까요?</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 안내문 뒤에 서로 다른 질문을 붙여 세 번 보낸다고 합시다. 앞의 안내문을 매번 처음부터 읽으면 같은 계산을 반복합니다. 이전에 읽으며 만든 기록을 남겨 두면 다음 요청은 그 기록을 사용하고 달라진 뒷부분부터 계산할 수 있습니다.</p><p>그러려면 무엇이 같은 앞부분인지 찾고, 기록이 아직 남아 있는지 확인해야 합니다. 새 요청이 쓰는 동안 다른 요청이 그 자리를 덮어써도 안 됩니다. 이 글은 여덟 자리 입력 세 개를 찾기·공유·보호·반환까지 따라갑니다.</p><p>재사용한 입력이 많다는 것과 응답이 빨랐다는 것은 다른 관측입니다. 기록을 찾는 비용과 실행 순서도 있기 때문입니다. 우선 생략한 계산의 자리 수와 실제 보관한 자리 수부터 따로 셉니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 입력 번호와 저장된 기록을 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>입구에서는 새 입력의 번호 열을 받습니다. 찾는 부품은 이전 입력과 처음부터 연속으로 같은 부분을 찾고 그 기록의 저장 위치를 돌려줍니다. 계산 담당자는 그 위치를 참고하며 새 뒷부분을 처리합니다. 끝난 뒤에는 다음 요청이 찾아올 수 있도록 새 기록도 등록합니다.</p><p>입력 번호 자체가 중간 계산 기록은 아닙니다. 번호가 5인 입력을 읽었다고 기록 안의 값도 5가 되는 것은 아닙니다. 번호는 같은 입력인지 찾는 데 쓰이고 저장 위치는 여러 층이 만든 실제 값을 찾는 데 쓰입니다.</p><p>모델과 입력을 해석하는 조건도 같다고 가정합니다. 같은 번호 열이라도 모델이 달라지면 그 기록을 바꾸어 쓸 수 없습니다. 요청마다 다르게 넣은 추가 입력이 있다면 그것도 구별해야 합니다. 이 구별이 끝난 뒤에야 공유 가능한 길이를 셉니다.</p><p>완성된 답변을 그대로 복사하는 기능도 아닙니다. 이전에 읽은 앞부분의 계산 기록을 넘겨받은 뒤 현재 질문의 답은 다시 생성합니다. 앞부분을 재사용하는 일과 이후에 어떤 답을 고르는 일을 구분해야 저장할 내용을 이해할 수 있습니다.</p></div></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 여덟 자리 중 앞 여섯 자리가 같습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>첫 요청 R1은 [1,2,3,4,5,6,7,8]입니다. 처음에는 저장된 기록이 없으므로 여덟 자리를 계산하고 기록을 남깁니다. 여기의 숫자는 입력을 구별하는 설명용 번호이며 실제 모델을 실행한 측정값은 아닙니다. (가정)</p><p>다음 R2는 [1,2,3,4,5,6,9,10]입니다. R1과 앞 여섯 자리가 같고 일곱째부터 다릅니다. 한 자리씩 재사용할 수 있다면 여섯 자리의 계산 기록을 가져오고 뒤의 두 자리를 새로 계산합니다.</p><p>R3는 [1,2,3,4,5,6,11,12]입니다. 같은 방법으로 여섯 자리를 재사용하고 두 자리만 추가합니다. 세 입력은 모두 여덟 자리이지만 뒤의 두 자리는 요청마다 다릅니다. 뒷부분만 우연히 같은 다른 요청은 앞 여섯 자리까지 같다는 조건을 대신하지 못합니다.</p><p>첫 번호만 바꾼 [0,2,3,4,5,6,7,8]도 비교해 봅시다. 뒤의 일곱 번호는 R1과 같지만 처음부터 이어지는 같은 구간은 없습니다. 앞을 읽으며 생긴 기록이 뒤의 계산에도 영향을 주기 때문에 같은 번호가 뒤에 나타났다는 사실만으로 그 위치의 기록을 가져올 수 없습니다. 이 사례에서는 시작부터 다시 계산합니다. (가정)</p><p>어떤 요청을 장부에 넣었는지도 결과를 바꿉니다. R2 하나만 보면 여덟 자리 중 여섯 자리를 재사용해 75%입니다. 하지만 처음 준비한 R1까지 포함하고 R3도 더하면 총 스물네 자리 중 열두 자리인 50%입니다. 처음의 계산을 빼고 반복 요청만 보고하면 같은 기능의 비율도 더 높게 보입니다. (가정)</p><p>세 요청은 순서대로 처리하고 다음 요청이 오기 전에 앞 기록이 준비되어 있다고 둡니다. 생성하며 추가한 기록은 이번 장부에서 제외합니다. 저장 공간은 중간에 지우지 않을 만큼 충분하며 모든 요청이 같은 모델과 재사용 영역을 사용합니다.</p><p>입력이 동시에 들어오면 이 시간 순서가 바뀝니다. 아직 R1의 계산이 끝나지 않았는데 R2가 같은 번호를 가졌다는 이유만으로 준비된 기록이 있다고 볼 수 없습니다. 앞으로 세는 여섯 자리의 재사용은 이미 계산된 기록을 찾았다는 가정의 결과입니다.</p></div></section>

<section id="inside-tree" data-teach-level="1" className="scroll-mt-20"><span id="radix-tree" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">4. 공통 여섯 자리와 서로 다른 끝을 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>R1 하나만 남았을 때는 여덟 자리를 한 구간으로 기록해도 됩니다. R2를 받으면 그 구간을 공통 여섯 자리와 R1의 뒤 두 자리로 나눕니다. 그 공통 부분에서 R2의 뒤 두 자리로 가는 길도 추가합니다.</p><p>이 구조에는 공통 여섯 자리 한 벌과 서로 다른 끝 두 벌이 있습니다. 그래서 R1과 R2를 따로 여덟 자리씩 보관한 16자리 대신 6+2+2=10자리를 보관합니다. R3까지 넣으면 6+2+2+2=12자리입니다.</p><p>찾는 구조를 둘로 나누었다고 이전 계산 값을 전부 복사할 필요는 없습니다. 앞 여섯 자리가 이미 있는 위치를 두 길이 함께 가리키면 됩니다. 입력 구간을 나타내는 작은 목록과 여러 층의 실제 계산 기록은 크기도 역할도 다릅니다.</p><p>R2가 새로 계산하는 두 자리도 앞 여섯 자리의 기록을 참고합니다. 앞 기록을 재사용한다고 해서 뒤 계산이 과거 입력을 보지 않는 것은 아닙니다. 생략한 것은 같은 앞 위치의 기록을 다시 만드는 작업입니다.</p></div><PrefixCachingRadixAttentionViz /></section>

<section id="why-split" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 누가 읽는지 모르면 안전하게 지울 수 없습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>공통 여섯 자리를 R3가 사용 중인데 R1이 끝났다는 이유로 지우면 R3의 다음 계산이 잘못됩니다. 요청의 끝과 공유 기록의 수명은 같지 않습니다. 여러 요청이 같은 기록을 함께 사용하는 횟수를 별도로 알아야 합니다.</p><p>반대로 아무도 쓰지 않는 기록을 계속 남기면 새 요청의 공간이 줄어듭니다. 뒤의 두 자리씩부터 지우면 공통 여섯 자리를 남길 수 있습니다. 다만 아직 사용하는 경로는 이 순서에서도 지울 수 없습니다.</p><p>예를 들어 R3 경로의 여덟 자리가 사용 중이면 R1과 R2에만 속한 네 자리만 돌려줄 수 있습니다. 새 요청이 다섯 자리를 요구해도 네 자리가 전부라면 부족하다고 알려야 합니다. 보호된 자리를 억지로 내주어 수량만 맞추면 안 됩니다. (가정)</p><p>이제 찾는 부품뿐 아니라 기록을 함께 가리키는 구조와 사용 중인 경로를 보호하는 장치가 필요해졌습니다. 어떤 요청을 먼저 실행할지도 기록이 남는 기간에 영향을 줍니다. 다음 절부터 각 역할의 이름을 붙입니다.</p></div></section>

<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 공통 앞부분과 기록을 찾는 구조에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>입력의 공통 앞부분을 prefix라고 합니다. 이전 계산에서 남은 K·V 기록을 보관해 같은 앞부분에 재사용하는 기능이 prefix cache입니다. 한 자리의 실제 KV 크기는 모델에 따라 다릅니다.</p><p>여러 입력이 공통 구간까지 같은 길을 따라가다가 다른 구간에서 갈라지는 구조를 radix tree라고 합니다. 연결 하나에 여러 입력 번호를 담아 긴 공통 구간을 한꺼번에 나타냅니다. 갈라지는 지점에는 구간의 위치 목록과 자식 경로를 둡니다.</p><p>
            같은 앞 기록을 찾은 길이는 얼마나 계산을 생략할지 정하는 출발점입니다. R2의 한 자리 단위 사례는 앞 6을 재사용하며 나머지 2를 계산합니다. 더 큰 저장 묶음이나 추가
            모델 조건이 있으면 비교한 길이와 실제로 생략할 길이가 달라지므로 두 값을 같은 말로 넘기지 않습니다.
          </p></div></section>

<section id="request-trace" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. R2의 여섯 자리를 찾아 계산으로 넘깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이제 입력 번호는 토큰 ID(token ID)라고 부르겠습니다. 같은 앞 기록을 재사용한 길이는 적중 길이(hit length)라고 부르겠습니다. R1의 기록이 남은 상태에서 R2가 들어옵니다. 같은 재사용 영역의 시작점에서 R1과 R2의 번호 열을 비교합니다. 앞의 1부터 6까지 같고 7과 9에서 달라지므로 공유 길이는 6입니다.</p><p>
            기존 8자리 구간을 6과 2로 나눈 뒤 앞 6의 저장 위치 목록을 돌려줍니다. 사용하는 동안 이 경로를 보호하고 R2의 9·10에 해당하는 새 위치를 확보합니다. 계산이 끝나면
            그 두 위치를 공통 경로 뒤의 새 가지에 등록합니다.
          </p><p>
            R3도 같은 앞 6을 찾습니다. 요청들이 모두 끝난 뒤 공유 6과 끝 2 세 벌이 남습니다. 이 상태에서 R3 경로를 다시 사용하도록 잠그면 공통 6과 R3의 2가 함께
            보호됩니다. 뒤의 반환 사례는 이 보호 상태를 출발점으로 삼습니다.
          </p></div></section>

<section id="radix-source" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 실제 match와 split에 같은 여덟 자리를 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            갈라지는 지점의 객체를 node라고 부릅니다. SGLang commit 35f3c96의 radix_cache.py 637–661행에서 _match_prefix_helper는
            자식의 key와 요청을 비교합니다. 일치 길이가 기존 구간보다 짧으면 _split_node를 호출합니다. R1의 8과 R2의 6이 이 분기로 들어갑니다.
          </p><p>
            663–686행은 새 node에 key와 value의 앞 6을, 기존 자식에 뒤 2를 남깁니다. value는 실제 KV tensor 자체가 아니라 저장 위치의 index
            목록입니다. 원문의 clone은 이 index 구간을 복사하며 모든 층의 K·V를 새로 계산하거나 복사하는 명령이 아닙니다.
          </p><p>
            같은 파일의 원문 함수를 CPU에서 골라 실행하면 R1·R2·R3의 hit은 0·6·6이며 저장 구간의 합은 12입니다. 검증에서는 index 목록과 allocator·이벤트를
            시험용 객체로 바꿨습니다. 실제 SGLang 서버나 GPU 모델을 실행한 성능 결과는 아닙니다.
          </p></div><CodeViewButton label="R2의 실제 prefix 탐색" onClick={() => sidebar.open("radix-match", codeRefs["radix-match"])} /><CodeViewButton label="8자리 구간을 6과 2로 나누는 원문" onClick={() => sidebar.open("radix-split", codeRefs["radix-split"])} /></section>

<section id="matching" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. radix도 페이지와 재사용 영역의 조건을 따릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>고정 원문의 RadixKey는 token ID 외에 extra_key와 cache_salt도 구별합니다. 같은 입력이어도 child key의 재사용 영역이 다르면 다른 경로에서 찾습니다. 같은 문자열처럼 보이는지보다 실제 token ID와 계산 조건이 맞는지가 먼저입니다.</p><p>이 버전의 match는 항상 한 token씩 Python 반복문으로 비교하지 않습니다. 같은 구간을 넓혀 비교한 뒤 달라진 구간을 좁혀 첫 차이를 찾습니다. 결과를 page_size의 배수로 내리는 경로도 있으므로 radix라는 이름만으로 한 자리 단위 hit을 보장하지 않습니다.</p><p>
            R1과 R2를 page_size=1로 비교하면 6입니다. page_size=4로 바꾸면 같은 6을 4로 내립니다. 보통 token과 EAGLE의 bigram 모드도 구별되므로
            이 글의 단순 ID 열 계산을 모든 draft 모델에 그대로 적용하지 않습니다.
          </p></div><CodeViewButton label="실제 key 비교와 페이지 경계" onClick={() => sidebar.open("radix-key", codeRefs["radix-key"])} /></section>

<section id="block-hash" data-teach-level="5" className="scroll-mt-20"><span id="source-vllm-prefix-caching" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">10. 네 자리 묶음이면 R2는 앞 네 자리만 재사용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>vLLM의 기본 비교 모형으로 저장 block과 hash 단위를 모두 B=4로 둡니다. R1은 [1,2,3,4]와 [5,6,7,8], R2는 [1,2,3,4]와 [5,6,9,10]으로 나뉩니다. 첫 block의 키는 같고 둘째는 다릅니다. B=4는 설명용 가정이며 모든 GPU backend가 이 설정을 받는다는 뜻은 아닙니다.</p><p>v0.27.1 commit 6e448d0의 kv_cache_utils.py 596–624행은 앞 block의 hash, 현재 token tuple, extra_keys를 함께 hash합니다. 현재 네 자리만 같아도 앞 문맥의 hash가 다르면 같은 키가 아닙니다. LoRA·멀티모달·salt 등 실제 추가 키의 구성도 호출 경로에서 확인해야 합니다.</p><p>
            이 경로에서 R2는 4를 hit하고 남은 4를 다시 계산합니다. 그중 5·6은 R1과 번호가 같지만 같은 full block으로 재사용되지 않았습니다. R3도 4를 hit하므로
            총 재사용은 8, 저장은 공통 block 1과 전용 block 3인 16자리입니다.
          </p><p>이 단순 모형의 범위도 고정합니다. 더 작은 hash 단위로 block 내부 경계를 찾는 partial-hit 경로는 별도로 있습니다. 고정 single_type_kv_cache_manager.py의 fine_grained 분기가 이를 처리하며 manager·group·정렬 조건과 공유 tail의 복사 수명을 함께 봅니다.</p></div><CodeViewButton label="parent·token·추가 조건을 묶는 hash 원문" onClick={() => sidebar.open("hash-key", codeRefs["hash-key"])} /><CodeViewButton label="full block과 내부 hash 경계 조회" onClick={() => sidebar.open("block-hit", codeRefs["block-hit"])} /></section>

<section id="full-hit-boundary" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 입력 전체가 남아 있어도 마지막 계산은 남을 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            같은 R1의 여덟 자리 전체가 저장된 뒤 똑같은 입력이 다시 온다고 합시다. 저장된 것은 KV이며 다음 출력의 점수를 새로 구해야 하는 경로라면 마지막 입력 위치를 남깁니다.
            저장된 8과 재사용 가능한 7은 다른 수입니다. (가정)
          </p><p>
            SGLang schedule_batch.py 1715–1725행은 기본 상한을 input_len−1로 둡니다. 일반 page 크기 1 모형에서는 7을 재사용하고 1을 계산합니다.
            logprob 등의 조건은 상한을 더 줄일 수 있습니다.
          </p><p>
            vLLM kv_cache_manager.py 252–263행도 num_tokens−1을 사용합니다. 다만 B=4와 hash 단위 4의 경로는 7을 full block 4로 내리므로
            마지막 4를 다시 계산합니다. 원문 주석도 한 token 대신 block 전체가 재계산될 수 있다고 명시합니다.
          </p><p>따라서 단순한 내림식에는 요청 전체 길이에 따른 상한도 넣어야 합니다. partial hash 경계·speculative 조건·hybrid 상태를 켜면 허용 경계가 달라집니다. 모든 입력의 손실이 무조건 B−1 이하라는 문장으로 이 full-hit 경계까지 덮지 않습니다.</p></div><CodeViewButton label="SGLang의 마지막 입력 상한" onClick={() => sidebar.open("sglang-last-token", codeRefs["sglang-last-token"])} /><CodeViewButton label="vLLM의 마지막 위치와 block 재계산" onClick={() => sidebar.open("vllm-last-token", codeRefs["vllm-last-token"])} /></section>

<section id="cache-accounting" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 재사용 비율과 저장한 위치 수를 따로 셉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            page 크기 1에서 R1·R2·R3의 hit 합은 0+6+6=12이고 입력 합은 24입니다. 재사용 비율은 50%입니다. B=4·hash 단위 4 모형은 0+4+4=8이므로 약
            33.33%입니다. 두 방법의 저장량은 앞에서 구한 12자리와 16자리입니다.
          </p><p>
            기존의 큰 사례도 같은 방식으로 계산할 수 있습니다. system 입력 2000, 공통 few-shot 500, 서로 다른 질문 100인 세 요청이면 총 7800입니다.
            page 크기 1의 hit 5000은 64.102564…%, B=16·hash 16의 hit 4992는 64%입니다. (가정)
          </p><p>
            큰 사례의 차이는 약 0.102564 percentage points입니다. 이 차이가 모든 입력에서 1% 이내라는 뜻은 아닙니다. 작은 세 요청에서는 50%와 약
            33.33%라 약 16.67 percentage points 차이가 납니다. 백분율 값의 차이와 상대 변화율도 구분합니다.
          </p><p>
            네 번째 큰 요청이 system 2000만 공유하고 few-shot부터 다르면 page 크기 1 구조는 2000에서 다시 갈라집니다. B=16의 2000도 125개 full
            block이라 이 구간의 경계 손실은 없습니다. 이 요청까지 포함할 때는 분모도 함께 늘려 다시 계산해야 합니다.
          </p></div><ExplainedFormula question={"같은 세 요청에서 재사용한 계산과 저장 공간은 어떻게 셉니까?"} idea={"전체 입력 위치를 분모로 두고 실제 재사용한 위치만 분자에 더합니다. 저장 공간은 서로 다른 위치를 한 번씩 셉니다."} formula={"H=\\frac{\\sum_r h_r}{\\sum_r L_r},\\qquad h_r=B\\left\\lfloor\\frac{\\min(m_r,L_r-1)}{B}\\right\\rfloor"} annotatedFormula={"\\begin{aligned}H&=\\frac{\\underbrace{\\sum_r h_r}_{\\text{실제 재사용 위치 합}}}{\\underbrace{\\sum_r L_r}_{\\text{전체 요청 입력 위치 합}}}\\\\h_r&=\\underbrace{B\\left\\lfloor\\frac{\\min(m_r,L_r-1)}{B}\\right\\rfloor}_{\\text{상한을 정한 뒤 full block 경계로 내림}}\\end{aligned}"} operations={[{"expression": "\\min(m_r,L_r-1)", "annotation": ["이미 저장된 일치 길이와", "마지막 계산을 남기는 상한 중 작은 값입니다."]}, {"expression": "B\\lfloor x/B\\rfloor", "annotation": ["full block 모형에서", "허용 경계까지 내립니다."]}, {"expression": "\\sum h_r/\\sum L_r", "annotation": ["같은 구간의 실제 재사용 위치를", "전체 입력 위치 합으로 나눕니다."]}]} terms={[{"symbol": "m_r", "name": "저장된 일치 길이", "description": "같은 계산 조건의 연속 prefix가 저장된 길이입니다."}, {"symbol": "L_r", "name": "입력 길이", "description": "이번 장부에 포함한 요청 r의 전체 입력 위치 수입니다."}, {"symbol": "B", "name": "모형의 저장·hash 단위", "description": "여기서는 둘 다 4입니다. 모든 manager의 일반식은 아닙니다."}, {"symbol": "h_r", "name": "실제 hit 길이", "description": "상한과 경계를 적용해 이번에 생략한 입력 위치 수입니다."}]} assumptions={["같은 full-attention 모델·namespace이고 기록이 실행 때까지 유효합니다.", "block 단위와 hash 단위가 같고 마지막 logit 계산을 남기는 단순 경로입니다.", "생성 위치와 prefix를 읽는 attention 비용은 분자·분모에 넣지 않습니다."]} interpretation={"page 크기 1 사례는 12/24=50%, B=4는 8/24=33.333…%입니다. 저장 위치는 각각 12와 16이며 실제 시간 절감률과는 다른 양입니다."} /></section>

<section id="eviction" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 사용 잠금이 있는 길은 반환 후보에서 빠집니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            작은 사례의 세 요청이 모두 끝나 사용 잠금이 0이라고 합시다. 끝 구간 q1·q2·q3는 각각 2자리이고 오래된 순서도 같습니다. 3자리를 비우려면 q1과 q2를 지워
            4자리를 반환합니다. 구간 단위 반환이므로 정확히 3에서 멈출 필요는 없습니다. (가정)
          </p><p>
            별도 상태로 돌아가 R3 경로를 잠그면 공통 6과 q3의 2가 보호됩니다. q1·q2의 4만 반환할 수 있으므로 5자리 요구는 채우지 못합니다. 고정 원문의 inc_lock_ref는
            처음 0에서 잠기는 구간 길이를 evictable에서 빼고 protected에 더합니다.
          </p><p>
            radix_cache.py 551–579행은 반환 가능한 leaf를 선택해 실제 반환량을 누적합니다. 부모가 자식을 모두 잃고 잠금도 0이면 부모도 후보가 됩니다. 이 버전은
            선택한 eviction_strategy를 사용하므로 LRU 순서를 설명할 때는 그 정책을 가정해야 합니다.
          </p><p>
            큰 예의 q1·q2·q3가 100자리씩이고 250을 요구하면 모두 비어 있을 때 300을 돌려줍니다. R3 경로가 보호되고 다른 후보가 없다면 200뿐입니다. 네 번째 요청의
            unlocked 600자리까지 남은 장면에서는 200에서 반드시 끝난다고 말할 수 없습니다.
          </p></div><CodeViewButton label="실제 leaf 반환과 경로 잠금" onClick={() => sidebar.open("radix-evict", codeRefs["radix-evict"])} /></section>

<section id="free-queue" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. vLLM은 tree 대신 참조 수와 free queue를 갱신합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            vLLM의 요청 종료는 single_type_kv_cache_manager.py 519–527행에서 block 목록을 역순으로 전달합니다. R2의 table=[5,9]라면 9를
            먼저 다룹니다. 5는 다른 요청도 참조할 수 있으므로 뒤에서 온 순서만 보고 반환하지 않습니다.
          </p><p>
            block_pool.py의 touch는 ref가 0인 일반 block을 free queue에서 빼고 참조 수를 늘립니다. free_blocks는 ref를 줄여 0이 된 후보를
            모읍니다. 현재 원문은 hash 없는 block을 앞에, hash 있는 block을 뒤에 넣으므로 모든 block을 단순히 tail에 넣는 설명은 정확하지 않습니다.
          </p><p>새 공간이 필요해 후보를 다시 쓰는 순간에는 예전 hash가 새 내용에 hit하지 않게 해야 합니다. 찾기 목록에서 제거하는 일과 실제 공간을 덮어쓸 수 있게 되는 일도 구분합니다. 자세한 참조·복사 수명은 <a href="/cs/ai/vllm-paged-attention#block-pool">PagedAttention의 block pool</a>에서 같은 원문으로 이어집니다.</p></div><CodeViewButton label="뒤 block부터 반환하는 호출" onClick={() => sidebar.open("reverse-free", codeRefs["reverse-free"])} /><CodeViewButton label="touch와 hash 유무에 따른 queue 갱신" onClick={() => sidebar.open("free-queue", codeRefs["free-queue"])} /></section>

<section id="scheduling" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 순서를 바꾸려면 실행 뒤의 기록을 다시 보아야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            별도 사례로 서로 다른 공통 앞 6을 가진 X 계열과 Y 계열을 둡니다. 각 요청은 고유한 뒤 2를 붙인 8자리입니다. 공간은 한 요청의 8자리를 담고 한 번에 1개씩 처리하며
            생성 기록은 제외합니다. X1,Y1,X2,Y2,X3,Y3 순서로 번갈아 실행하면 매번 앞 계열의 기록을 밀어내어 hit은 0입니다. (가정)
          </p><p>
            X1,X2,X3,Y1,Y2,Y3로 실행하면 각 계열의 둘째·셋째가 6을 재사용합니다. 총 24/48=50%입니다. 한 계열에서는 오래된 끝 2만 지우고 공유 6을 유지할 수
            있습니다. 두 계열을 바꿀 때는 이전 기록을 비웁니다.
          </p><p>
            처음에 모든 요청이 cold라면 현재 hit 길이는 전부 0입니다. 한 번 정렬했다고 자동으로 X끼리 모이지 않습니다. X1이 끝난 뒤 기록을 반영해 다시 찾으면 X2·X3의
            hit이 6으로 바뀝니다. 실행·등록·재조회의 시간 순서가 그룹화를 가능하게 합니다.
          </p><p>
            기존 2500+100 큰 사례도 전체 2600을 담는 용량을 두면 같은 논리로 볼 수 있습니다. 묶은 순서의 hit은 10000/15600≈64.1026%입니다. cache가
            2500만 담는데 실행 중 2600 전체가 어디에 놓이는지 생략하면 용량 가정이 빠집니다.
          </p></div></section>

<section id="schedule-source" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 현재 LPM은 길이만으로 항상 정렬하지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>SGLang의 schedule_policy.py 487–498행은 num_matched_prefix_tokens가 큰 요청을 앞세우지만 temporary_deprioritized인 요청은 뒤로 미룹니다. 같은 batch에서 공통 prefix를 중복 계산하지 않도록 아직 준비 안 된 요청끼리의 공유도 검사합니다.</p><p>
            원문 정렬 함수에 hit 6인 A, hit 6인 B, miss 0을 넣고 A만 임시 지연 집합에 넣으면 B, miss, A 순서가 됩니다. 길이 6인 요청이 항상 0보다
            앞선다는 규칙도 이 조건에서는 성립하지 않습니다. 이 검사는 요청 객체 대역을 사용한 함수 실행입니다.
          </p><p>
            340–353행은 LPM과 HRRN의 대기 요청이 128을 넘으면 활성 정책을 FCFS로 바꿉니다. 129개에서는 그 경로로 들어갑니다. cache 비활성, 다른 정책,
            우선순위 설정도 따로 확인해야 하므로 논문의 이상화 정책을 현재 엔진의 모든 실행 순서로 설명하지 않습니다.
          </p></div><CodeViewButton label="임시 지연을 포함한 실제 LPM 정렬" onClick={() => sidebar.open("lpm-sort", codeRefs["lpm-sort"])} /><CodeViewButton label="대기 128과 129의 정책 경계" onClick={() => sidebar.open("lpm-fallback", codeRefs["lpm-fallback"])} /></section>

<section id="paper-sglang-radixattention" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 논문의 offline 정리를 같은 작은 구조에 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            SGLang 논문 v2의 Theorem 3.1은 모든 요청을 미리 알고 cache가 가장 긴 요청을 담는 조건을 둡니다. 깊이 우선으로 한 하위 경로를 마친 뒤 다른 경로로
            가면 각 구간을 한 번씩 계산하는 재사용 상한에 도달한다는 정리입니다.
          </p><p>
            작은 R 세 개의 서로 다른 구간은 6+2+2+2=12자리입니다. 전체 입력 24 중 최소 12자리는 계산해야 하므로 이 모형의 hit 상한은 1−12/24=50%입니다.
            요청과 생성 길이를 미리 모르는 online 환경의 지연 최적성을 증명한 것은 아닙니다.
          </p><p>
            Appendix A.2 Algorithm 1은 기다리는 요청의 match를 찾고 정렬한 뒤 보호 참조를 올려 가용 공간을 조정합니다. R3 경로 8을 처음 보호할 때
            delta=−8이라 지울 수 있는 공간이 8 줄어드는 것이 같은 사례의 적용입니다. 현재 구현과 원문의 의사코드는 별개로 읽습니다.
          </p><p>
            논문의 최대 6.4배 처리량은 KV reuse 외의 병렬 실행·제약 출력 최적화도 포함한 평가입니다. 당시 vLLM v0.2.5 등과 비교했으며 7B의 A10G 외에 큰 모델과
            다른 장치도 다룹니다. 보고한 hit 50~99%와 평균 상한의 96%도 해당 workload 결과입니다.
          </p></div><CitationBlock source="SGLang v2 · §3 Theorem 3.1, Appendix A.2 Algorithm 1, A.3 proof" citeKey={1} href="https://arxiv.org/html/2312.07104v2"><q>longest-shared-prefix-first</q></CitationBlock><ExplainedFormula question={"한 구간은 적어도 한 번 계산해야 한다면 hit 상한은 얼마인가요?"} idea={"공유된 구간을 한 번씩만 세어 반드시 계산할 양을 구합니다. 이 모형의 위치 수 장부이며 실제 FLOP이나 시간의 일반 하한은 아닙니다."} formula={"C\\geq\\sum_e |e|,\\qquad H=1-\\frac{C}{\\sum_r L_r}"} annotatedFormula={"\\begin{aligned}C&\\geq\\underbrace{\\sum_e|e|}_{\\text{서로 다른 구간 길이 합}}\\\\H&=1-\\underbrace{\\frac{C}{\\sum_r L_r}}_{\\text{전체 입력 중 계산한 비중}}\\end{aligned}"} operations={[{"expression": "\\sum_e|e|", "annotation": ["공통 6과 끝 2 세 개를", "한 번씩 합쳐 12를 얻습니다."]}, {"expression": "1-C/\\sum_r L_r", "annotation": ["전체 24에서 필요 계산 12를 뺀 비중이", "50% 상한입니다."]}]} terms={[{"symbol": "C", "name": "계산한 입력 위치 수", "description": "이 설명에서는 동일 비용의 위치 수로 센 모형 장부입니다."}, {"symbol": "|e|", "name": "구간 길이", "description": "공유 부분은 여러 요청이 지나도 한 번 셉니다."}]} assumptions={["모든 요청을 미리 알고 가장 긴 요청을 cache에 담을 수 있습니다.", "생성 위치 변화·추가 재계산·시간 비용 차이는 이 작은 장부에서 제외합니다."]} interpretation={"R1 뒤 R2·R3를 순서대로 처리하면 12 위치를 계산하고 12를 재사용해 50% 상한에 닿습니다. 온라인 지연이나 공정성까지 증명하지 않습니다."} /></section>

<section id="attention-metadata" data-teach-level="6" className="scroll-mt-20"><span id="slot-mapping" className="scroll-mt-20" /><span id="block-table-lookup" className="scroll-mt-20" /><span id="source-vllm-v1-attention" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">18. 찾은 기록과 새 기록의 주소를 kernel에 넘깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>확정한 hit과 배정 위치를 attention 계산에 전달하는 묶음을 attention metadata라고 합니다. 고정 버전의 CommonAttentionMetadata는 backend.py 412–438행에 있습니다. 이전 글이 가리킨 utils.py는 이 타입을 가져와 사용하며 정의 위치는 다릅니다.</p><p>
            B=4의 R2가 앞 4를 재사용하고 새 4를 계산한다고 합시다. block table을 [5,9]로 배정하면 새 위치 4·5·6·7을 쓰는 slot mapping은
            [36,37,38,39]입니다. 위치 6은 9×4+2=38입니다. 저장된 0~3은 이번 새 쓰기 목록에 없습니다. (가정)
          </p><p>
            R2 하나의 query 시작 경계는 [0,4], 전체 길이는 [8]로 놓습니다. 새 query 4개가 기존 4와 새 4를 함께 보되 자신의 뒤 위치를 보지 않도록 causal
            조건을 적용합니다. block table이 물리 block 9를 가리킨다고 위치 6이 미래 7까지 계산에 쓰는 것은 아닙니다.
          </p><p>
            큰 R2의 B=16 사례도 유지됩니다. 2496개가 hit하면 위치 2496~2599의 104개를 새로 계산합니다. 논리 block 156~162에 물리
            913,77,1204,42,618,350,991을 배정했다면 위치 2500은 913×16+4=14612입니다.
          </p><p>
            위치 2500의 query가 참고하는 과거는 0~2500입니다. 단순 full-attention 모형에서는 table 항목 0~156의 157개 block에 걸치되 마지막
            block의 유효 범위를 지킵니다. 실제 kernel은 tile로 읽고 mask를 적용하므로 157회 메모리 거래라는 뜻은 아닙니다.
          </p><p>새 query 시작 위치와 slot mapping은 batch·진행 상태가 바뀌면 갱신합니다. block table도 새 배정·반환·복사에 맞춰 고칩니다. graph 실행이나 padding이 있는 경우 num_actual_tokens라는 이름만 보고 padding이 전혀 없다고 판단하지 않습니다.</p></div><CodeViewButton label="실제 CommonAttentionMetadata 필드" onClick={() => sidebar.open("metadata", codeRefs["metadata"])} /></section>

<section id="kernel-and-hybrid" data-teach-level="6" className="scroll-mt-20"><span id="hybrid-manager" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">19. 공유 길이 외에 backend와 group 조건을 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>여러 query가 같은 prefix를 읽는 비용을 줄이는 방법 중 하나가 cascade attention입니다. FlashAttentionMetadata는 공통 부분과 각 suffix를 나누어 처리할 정보를 둡니다. 같은 prefix가 있다는 사실만으로 이 경로가 자동 선택되지는 않습니다.</p><p>
            고정 flash_attn.py 1537–1561행의 선택 함수는 공통 길이가 256보다 작거나 요청이 8개 미만이면 false입니다. 작은 R의 공통 4는 첫 조건에서, 큰
            사례의 2496도 요청 3개는 두 번째 조건에서 탈락합니다. 지원되지 않는 attention 변형과 context parallel 조건, 이후 비용 휴리스틱도 남습니다.
          </p><p>
            층마다 다른 기록을 보관하면 cache group마다 허용하는 hit 길이가 달라집니다. 예를 들어 B=16 full group은 2496까지 남았고 window 1024
            group에서는 block 130이 없다고 합시다. 다른 필요한 block이 남고 특별 draft 조건이 없으면 window 쪽은 2080으로 줄어듭니다. (가정)
          </p><p>
            이 window 모형은 ceil((1024−1)/16)=64개의 연속 block을 찾습니다. 2080 경계에서는 block 66~129가 [1056,2080)을 덮습니다.
            합의한 길이를 2080으로 맞추면 full group도 130개 block으로 줄입니다.
          </p><p>kv_cache_coordinator.py의 반복은 길이가 줄어드는 동안 조건을 맞춥니다. 하지만 full group은 이미 찾은 결과를 잘라 쓰며 단순 full+다른 group 조합은 한 번 처리하는 최적화가 있습니다. 매번 모든 group을 원점부터 새로 조회한다는 설명은 이 고정 코드와 다릅니다.</p></div><CodeViewButton label="cascade가 꺼지는 실제 조건" onClick={() => sidebar.open("cascade", codeRefs["cascade"])} /><CodeViewButton label="cache group 길이 합의와 단순 조합 최적화" onClick={() => sidebar.open("hybrid-hit", codeRefs["hybrid-hit"])} /></section>

<section id="fairness" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. 재사용 우선은 오래 기다린 요청의 목표와 충돌할 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            새 prefill 위치 상한 3200에 chunk를 허용하지 않는 별도 모형을 보겠습니다. hit이 없는 3000자리 요청이 기다리는데 매 step마다 앞 2500을 hit하고
            새 100만 계산하는 요청 8개가 먼저 선택됩니다. 800을 쓴 뒤 남은 2400에는 3000자리 요청이 들어가지 못합니다. (가정)
          </p><p>
            FCFS로 3000자리 요청을 먼저 받으면 새 100짜리 2개가 함께 들어갑니다. 나머지 6개가 뒤로 밀립니다. step 시간은 이 산수에서 측정하지 않았으므로 수십 ms라고 붙일
            수 없습니다. 계속 들어오는 요청과 선택 규칙에 따라 기다리는 쪽이 달라지는 예입니다.
          </p><p>
            chunked prefill이면 3000을 나누어 일부 진행할 수 있어 같은 starvation 결론을 그대로 적용하지 않습니다. 현재 SGLang의 활성 정책 전환과
            우선순위도 확인해야 합니다. 운영 판단에서는 hit 비율뿐 아니라 요청별 대기와 첫 출력 목표를 함께 측정합니다.
          </p></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><span id="evidence" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">21. 입력의 같음과 기록의 유효함을 함께 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 token ID라도 모델·adapter·추가 입력·재사용 영역이 다르면 같은 KV라고 볼 수 없습니다. 찾아둔 위치도 실제 실행 때까지 남아 있어야 합니다. 다른 replica로 가는 요청의 예상 cache와 실제 local hit는 <a href="/cs/ai/disaggregated-prefill-decode-serving#routing-source">분리 서빙의 routing</a>에서 구분했습니다.</p><p>
            이 글의 page 크기 1과 B=4는 작은 수치 모형입니다. 공간 단위와 hash 단위가 다른 hybrid 경로, sliding window, draft 검증, 원격 cache, 복사
            중 공유 tail은 별도 조건을 가집니다. 각 모델의 모든 cache가 이 세 요청의 단순 tree와 같다고 주장하지 않습니다.
          </p><p>
            원문은 SGLang commit 35f3c96과 vLLM v0.27.1 commit 6e448d0으로 고정했습니다. 실제 함수의 선택적 CPU 실행은 index와
            allocator 대역을 사용했으며 전체 GPU engine이나 처리 시간을 검증하지 않았습니다. source의 지원 조건과 실제 배포 설정을 함께 맞춘 뒤 성능을 비교합니다.
          </p><p>
            정확성을 확인할 때는 같은 요청의 입력·hit 길이·새 계산 범위·저장 주소·사용 잠금·반환량을 연결합니다. 비용을 확인할 때는 검색 시간과 재계산·복사·대기 시간도 더합니다.
            재사용률이 높아졌다는 사실만으로 응답 지연과 공정성까지 좋아졌다고 결론내리지 않습니다.
          </p></div><ContentBoundary article="prefix-caching-radix-attention" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">22. 같은 입력에서 다음 경계를 예상해 보세요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            R1과 R2의 앞 6이 같지만 page 크기를 4로 바꾸면 hit은 어디서 끊기나요? 전체 8이 똑같은 경우 마지막 점수를 다시 계산한다면 왜 같은 설명만으로 부족할까요?
            (답: 11절)
          </p><p>
            R3 경로 8이 보호되고 다른 두 끝 구간이 2씩 남았습니다. 5자리를 비워 달라는 요청에 실제 원문은 몇 자리를 돌려줄 수 있나요? (답: 13절)
          </p><p>
            큰 사례의 세 요청이 2496을 공유한다면 고정 FlashAttention backend의 cascade가 켜질까요? (답: 19절)
          </p></div></section>
</div><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={prefixTrees} projectMetas={{vllm:{id:"vllm",label:"vLLM v0.27.1 원문",badgeClass:"bg-blue-500/10 border-blue-500 text-blue-700"},sglang:{id:"sglang",label:"SGLang 고정 원문",badgeClass:"bg-blue-500/10 border-blue-500 text-blue-700"}}} /></>;}
