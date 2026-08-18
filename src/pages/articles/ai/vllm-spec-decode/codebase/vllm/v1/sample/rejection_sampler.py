# vllm/v1/sample/rejection_sampler.py — rejection_random_sample_kernel
# (vLLM v0.27.1, Triton kernel 핵심 로직만 발췌 — batch 병렬 실행을 위한
# pointer 인자와 synthetic-mode/greedy 분기는 생략했습니다.)
# 본문 대응: a(x)=min(1, p(x)/q(x)) rejection test와, 첫 거부 이후 후보를
# 확정 대상에서 제외하는 prefix acceptance 규칙.

def rejection_random_sample_one_request(
    draft_token_ids,     # 이번 request가 제안한 draft token id들 (길이 K)
    draft_probs,         # draft가 각 위치에서 해당 token에 준 확률 q(x)
    target_probs,        # target이 같은 위치·같은 token에 준 확률 p(x)
    recovered_token_ids, # 거부됐을 때 대신 쓸 correction token (r(x)에서 미리 샘플링됨)
    uniform_probs,       # 각 위치마다 미리 뽑아 둔 U(0,1) 난수
    bonus_token_id,       # 전부 수락됐을 때 추가로 확정할 다음 token
):
    output_token_ids = []
    rejected = False

    for pos in range(len(draft_token_ids)):
        if rejected:
            # article의 I_i = prod_{j<=i} R_j — 한 번 거부되면 이후 위치는
            # 더 이상 현재 prefix에서 만든 값이 아니므로 순회를 사실상 중단
            continue

        draft_token_id = draft_token_ids[pos]
        uniform_prob = uniform_probs[pos]

        draft_prob = draft_probs[pos][draft_token_id]   # q(x)
        target_prob = target_probs[pos][draft_token_id]  # p(x)

        # article의 a(x) = min(1, p(x)/q(x))를 accept/reject 판정으로 바꾼 형태.
        # target_prob/draft_prob >= uniform_prob는 U < min(1, ratio)와 동치
        # (ratio>=1이면 uniform_prob<=1이라 항상 참, ratio<1이면 그 비율만큼만 참)
        accepted = draft_prob > 0 and target_prob / draft_prob >= uniform_prob

        if accepted:
            token_id = draft_token_id
        else:
            rejected = True
            # article의 r(x) — target에만 남은 확률 질량에서 미리 뽑아 둔 후보
            token_id = recovered_token_ids[pos]

        output_token_ids.append(token_id)

    if not rejected:
        # 모든 draft가 수락됐을 때만 bonus token을 추가로 확정
        # (article의 A=K, committed length가 K+1이 되는 경우)
        output_token_ids.append(bonus_token_id)

    return output_token_ids
