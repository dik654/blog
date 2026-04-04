// SPDX-License-Identifier: BSD-2-Clause
/*
 * Copyright (c) 2015-2016, Linaro Limited
 * Copyright (c) 2014, STMicroelectronics International N.V.
 */

#include <assert.h>
#include <compiler.h>
#include <initcall.h>
#include <kernel/panic.h>
#include <kernel/tee_misc.h>
#include <mm/core_mmu.h>
#include <mm/mobj.h>
#include <optee_msg.h>
#include <string.h>
#include <tee/entry_std.h>
#include <tee/tee_cryp_utl.h>
#include <tee/uuid.h>

/* Sessions opened from normal world */
static struct tee_ta_session_head tee_open_sessions =
TAILQ_HEAD_INITIALIZER(tee_open_sessions);

static unsigned int session_pnum;

static void entry_open_session(struct optee_msg_arg *arg, uint32_t num_params)
{
	TEE_Result res = TEE_ERROR_GENERIC;
	TEE_ErrorOrigin err_orig = TEE_ORIGIN_TEE;
	struct tee_ta_session *s = NULL;
	TEE_Identity clnt_id = { };
	TEE_UUID uuid = { };
	struct tee_ta_param param = { };
	size_t num_meta = 0;
	uint64_t saved_attr[TEE_NUM_PARAMS] = { 0 };

	res = get_open_session_meta(num_params, arg->params, &num_meta, &uuid,
				    &clnt_id);
	if (res != TEE_SUCCESS)
		goto out;

	res = copy_in_params(arg->params + num_meta, num_params - num_meta,
			     &param, saved_attr);
	if (res != TEE_SUCCESS)
		goto cleanup_shm_refs;

	res = tee_ta_open_session(&err_orig, &s, &tee_open_sessions, &uuid,
				  &clnt_id, TEE_TIMEOUT_INFINITE, &param);
	if (res != TEE_SUCCESS)
		s = NULL;
	copy_out_param(&param, num_params - num_meta, arg->params + num_meta,
		       saved_attr);

	plat_prng_add_jitter_entropy(CRYPTO_RNG_SRC_JITTER_SESSION,
				     &session_pnum);

cleanup_shm_refs:
	cleanup_shm_refs(saved_attr, &param, num_params - num_meta);

out:
	if (s)
		arg->session = s->id;
	else
		arg->session = 0;
	arg->ret = res;
	arg->ret_origin = err_orig;
}

static void entry_close_session(struct optee_msg_arg *arg, uint32_t num_params)
{
	TEE_Result res;
	struct tee_ta_session *s;

	if (num_params) {
		res = TEE_ERROR_BAD_PARAMETERS;
		goto out;
	}

	plat_prng_add_jitter_entropy(CRYPTO_RNG_SRC_JITTER_SESSION,
				     &session_pnum);

	s = tee_ta_find_session(arg->session, &tee_open_sessions);
	res = tee_ta_close_session(s, &tee_open_sessions, NSAPP_IDENTITY);
out:
	arg->ret = res;
	arg->ret_origin = TEE_ORIGIN_TEE;
}

static void entry_invoke_command(struct optee_msg_arg *arg, uint32_t num_params)
{
	TEE_Result res;
	TEE_ErrorOrigin err_orig = TEE_ORIGIN_TEE;
	struct tee_ta_session *s;
	struct tee_ta_param param = { 0 };
	uint64_t saved_attr[TEE_NUM_PARAMS] = { 0 };

	res = copy_in_params(arg->params, num_params, &param, saved_attr);
	if (res != TEE_SUCCESS)
		goto out;

	s = tee_ta_get_session(arg->session, true, &tee_open_sessions);
	if (!s) {
		res = TEE_ERROR_BAD_PARAMETERS;
		goto out;
	}

	res = tee_ta_invoke_command(&err_orig, s, NSAPP_IDENTITY,
				    TEE_TIMEOUT_INFINITE, arg->func, &param);

	tee_ta_put_session(s);

	copy_out_param(&param, num_params, arg->params, saved_attr);

out:
	cleanup_shm_refs(saved_attr, &param, num_params);

	arg->ret = res;
	arg->ret_origin = err_orig;
}

/* Note: this function is weak to let platforms add special handling */
TEE_Result __weak tee_entry_std(struct optee_msg_arg *arg, uint32_t num_params)
{
	return __tee_entry_std(arg, num_params);
}

TEE_Result __tee_entry_std(struct optee_msg_arg *arg, uint32_t num_params)
{
	TEE_Result res = TEE_SUCCESS;

	/* Enable foreign interrupts for STD calls */
	thread_set_foreign_intr(true);
	switch (arg->cmd) {
	case OPTEE_MSG_CMD_OPEN_SESSION:
		entry_open_session(arg, num_params);
		break;
	case OPTEE_MSG_CMD_CLOSE_SESSION:
		entry_close_session(arg, num_params);
		break;
	case OPTEE_MSG_CMD_INVOKE_COMMAND:
		entry_invoke_command(arg, num_params);
		break;
	case OPTEE_MSG_CMD_CANCEL:
		entry_cancel(arg, num_params);
		break;
	default:
		EMSG("Unknown cmd 0x%x", arg->cmd);
		res = TEE_ERROR_NOT_IMPLEMENTED;
	}

	return res;
}
