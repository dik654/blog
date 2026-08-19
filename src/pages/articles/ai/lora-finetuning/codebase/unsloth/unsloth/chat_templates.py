# unslothai/unsloth 저장소 · unsloth/chat_templates.py (main branch, commit
# fdf83cb, 2026년 8월 기준). 전체 3092줄 중 이 글이 다루는 이중 BOS
# 문제와 직접 관련된 두 지점만 발췌했습니다 — get_chat_template()의 Gemma
# BOS 주입 분기, remove_special_tokens() 함수. 함수 본문 나머지(template
# 등록·매핑·GGUF 변환 로직)는 "..."로 생략했습니다.
#
# 실제 호출 지점: remove_special_tokens는 이 파일 안에서 GGUF 변환 결과와
# HF tokenizer 출력이 일치하는지 검증하는 test_hf_gguf_equivalence()에서
# 호출됩니다(원본 3052번째 줄, tokenizer.apply_chat_template(...) 직후).
# "학습 코드 어디서나 자동으로 호출되는 안전장치"는 아니지만, 이중 BOS가
# 실제로 어떻게 생기고 어떻게 지우는지를 보여주는 Unsloth의 실제 코드입니다.
#
# 본문 대응: Data.tsx의 "이미 special token이 포함된 문자열을 template에
# 다시 넣거나 다른 model의 template을 복사하면 training과 serving input이
# 달라집니다"라는 문장의 구체적 실패 사례 — chat template 문자열 자체가
# {{ bos_token }}을 하드코딩해 넣고, 그 문자열을 다시 tokenizer.encode(...,
# add_special_tokens=True)에 넣으면 BOS가 두 번 들어갑니다.

def get_chat_template(
    tokenizer,
    chat_template = "chatml",
    mapping = {"role": "role", "content": "content", "user": "user", "assistant": "assistant"},
    map_eos_token = True,
    system_message = None,
    patch_saving = True,
    use_zoo_tokenizer_patch = None,
):
    # ... (template 조회·매핑·EOS 처리 — 생략)

    # article이 가리키는 원인의 절반 — Gemma 계열은 chat template
    # 문자열 자체에 {{ bos_token }}이 없으면 여기서 강제로 앞에
    # 붙입니다. 이 template으로 만든 문자열은 이미 BOS를 포함합니다.
    # bos_token is a must or else losses become too high
    if IS_GEMMA and not chat_template.startswith(("{{ bos_token }}", "{{- bos_token }}")):
        chat_template = "{{ bos_token }}" + chat_template

    # ... (이하 template 조립 — 생략)


def remove_special_tokens(tokenizer, prompt):
    # article이 가리키는 원인의 나머지 절반이자 실제 fix — 위에서 만든
    # 문자열은 이미 BOS로 시작하는데, 이 문자열을 다시
    # tokenizer(..., add_special_tokens=True)로 인코딩하면 tokenizer가
    # 자기 BOS를 한 번 더 붙여 이중 BOS가 됩니다. 인코딩 직전에 문자열
    # 앞의 BOS를 지워 중복을 막습니다.
    # Removes double BOS token
    bos_token = getattr(tokenizer, "bos_token", None)
    if bos_token is not None and prompt.startswith(bos_token):
        prompt = prompt[len(bos_token):]
    return prompt
