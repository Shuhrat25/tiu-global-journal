/**
 * True while the editor still has to take the final decision on the article of `review`:
 * the article is waiting for it (`reviewed`) and this is its latest review.
 */
export function awaitsDecision(store, review) {
  if (!review) return false
  return (
    store.articleById(review.articleId)?.status === 'reviewed' &&
    store.reviewForArticle(review.articleId)?.id === review.id
  )
}
