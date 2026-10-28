        // check if we have a new finalized block
        if let Some(finalized) =
            last_finalized_block.update(client.finalized_block_number().ok().flatten()) &&
            let BlobStoreUpdates::Finalized(blobs) =
                blob_store_tracker.on_finalized_block(finalized)
        {
            metrics.inc_deleted_tracked_blobs(blobs.len());
            // remove all finalized blobs from the blob store
            pool.delete_blobs(blobs);
            // and also do periodic cleanup
            let pool = pool.clone();
            task_spawner.spawn_blocking_task(async move {
                debug!(target: "txpool", finalized_block = %finalized, "cleaning up blob store");
                pool.cleanup_blobs();
            });
