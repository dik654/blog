// storacha/ucanto 저장소 · packages/validator/src/capability.js (main
// branch, commit 0255a11, 2026년 8월 기준). 전체 927줄 중 이 글이 다루는
// defaultDerives(attenuation 검사)만 발췌했습니다. Capability matching·
// ability pattern 해석·proof chain 순회는 생략했습니다.
// 본문 대응: space-authorization section의 C_child⊆C_parent —
// child delegation이 parent보다 강한 권한을 만들지 않았는지 확인하는 실제
// 코드.

/**
 * defaultDerives — claimed capability(child가 쓰려는 권한)가 delegated
 * capability(proof chain의 parent가 실제로 위임한 권한)를 벗어나지
 * 않는지 검사합니다. article의 R_c⊆R_p(resource), C_c⊆C_p(caveats) 두
 * 조건이 정확히 이 함수의 두 단계다.
 * @param {API.ParsedCapability} claimed
 * @param {API.ParsedCapability} delegated
 * @return {API.Result<true, API.Failure>}
 */
const defaultDerives = (claimed, delegated) => {
  // article의 R_c⊆R_p — resource 포함 관계 검사. delegated.with가
  // "space:did:key:abc*"처럼 wildcard prefix면 claimed가 그 prefix로
  // 시작하는지, 아니면 정확히 같은 resource인지 확인한다.
  if (delegated.with.endsWith('*')) {
    if (!claimed.with.startsWith(delegated.with.slice(0, -1))) {
      return Schema.error(
        `Resource ${claimed.with} does not match delegated ${delegated.with} `
      )
    }
  } else if (delegated.with !== claimed.with) {
    return Schema.error(
      `Resource ${claimed.with} is not contained by ${delegated.with}`
    )
  }

  // article의 caveats가 "같거나 더 엄격해야" — delegated가 정한 caveat
  // 값과 claimed가 요청한 값이 정확히 같아야 통과. 값이 다르면(더 느슨한
  // caveat를 요청해도) 즉시 거절한다.
  const caveats = delegated.nb || {}
  const nb = claimed.nb || {}
  const kv = entries(caveats)

  for (const [name, value] of kv) {
    if (nb[name] != value) {
      return Schema.error(`${String(name)}: ${nb[name]} violates ${value}`)
    }
  }

  // 여기까지 통과하면 claimed는 delegated 범위를 넘지 않는다 —
  // article의 C_child⊆C_parent가 성립
  return { ok: true }
}
