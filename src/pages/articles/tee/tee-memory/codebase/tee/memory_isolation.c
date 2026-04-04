/* === SGX: EADD — add a page to an enclave's EPC === */
typedef struct {
    uint64_t linaddr;       /* enclave virtual address */
    uint64_t srcpge;        /* source page in untrusted memory */
    secinfo_t *secinfo;     /* page type + RWX permissions */
    uint64_t secs;          /* SECS of target enclave */
} pageinfo_t;

void sgx_eadd(pageinfo_t *pinfo) {
    epcm_entry_t *epcm = lookup_epcm(pinfo->linaddr);
    epcm->enclavesecs = pinfo->secs;
    epcm->valid       = 1;
    epcm->page_type   = pinfo->secinfo->page_type; /* PT_REG | PT_TCS */
    epcm->rwx         = pinfo->secinfo->flags & 0x7;
    /* MEE encrypts page as it lands in EPC DRAM */
    mee_encrypt_page(pinfo->srcpge, pinfo->linaddr);
}

/* === SGX: ELDU — reload evicted page (EPC paging) === */
void sgx_eldu(pageinfo_t *pinfo, uint64_t evicted_va) {
    uint8_t mac[16];
    /* decrypt page from main memory → temporary buffer */
    mee_decrypt_page(evicted_va, tmp_buf, mac);
    /* verify MAC — reject if tampered */
    if (!mac_verify(tmp_buf, mac, pinfo->secs))
        gp_fault("#GP: MAC verification failed");
    /* restore EPCM metadata */
    epcm_entry_t *epcm = lookup_epcm(pinfo->linaddr);
    epcm->valid     = 1;
    epcm->page_type = pinfo->secinfo->page_type;
    copy_to_epc(tmp_buf, pinfo->linaddr);
}

/* === SEV: LAUNCH_UPDATE_DATA — encrypt guest memory === */
typedef struct {
    uint64_t  handle;      /* guest handle from LAUNCH_START */
    uint64_t  gpa;         /* guest physical address */
    uint64_t  length;      /* region size in bytes */
} sev_launch_update_t;

void sev_launch_update_data(sev_launch_update_t *cmd) {
    /* PSP derives Volume Encryption Key from guest's ASID */
    aes_key_t vek = psp_derive_vek(cmd->handle);
    /* encrypt each 16-byte block with AES-128-XEX */
    for (uint64_t off = 0; off < cmd->length; off += 16) {
        void *pa = gpa_to_hpa(cmd->gpa + off);
        aes_xex_encrypt(pa, vek, cmd->gpa + off); /* tweak = GPA */
    }
    /* update launch digest for attestation */
    sev_update_digest(cmd->handle, cmd->gpa, cmd->length);
}

/* === TDX: MKTME key configuration per TD === */
typedef struct {
    uint16_t  key_id;       /* MKTME KeyID (1..N) */
    uint8_t   algorithm;    /* AES-XTS-256 */
    uint8_t   key[32];      /* hardware-generated, never exposed */
} mktme_key_prog_t;

void tdx_configure_td_key(uint32_t td_id) {
    uint16_t kid = allocate_keyid(td_id);
    mktme_key_prog_t prog = {
        .key_id    = kid,
        .algorithm = MKTME_AES_XTS_256,
    };
    /* SEAMCALL: hardware RNG fills prog.key internally */
    seamcall_config_key(&prog);
    /* memory controller: writeback encrypt, read decrypt */
    /* cache line evict → AES-XTS-256(key[kid], addr) → DRAM */
    /* DRAM fetch → AES-XTS-256_dec(key[kid], addr) → cache */
}
