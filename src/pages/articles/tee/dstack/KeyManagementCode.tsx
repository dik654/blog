export const keyHierarchyCode = `KMS Root Key (마스터 시크릿)
├── Root CA Key
│   ├── App CA Key (per app_id)   → 앱별 TLS 인증서 서명
│   ├── App Disk Encryption Key   → dm-crypt 볼륨 암호화
│   └── Environment Encryption Key → .env 파일 암호화
└── K256 Root Key
    └── K256 App Key (per app_id) → secp256k1 애플리케이션 키

// 유도 함수: HKDF-SHA256
// context = [app_id, instance_id, purpose]
let key = hkdf::derive(&root_key, &[&app_id, &instance_id, b"app-disk-crypt-key"])?;`;

export const keyIssueCode = `// kms/src/main_service.rs
async fn get_app_key(request: GetAppKeyRequest) -> Result<AppKeyResponse> {
    // 1. API 버전 확인
    ensure!(request.api_version <= 1, "Unsupported API version");

    // 2. 앱 부팅 허가 확인 (MRTD 화이트리스트 검사)
    let BootConfig { boot_info, gateway_app_id, os_image_hash }
        = self.ensure_app_boot_allowed(&request.vm_config).await?;

    let app_id = &boot_info.app_id;
    let instance_id = &boot_info.instance_id;

    // 3. 각 키 유도
    let app_disk_key = kdf::derive_dh_secret(
        &root_ca_key,
        &[app_id, instance_id, b"app-disk-crypt-key"],
    )?;

    let env_crypt_key = {
        let secret = kdf::derive_dh_secret(
            &root_ca_key,
            &[app_id, b"env-encrypt-key"], // instance_id 없음: 인스턴스간 공유
        )?;
        x25519_dalek::StaticSecret::from(secret).to_bytes()
    };

    let (k256_key, k256_signature) = derive_k256_key(&k256_root, app_id)?;

    // 4. 응답 반환
    Ok(AppKeyResponse {
        ca_cert: root_ca_pem,
        disk_crypt_key: app_disk_key.to_vec(),
        env_crypt_key: env_crypt_key.to_vec(),
        k256_key: k256_key.to_bytes().to_vec(),
        k256_signature, // 루트 키의 서명 → 키 출처 증명
        gateway_app_id,
        os_image_hash,
    })
}`;

export const k256Code = `// kms/src/crypto.rs
fn derive_k256_key(parent_key: &SigningKey, app_id: &[u8])
    -> Result<(SigningKey, Vec<u8>)>
{
    // 1. HKDF로 앱 키 유도 — context에 app_id + "app-key" 포함
    let context_data: &[&[u8]] = &[app_id, b"app-key"];
    let derived_bytes: [u8; 32] =
        kdf::derive_ecdsa_key(&parent_key.to_bytes(), context_data, 32)?
            .try_into()
            .ok()
            .context("Invalid derived key len")?;
    let app_key = SigningKey::from_bytes(&derived_bytes.into())?;

    // 2. 루트 키로 앱 공개키에 서명 (신뢰 체인)
    let app_pubkey = app_key.verifying_key().to_sec1_bytes();
    let signature = sign_message(parent_key, b"dstack-kms-issued", app_id, &app_pubkey)?;
    // 누구든 루트 공개키로 앱 키의 출처를 검증 가능

    Ok((app_key, signature))
}`;

export const bootPolicyCode = `// 부팅 허가 확인
async fn ensure_app_boot_allowed(vm_config: &VmConfig) -> Result<BootConfig> {
    // 1. TDX Quote에서 MRTD 추출
    let quote = verify_tdx_quote(&vm_config.quote)?;
    let mrtd = quote.td_report.mrtd;

    // 2. 화이트리스트 확인
    if !self.config.allowed_mrtds.contains(&mrtd) {
        bail!("MRTD not in allowlist: {}", hex::encode(mrtd));
    }

    // 3. App ID 결정
    let app_id = sha256_hex(&vm_config.compose_file);
    let instance_id = Uuid::new_v4().to_string();

    Ok(BootConfig { boot_info: BootInfo { app_id, instance_id }, .. })
}`;
