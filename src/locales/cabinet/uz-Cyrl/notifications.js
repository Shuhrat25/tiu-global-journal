/* Notification templates — keys are used by src/stores/journal.js, {title} is the article title, {reviewer} a name */
export default {
  /* the mark of a notification that has not been read yet */
  new: 'Янги',
  articleSubmitted: '“{title}” мақолангиз таҳририятга юборилди',
  newSubmission: 'Янги мақола келиб тушди: “{title}”',
  revisionUploaded: '“{title}” мақоласининг тузатилган нусхаси юкланди',
  paymentDone: '“{title}” мақоласи учун тўлов қабул қилинди',
  paymentReceived: '“{title}” мақоласи учун тўлов келиб тушди',
  articleRejected: '“{title}” мақоласи рад этилди',
  revisionRequested: '“{title}” мақоласи учун тузатиш талаб қилинди',
  reviewInvitation: 'Сизга “{title}” мақоласига тақриз ёзиш таклиф қилинди',
  sentToReview: '“{title}” мақоласи тақризга берилди',
  articleAccepted: '“{title}” мақоласи нашр учун қабул қилинди. Тўловни амалга оширинг',
  articlePublished: '“{title}” мақоласи нашрга берилди',
  reviewAccepted: '{reviewer} “{title}” мақоласига тақриз ёзиш таклифини қабул қилди',
  reviewDeclined: '{reviewer} “{title}” мақоласига тақриз ёзишдан бош тортди',
  reviewReceived: '“{title}” мақоласи бўйича тақриз хулосаси келди',
  reviewThanks: '“{title}” мақоласига тақризингиз учун раҳмат',
}
