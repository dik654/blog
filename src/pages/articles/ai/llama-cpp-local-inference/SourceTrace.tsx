import { CodeViewButton } from "@/components/code";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

interface Props {
  code: (key: string) => void;
}

export default function SourceTrace({ code }: Props) {
  return (
    <>
      <section id="cells-source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 원문의 cell은 pos 배열과 bitset 배열 두 개입니다</h2>
        <div className={prose}>
          <p>
            llama.cpp commit 091b6a7의 llama-kv-cells.h는 cell을 객체로 만들지 않고 같은 길이의 배열 여러 개로 둡니다. pos[i]가 cell i의 위치, seq[i]가 cell i의
            256비트 bitset입니다. 비어 있는 cell은 pos[i] = −1이고, 비어 있지 않은 cell 번호는 used 집합에 따로 모아 둡니다.
          </p>
          <p>
            3절의 넷째 장면을 이 배열에 넣으면 pos는 [0,1,2,3,4,5,6,4,5,7,6,−1,…]이고 used는 {"{0,…,10}"}입니다. seq[0]~seq[3]은 A·B 두 비트, seq[4]~seq[6]과
            seq[9]는 A 비트, seq[7]·seq[8]·seq[10]은 B 비트만 켜져 있습니다. sequence마다 (pos, cell) 쌍을 정렬해 둔 seq_pos도 있어, B의 가장 작은 위치를 배열
            전체를 훑지 않고 찾습니다.
          </p>
        </div>
        <CodeViewButton label="cell의 pos·bitset·used 선언" onClick={() => code("cells-fields")} />
        <div className={prose}>
          <p>
            공유와 반환은 비트 연산 하나씩입니다. seq_add는 이미 채워진 cell에 비트를 하나 더 켜고, seq_rm은 비트를 끈 뒤 비트가 하나도 남지 않으면 pos를 −1로
            돌리고 used에서 뺍니다. 3절 끝에서 A를 지우면 cell 4·5·6·9가 이 분기로 비고, cell 0~3은 B 비트가 남아 그대로입니다.
          </p>
        </div>
        <CodeViewButton label="비트를 켜고 끄는 seq_add·seq_rm·seq_has" onClick={() => code("cells-seq-ops")} />
        <div className={prose}>
          <p>
            B에게 앞 4 token을 넘기는 호출은 llama-kv-cache.cpp의 seq_cp입니다. A와 B가 같은 stream에 있으면 위치 0~3의 cell을 돌며 B 비트를 켜고 끝납니다.
            주석도 데이터 복사가 필요 없다고 적습니다. stream이 다르면 실제 buffer 복사를 예약하고, 그것도 buffer 전체 복사만 허용합니다.
          </p>
        </div>
        <CodeViewButton label="같은 stream이면 비트만 켜는 seq_cp" onClick={() => code("seq-cp")} />
        <div className={prose}>
          <p>
            K와 V의 실제 값은 층마다 tensor 하나에 있습니다. 모양은 [층 폭, cell 수, stream 수]이고, cell 번호가 둘째 축의 위치입니다. 그래서 cell 10에 쓴다는
            말은 모든 층의 K·V tensor에서 둘째 축의 10번 자리에 쓴다는 뜻입니다. offload가 켜지면 이 tensor는 그 층이 놓인 device에 만들어집니다.
          </p>
        </div>
        <CodeViewButton label="층마다 [폭, cell, stream] K·V tensor" onClick={() => code("kv-tensor")} />
      </section>

      <section id="mask-source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. find_slot·get_n_kv·mask 세 함수가 7절의 단계입니다</h2>
        <div className={prose}>
          <p>
            7절의 첫 단계는 find_slot입니다. head 자리부터 cell을 하나씩 보며 비어 있거나, 한 sequence만 쓰던 cell이 sliding window 밖으로 밀려난 경우에 씁니다.
            head 앞에 빈 cell이 충분히 많으면 처음부터 다시 찾아 배열 앞쪽을 채웁니다. 이 규칙 때문에 A와 B의 cell이 번갈아 놓입니다.
          </p>
          <p>
            배열을 한 바퀴 다 보고도 자리가 없으면 find_slot은 빈 결과를 돌려줍니다. 호출한 decode는 배열을 한 번 정리해 다시 시도하고, 그래도 없으면 1을
            돌려줍니다. 5절에서 말한 선점 없는 실패가 이 두 줄입니다.
          </p>
        </div>
        <CodeViewButton label="head부터 빈 cell을 찾는 find_slot" onClick={() => code("find-slot")} />
        <CodeViewButton label="자리가 없을 때 decode가 돌려주는 값" onClick={() => code("decode-no-slot")} />
        <div className={prose}>
          <p>
            둘째 단계는 get_n_kv입니다. 사용 중 마지막 cell 번호 + 1을 256의 배수로 올리고, 최소 256을 둡니다. 주석은 batch마다 계산 그래프 모양이 바뀌지 않게
            하려는 padding이라고 적습니다. 3절은 11 → 256, 가장 뒤 cell이 8,999번이면 9,000 → 9,216입니다.
          </p>
        </div>
        <CodeViewButton label="n_kv를 256 단위로 올리는 get_n_kv" onClick={() => code("get-n-kv")} />
        <div className={prose}>
          <p>
            셋째 단계는 set_input_kq_mask_impl입니다. 남길 값 0과 지울 값 −∞를 정해 두고, cell마다 빈칸인지, 이 sequence의 비트가 없는지, 위치가 query보다
            뒤인지를 차례로 물어 하나라도 맞으면 −∞를 씁니다. 7절의 B 행에서 남는 7칸이 이 검사를 모두 통과한 cell입니다.
          </p>
        </div>
        <CodeViewButton label="cell마다 0 또는 −∞를 쓰는 mask" onClick={() => code("kq-mask")} />
        <div className={prose}>
          <p>
            지운 칸을 kernel이 건너뛰는지도 확인했습니다. CUDA FlashAttention 경로는 mask를 끝에서부터 256칸 tile 단위로 보며 모두 −∞인 tile만 계산 범위에서
            뺍니다. 중간에 낀 다른 sequence의 cell은 건너뛰지 않고 점수까지 계산한 뒤 버립니다.
          </p>
          <p>
            이 끝 tile 생략도 query가 1,024개 이상이거나 stream이 여럿일 때만 켭니다. unified 배열에서 slot 네 개가 한 token씩 decode하는 step은 query가
            4개라 mask를 훑지 않습니다. 다른 backend의 동작은 이 글에서 확인하지 않았습니다.
          </p>
        </div>
        <CodeViewButton label="끝의 −∞ tile만 줄이는 KV_max" onClick={() => code("fattn-kv-max")} />
        <CodeViewButton label="mask 훑기를 켜는 조건" onClick={() => code("fattn-scan-condition")} />
      </section>
    </>
  );
}
