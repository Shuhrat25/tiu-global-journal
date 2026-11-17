/* Text sections of a review, in display order (labels: cabinet.common.review.<field>) */
export const REVIEW_TEXT_FIELDS = ['significance', 'novelty', 'methodology', 'recommendations']

/* A draft counts only when something is written or chosen: a saved empty form is no draft */
export const hasDraftContent = (draft) =>
  Boolean(draft) && Object.values(draft).some((value) => String(value ?? '').trim() !== '')
