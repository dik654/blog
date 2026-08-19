# huggingface/transformers 저장소 · src/transformers/loss/loss_utils.py
# (main branch, commit e12c79c, 2026년 8월 기준). 전체 201줄 중 이 글이
# 다루는 fixed_cross_entropy·ForCausalLMLoss만 발췌했습니다. 다른 loss
# 유형(masked LM·object detection 등)은 생략했습니다. 함수 이름
# `fixed_cross_entropy` 자체가 2024년 Unsloth가 보고한 gradient
# accumulation loss 정규화 버그(PR #34191)를 고친 결과물입니다.
# 본문 대응: effective-batch section의 "각 micro loss의 reduction scale이
# 같습니다"라는 가정이 실전에서 깨지는 지점 — micro-batch마다 자기
# 토큰 수로만 나누면(mean reduction) sequence 길이가 다를 때 전체 batch
# loss와 달라진다.

def fixed_cross_entropy(
    source: torch.Tensor,
    target: torch.Tensor,
    num_items_in_batch: torch.Tensor | None = None,
    ignore_index: int = -100,
    **kwargs,
) -> torch.Tensor:
    # article의 버그 지점 — num_items_in_batch(accumulation window 전체의
    # 유효 토큰 수)가 없으면 예전처럼 각 micro-batch가 "mean"으로 자기
    # 자신의 토큰 수로만 나눈다. 이게 바로 K개 micro-batch의 sequence
    # 길이가 다를 때 전체 loss와 어긋나는 원인이다.
    reduction = "sum" if num_items_in_batch is not None else "mean"
    loss = nn.functional.cross_entropy(source, target, ignore_index=ignore_index, reduction=reduction)
    if reduction == "sum":
        if torch.is_tensor(num_items_in_batch):
            num_items_in_batch = num_items_in_batch.to(loss.device)
        # article의 fix — micro-batch 자신의 토큰 수가 아니라, 미리 계산해
        # 둔 accumulation window 전체의 유효 토큰 수로 나눈다("denominator를
        # 미리 구한다"는 Unsloth의 fix 설명이 정확히 이 지점).
        loss = loss / num_items_in_batch
    return loss


def ForCausalLMLoss(
    logits,
    labels,
    vocab_size: int,
    num_items_in_batch: torch.Tensor | None = None,
    ignore_index: int = -100,
    shift_labels: torch.Tensor | None = None,
    **kwargs,
) -> torch.Tensor:
    logits = logits.float()

    if shift_labels is None:
        labels = nn.functional.pad(labels, (0, 1), value=ignore_index)
        shift_labels = labels[..., 1:].contiguous()

    logits = logits.view(-1, vocab_size)
    shift_labels = shift_labels.view(-1)
    shift_labels = shift_labels.to(logits.device)
    # num_items_in_batch를 그대로 fixed_cross_entropy에 전달 — 이 값이
    # None이면(구버전 호출 경로) 여전히 버그가 있던 mean-reduction 경로로
    # 빠진다.
    loss = fixed_cross_entropy(logits, shift_labels, num_items_in_batch, ignore_index, **kwargs)
    return loss
