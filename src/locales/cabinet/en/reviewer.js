/* Reviewer cabinet texts (English) — translated from cabinet/uz-Cyrl/reviewer.js */
export default {
  title: 'Reviewer dashboard',
  subtitle: 'Review articles and share your expert opinion',
  stats: {
    invited: 'Pending invitations',
    accepted: 'Active reviews',
    submitted: 'Completed reviews',
  },
  article: {
    authors: 'Authors: {authors}',
    submitted: 'Submitted: {date}',
    download: 'Download the article file',
  },
  invitations: {
    title: 'Review invitations',
    accept: 'Accept',
    decline: 'Decline',
    empty: 'No new review invitations yet',
  },
  reviews: {
    title: 'My reviews',
    write: 'Write a review',
    view: 'View',
    draft: 'Draft saved',
  },
  decline: {
    title: 'Decline invitation',
    article: 'Article',
    reason: 'Reason for declining',
    comment: 'Comment',
    commentPlaceholder: 'A short comment for the editor...',
    commentHint: 'A comment is required if “{reason}” is selected',
    submit: 'Decline invitation',
  },
  form: {
    title: 'Article review',
    draftRestored: 'Your previously saved draft has been restored',
    placeholders: {
      significance: 'Assess the scientific contribution and significance of this work...',
      novelty: 'Assess the novelty and originality of the approach...',
      methodology: 'Evaluate the research methodology, experimental design and analysis...',
      recommendations: 'Give specific recommendations for improvement or point out any concerns...',
    },
    verdict: 'Final recommendation',
    verdictPlaceholder: 'Select your recommendation...',
    saveDraft: 'Save draft',
    submit: 'Submit review',
  },
  view: {
    title: 'Review report',
    submittedAt: 'Review submitted on',
  },
  notices: {
    accepted: 'Invitation accepted. You can now download the article and write your review.',
    declined: 'Invitation declined. The editor will choose another reviewer for the article.',
    submitted: 'Review submitted. Thank you for your report — it has been forwarded to the editor.',
    draftSaved: 'Draft saved. You can continue your review at any time.',
    draftCleared: 'Draft deleted: all form fields were empty.',
  },
  /* lines of the demo "article file" (a text file generated in the browser) */
  file: {
    keywords: 'Keywords: {keywords}',
    abstract: 'Abstract',
    demo: 'Demo copy: the original file ({file}) will be available for download once the server is connected.',
  },
}
