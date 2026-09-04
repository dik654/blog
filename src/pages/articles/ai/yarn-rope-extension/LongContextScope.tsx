const angleRows = [
  {
    dim: "i = 0 (가장 빠른 dimension)",
    rotations: "≈ 652 바퀴",
    seen: "0°~360° 를 여러 번 고르게 반복",
    extrapolated: "여전히 이미 본 각도 안(위상이 포화됨)",
  },
  {
    dim: "i = 63 (가장 느린 dimension)",
    rotations: "≈ 0.075 바퀴(27.1°)",
    seen: "0°~27.1° 뿐",
    extrapolated: "216.8°(한 번도 본 적 없는 위상)",
  },
] as const;

/**
 * 본문 대응: RopeFoundation 이 정의한 theta_i, lambda_i 를 이어받아 native/extended
 * context length 를 구분하고, 그 사이에서 context length extrapolation 이 실패하는
 * 이유(저주파 dimension 이 낯선 위상으로 밀려남)를 native L=4096, base=10000, d=128,
 * target L'=32768(factor s=8) 수치로 보인다. 마지막으로 long-context modeling 을
 * 위치 확장·메모리·평가 세 문제로 분리한다.
 */
export default function LongContextScope() {
  return (
    <div id="long-context-scope" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Long-context modeling 은 위치·메모리·평가 세 문제로 나뉩니다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Long-context modeling이라는 말은 한 문제가 아니라 위치 확장, 메모리, 평가라는 서로 다른 세 문제를 함께 가리킵니다. YaRN을 포함한 RoPE 계열 방법은 이
          중 위치 확장만 풀고 나머지 둘은 다른 곳에서 따로 해결해야 합니다.
        </p>
        <p>
          먼저 두 길이를 구분합니다. checkpoint가 실제로 학습에서 본 최대 길이를 native context length(L), 그보다 밀어붙이려는 목표 길이를 extended
          context length(L′)라고 부릅니다. 배율 s=L′/L이 확장 정도를 나타냅니다.
        </p>
        <p>
          예를 들어 base 4K checkpoint를 32K로 늘리면 L=4096, L′=32768, s=8입니다. 이 배율이
          앞서 본 frequency band마다 다른 문제를 일으킵니다.
        </p>
      </div>

      <figure data-viz="rope-extrapolation-angles" className="not-prose my-9 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption className="mb-4 text-sm font-semibold">
          d=128, base=10000, L=4096→L′=32768(s=8)에서 두 dimension이 본 각도
        </figcaption>
        <div className="grid gap-3 sm:grid-cols-2">
          {angleRows.map((row) => (
            <div key={row.dim} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
              <p className="font-semibold">{row.dim}</p>
              <dl className="mt-3 grid grid-cols-[7rem_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-muted-foreground">L 동안 회전</dt>
                <dd className="font-mono">{row.rotations}</dd>
                <dt className="text-muted-foreground">본 각도</dt>
                <dd>{row.seen}</dd>
              </dl>
              <p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">
                조정 없이 L′까지 늘리면: {row.extrapolated}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          d=128, base 10000인 가장 느린 dimension(i=63)은 원래 4096 token 동안 겨우 27.1도
          회전합니다. 한 바퀴(360도)의 13분의 1도 안 되는, 학습 내내 거의 멈춰 있던 각도입니다.
        </p>
        <p>
          이 dimension을 조정 없이 그대로 32768까지 늘리면 마지막 위치의 각도는 216.8도가 됩니다. 모델이 학습 동안 실제로 본 범위는 0도에서 27도뿐이므로 216.8도는
          한 번도 본 적 없는 위상입니다.
        </p>
        <p>
          Context length extrapolation의 실패는 이 낯선 위상에서 생깁니다. 같은 4096 token 동안 가장 빠른 dimension(i=0)은 이미 652바퀴를
          돌아 위상이 0도에서 360도까지 고르게 반복됩니다.
        </p>
        <p>
          이미 여러 번 돈 dimension은 더 먼 위치로 늘려도 낯선 각도가 나오지 않습니다. 위치 확장 문제는 결국 이 낯선 각도를 다루는 문제이고 다음 절부터 PI·NTK-
          aware·YaRN이 각자 다른 방식으로 답합니다.
        </p>

        <h3>메모리와 평가는 위치 확장과 다른 문제입니다</h3>
        <p>
          메모리 문제는 다릅니다. attention 계산량은 길이의 제곱에 가깝게, KV cache는 길이에 비례해 커지므로 위치를 늘려도 이 비용은 그대로 남습니다. RoPE
          scaling은 위치를 다루는 기술이지 이 비용을 줄이는 기술은 아닙니다.
        </p>
        <p>
          평가 문제는 또 다릅니다. 늘어난 길이가 실행된다는 사실과 그 안의 근거를 실제로 찾아
          쓰는 능력은 다른 질문입니다. 이 글 마지막 절의 release gate가 이 구분을 다룹니다.
        </p>
      </div>
    </div>
  );
}
