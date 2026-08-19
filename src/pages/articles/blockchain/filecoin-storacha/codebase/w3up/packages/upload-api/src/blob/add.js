// storacha/w3up 저장소 · packages/upload-api/src/blob/add.js (main
// branch, commit d02da30, 2026년 8월 기준). 전체 256줄 중 이 글이 다루는
// blobAddProvider 핸들러의 allocate→put→accept 순서만 발췌했습니다.
// allocate/put/accept 각 함수의 내부 구현(receipt 서명·재시도 판정)은
// 생략했습니다.
// 본문 대응: blob-upload section의 U=Auth∧Alloc∧Put∧Accept∧(H(bytes)=d)
// — space/blob/add invocation 하나가 실제로 세 개의 별도 effect(allocate·
// put·accept)로 나뉘어 실행되고, 그 결과가 receipt link로 이어진다는 근거.

/**
 * space/blob/add capability의 서버측 handler. article의 Alloc·Put·Accept
 * 세 항이 정확히 이 세 호출이다 — 하나라도 실패하면 최종 receipt가
 * 완료로 표시되지 않는다.
 * @returns {API.ServiceMethod<API.BlobAdd, API.BlobAddSuccess, API.BlobAddFailure>}
 */
export function blobAddProvider(context) {
  return Server.provideAdvanced({
    capability: Blob.add,
    handler: async ({ capability, invocation }) => {
      const { with: space, nb } = capability
      const { blob } = nb

      // article의 Alloc — capacity를 배정하는 첫 effect
      const allocation = await allocate({
        context,
        blob,
        space,
        cause: invocation.link(),
      })

      // article의 Put — 실제 byte transfer effect. allocation receipt를
      // 입력으로 받아 같은 task/digest에 이어붙인다.
      const delivery = await put({
        blob,
        allocation,
      })

      // article의 Accept — service가 effect chain 전체를 받아들여
      // signed receipt를 만드는 마지막 effect
      const acceptance = await accept({
        context,
        blob,
        space,
        delivery,
      })

      // article의 "receipt의 link가 같은 task/digest를 가리켜야 blob
      // 단계가 끝난다" — 세 effect의 task를 모두 이번 invocation
      // 결과에 fork(연결)해야 최종 accept 지점(site)에 도달한다.
      let result = Server.ok({
        site: {
          'ucan/await': ['.out.ok.site', acceptance.task.link()],
        },
      })
        .fork(allocation.task)
        .fork(delivery.task)
        .fork(acceptance.task)

      const fx = [...allocation.fx, ...delivery.fx, ...acceptance.fx]
      for (const task of fx) {
        result = result.fork(task)
      }

      return result
    },
  })
}
