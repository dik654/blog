import type { CodeRef } from '@/components/code/types';

const KEY_DERIVE = `// kms/src/crypto.rs — HKDF 기반 키 유도
fn derive_app_keys(root_key: &[u8], app_id: &str, instance_id: &str)
    -> Result<AppKeys>
{
    // 1. 디스크 암호화 키 (인스턴스별 고유)
    let disk_key = hkdf_sha256(
        root_key,
        &[app_id.as_bytes(), instance_id.as_bytes(),
          b"app-disk-crypt-key"],
    )?;

    // 2. 환경변수 암호화 키 (인스턴스간 공유)
    //    → instance_id 미포함: 같은 앱의 모든 인스턴스가 동일 키
    let env_key = hkdf_sha256(
        root_key,
        &[app_id.as_bytes(), b"env-encrypt-key"],
    )?;

    // 3. K256 앱 키 (secp256k1)
    let k256_key = hkdf_sha256(
        root_key,
        &[app_id.as_bytes(), b"app-key"],
    )?;
    let signing_key = SigningKey::from_bytes(&k256_key.into())?;

    Ok(AppKeys { disk_key, env_key, signing_key })
}`;

const RA_TLS = `// ra-tls/src/cert.rs — RA-TLS 인증서 생성
fn create_ra_tls_cert(quote: &[u8], key_pair: &KeyPair)
    -> Result<Certificate>
{
    // 1. TDX Quote를 X.509 확장에 임베딩
    let tdx_ext = Extension {
        oid: OID_INTEL_TDX_QUOTE, // 1.2.840.113741.1337.6
        critical: false,
        value: Der::encode(quote)?,
    };

    // 2. report_data에 공개키 바인딩
    // report_data = SHA-512("ratls-cert:" || DER(public_key))
    // → TLS 핸드셰이크 시 공개키와 Quote가 동일 출처임을 증명

    // 3. 자체 서명 인증서 생성
    let cert = CertificateBuilder::new()
        .subject_alt_name(key_pair.public_key())
        .extension(tdx_ext)
        .sign(key_pair)?;

    Ok(cert)
}`;

export const kmsCodeRefs: Record<string, CodeRef> = {
  'key-derive': {
    path: 'dstack/kms/src/crypto.rs',
    code: KEY_DERIVE,
    highlight: [2, 28],
    lang: 'rust',
    annotations: [
      { lines: [7, 12], color: 'sky', note: '디스크 암호화 키 — instance_id 포함 (인스턴스별 고유)' },
      { lines: [15, 19], color: 'emerald', note: '환경변수 키 — instance_id 미포함 (인스턴스간 공유)' },
      { lines: [22, 26], color: 'amber', note: 'K256 앱 키 — secp256k1 서명용' },
    ],
    desc:
`KMS의 핵심 키 유도 로직입니다. HKDF-SHA256으로 Root Key에서 용도별 키를 파생합니다.

disk_key: instance_id를 context에 포함 → 각 VM 인스턴스마다 다른 디스크 암호화 키
env_key: instance_id를 포함하지 않음 → 같은 앱의 모든 인스턴스가 .env 파일 공유
k256_key: secp256k1 서명 키 → 블록체인 트랜잭션 서명 등에 사용

이 설계 덕분에 VM 재시작 시에도 동일한 키를 받아 디스크를 복호화할 수 있습니다.`,
  },

  'ra-tls': {
    path: 'dstack/ra-tls/src/cert.rs',
    code: RA_TLS,
    highlight: [2, 22],
    lang: 'rust',
    annotations: [
      { lines: [6, 10], color: 'sky', note: 'TDX Quote → X.509 OID 확장에 임베딩' },
      { lines: [13, 14], color: 'emerald', note: 'report_data에 공개키 바인딩 → 출처 증명' },
      { lines: [17, 21], color: 'amber', note: '자체 서명 인증서 생성 → TLS 핸드셰이크에 사용' },
    ],
    desc:
`RA-TLS(Remote Attestation TLS)는 TLS 인증서에 TDX Quote를 임베딩하는 기법입니다.

일반 TLS는 CA가 발급한 인증서로 신원을 증명하지만,
RA-TLS는 하드웨어 증명(TDX Quote)으로 코드 무결성까지 증명합니다.

클라이언트는 TLS 핸드셰이크 후 인증서에서 Quote를 추출하여
서버가 기밀 VM 안에서 실행 중인지 검증합니다.`,
  },
};
