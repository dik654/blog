import type { CodeRef } from '@/components/code/types';

const ATTEST_REPORT = `/* drivers/virt/coco/sev-guest/sev-guest.h */
struct snp_report_resp {
    uint32_t version;            /* 보고서 버전 (2) */
    uint32_t guest_svn;          /* 게스트 Security Version Number */
    uint64_t policy;             /* 게스트 정책 (디버그/마이그레이션 플래그) */
    uint8_t  family_id[16];      /* 패밀리 ID */
    uint8_t  image_id[16];       /* 이미지 ID */
    uint32_t vmpl;               /* 보고서 요청 VMPL */
    uint32_t sig_algo;           /* 0x1 = ECDSA P-384 with SHA-384 */
    uint64_t platform_info;      /* TSME/SMT 상태 */
    uint8_t  measurement[48];    /* SHA-384 런치 다이제스트 (핵심!) */
    uint8_t  host_data[32];      /* 호스트가 추가한 데이터 */
    uint8_t  report_data[64];    /* 게스트 challenge (nonce) */
    uint8_t  chip_id[64];        /* 칩 고유 식별자 */
    struct {
        uint8_t  r[72];          /* ECDSA r 값 */
        uint8_t  s[72];          /* ECDSA s 값 */
    } signature;                 /* VCEK 서명 */
};`;

const GUEST_REQUEST = `/* drivers/virt/coco/sev-guest/sev-guest.c */
static int get_report(struct snp_guest_dev *snp_dev,
                      struct snp_guest_request_ioctl *arg)
{
    struct snp_report_req *req = &snp_dev->req;
    struct snp_report_resp *resp;
    int rc;

    /* 1. report_data(64바이트) 복사 — nonce로 사용 */
    if (copy_from_user(req, (void __user *)arg->req_data,
                       sizeof(*req)))
        return -EFAULT;

    /* 2. PSP에 SNP_GUEST_REQUEST 커맨드 전송 */
    rc = snp_issue_guest_request(SVM_VMGEXIT_GUEST_REQUEST,
                                 snp_dev->certs_data,
                                 &arg->fw_err);
    if (rc)
        return rc;

    /* 3. 응답 버퍼에서 서명된 보고서 수령 */
    resp = snp_dev->response;
    if (copy_to_user((void __user *)arg->resp_data,
                     resp, sizeof(*resp)))
        return -EFAULT;

    return 0;
}`;

export const attestCodeRefs: Record<string, CodeRef> = {
  'attest-report': {
    path: 'linux/drivers/virt/coco/sev-guest/sev-guest.h',
    code: ATTEST_REPORT,
    highlight: [2, 21],
    lang: 'c',
    annotations: [
      { lines: [3, 10], color: 'sky', note: '게스트 식별 + 정책 필드' },
      { lines: [13, 13], color: 'emerald', note: 'measurement — 런치 다이제스트 (핵심 필드)' },
      { lines: [15, 16], color: 'amber', note: 'report_data — nonce/challenge 전달' },
      { lines: [17, 20], color: 'violet', note: 'VCEK ECDSA P-384 서명' },
    ],
    desc:
`SNP Attestation Report는 PSP(Platform Security Processor)가 생성하는 서명된 보고서입니다.

measurement: 게스트 런치 시 SHA-384로 축적된 다이제스트. 이미지 해시와 비교하여 무결성 검증.
report_data: 게스트가 넣는 64바이트. 보통 nonce를 넣어 재전송 공격을 방지합니다.
signature: 칩 고유 VCEK(Versioned Chip Endorsement Key)로 서명. AMD KDS로 검증.`,
  },

  'guest-request': {
    path: 'linux/drivers/virt/coco/sev-guest/sev-guest.c',
    code: GUEST_REQUEST,
    highlight: [2, 27],
    lang: 'c',
    annotations: [
      { lines: [10, 12], color: 'sky', note: 'report_data 복사 — 사용자 공간에서 nonce 전달' },
      { lines: [15, 18], color: 'emerald', note: 'VMGEXIT로 PSP에 요청 — 하이퍼바이저 우회' },
      { lines: [23, 26], color: 'amber', note: '서명된 보고서를 사용자 공간으로 반환' },
    ],
    desc:
`게스트 커널의 SNP Guest Request 드라이버입니다.

/dev/sev-guest ioctl을 통해 사용자 프로세스가 증명 보고서를 요청합니다.
SVM_VMGEXIT_GUEST_REQUEST로 PSP에 직접 통신하며,
하이퍼바이저는 이 통신을 조작할 수 없습니다.`,
  },
};
