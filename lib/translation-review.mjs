import { createHash } from 'node:crypto';
// Covers both source and translation. Changing either invalidates the recorded review.
export function translationReviewHash(translation, sourceUi, targetUi) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        sourceHash: translation.sourceHash,
        strings: translation.strings,
        sourceUi,
        targetUi,
      }),
    )
    .digest('hex');
}
