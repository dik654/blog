// SPDX-License-Identifier: BSD-2-Clause
/*
 * Copyright (c) 2015, Linaro Limited
 */

/*
 * Acronyms:
 *
 * FEK - File Encryption Key
 * SSK - Secure Storage Key
 * TSK - Trusted app Storage Key
 * IV  - Initial vector
 * HUK - Hardware Unique Key
 * RNG - Random Number Generator
 */

#include <assert.h>
#include <compiler.h>
#include <crypto/crypto.h>
#include <initcall.h>
#include <kernel/huk_subkey.h>
#include <kernel/tee_common_otp.h>
#include <kernel/tee_ta_manager.h>
#include <stdlib.h>
#include <string.h>
#include <string_ext.h>
#include <tee/tee_cryp_utl.h>
#include <tee/tee_fs_key_manager.h>
#include <trace.h>
#include <util.h>

struct tee_fs_ssk {
	bool is_init;
	uint8_t key[TEE_FS_KM_SSK_SIZE];
};

static struct tee_fs_ssk tee_fs_ssk;

static TEE_Result do_hmac(void *out_key, size_t out_key_size,
			  const void *in_key, size_t in_key_size,
			  const void *message, size_t message_size)
{
	TEE_Result res;
	void *ctx = NULL;

	if (!out_key || !in_key || !message)
		return TEE_ERROR_BAD_PARAMETERS;

	res = crypto_mac_alloc_ctx(&ctx, TEE_FS_KM_HMAC_ALG);
	if (res != TEE_SUCCESS)
		return res;

	res = crypto_mac_init(ctx, in_key, in_key_size);
	if (res != TEE_SUCCESS)
		goto exit;

	res = crypto_mac_update(ctx, message, message_size);
	if (res != TEE_SUCCESS)
		goto exit;

	res = crypto_mac_final(ctx, out_key, out_key_size);

exit:
	crypto_mac_free_ctx(ctx);
	return res;
}

TEE_Result tee_fs_fek_crypt(const TEE_UUID *uuid, TEE_OperationMode mode,
			    const uint8_t *in_key, size_t size,
			    uint8_t *out_key)
{
	TEE_Result res;
	void *ctx = NULL;
	uint8_t tsk[TEE_FS_KM_TSK_SIZE];
	uint8_t dst_key[size];

	if (!in_key || !out_key)
		return TEE_ERROR_BAD_PARAMETERS;

	if (size != TEE_FS_KM_FEK_SIZE)
		return TEE_ERROR_BAD_PARAMETERS;

	if (tee_fs_ssk.is_init == 0)
		return TEE_ERROR_GENERIC;

	if (uuid) {
		res = do_hmac(tsk, sizeof(tsk), tee_fs_ssk.key,
			      TEE_FS_KM_SSK_SIZE, uuid, sizeof(*uuid));
		if (res != TEE_SUCCESS)
			return res;
	} else {
		uint8_t dummy[1] = { 0 };

		res = do_hmac(tsk, sizeof(tsk), tee_fs_ssk.key,
			      TEE_FS_KM_SSK_SIZE, dummy, sizeof(dummy));
		if (res != TEE_SUCCESS)
			return res;
	}

	res = crypto_cipher_alloc_ctx(&ctx, TEE_FS_KM_ENC_FEK_ALG);
	if (res != TEE_SUCCESS)
		return res;

	res = crypto_cipher_init(ctx, mode, tsk, sizeof(tsk), NULL, 0, NULL, 0);
	if (res != TEE_SUCCESS)
		goto exit;

	res = crypto_cipher_update(ctx, mode, true, in_key, size, dst_key);
	if (res != TEE_SUCCESS)
		goto exit;

	crypto_cipher_final(ctx);

	memcpy(out_key, dst_key, sizeof(dst_key));

exit:
	crypto_cipher_free_ctx(ctx);
	memzero_explicit(tsk, sizeof(tsk));
	memzero_explicit(dst_key, sizeof(dst_key));

	return res;
}

static TEE_Result tee_fs_init_key_manager(void)
{
	TEE_Result res = TEE_SUCCESS;

	COMPILE_TIME_ASSERT(TEE_FS_KM_SSK_SIZE <= HUK_SUBKEY_MAX_LEN);

	res = huk_subkey_derive(HUK_SUBKEY_SSK, NULL, 0,
				tee_fs_ssk.key, sizeof(tee_fs_ssk.key));
	if (res == TEE_SUCCESS)
		tee_fs_ssk.is_init = 1;
	else
		memzero_explicit(&tee_fs_ssk, sizeof(tee_fs_ssk));

	return res;
}

TEE_Result tee_fs_generate_fek(const TEE_UUID *uuid, void *buf, size_t buf_size)
{
	TEE_Result res;

	if (buf_size != TEE_FS_KM_FEK_SIZE)
		return TEE_ERROR_BAD_PARAMETERS;

	res = crypto_rng_read(buf, TEE_FS_KM_FEK_SIZE);
	if (res != TEE_SUCCESS)
		return res;

	return tee_fs_fek_crypt(uuid, TEE_MODE_ENCRYPT, buf,
				TEE_FS_KM_FEK_SIZE, buf);
}

service_init_late(tee_fs_init_key_manager);
