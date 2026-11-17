/*
 * Editorial board. Names and positions are translated in src/locales/*
 * under editorial.members.<id>; tab titles under editorial.tabs.<id>.
 * Photos are cropped from the Figma design (only the portrait, no text).
 */
import m1 from '@/assets/images/editorial/m1.jpg'
import m2 from '@/assets/images/editorial/m2.jpg'
import m3 from '@/assets/images/editorial/m3.jpg'
import m4 from '@/assets/images/editorial/m4.jpg'
import m5 from '@/assets/images/editorial/m5.jpg'
import m6 from '@/assets/images/editorial/m6.jpg'
import m7 from '@/assets/images/editorial/m7.jpg'
import m8 from '@/assets/images/editorial/m8.jpg'
import m9 from '@/assets/images/editorial/m9.jpg'
import m10 from '@/assets/images/editorial/m10.jpg'
import m11 from '@/assets/images/editorial/m11.jpg'
import m12 from '@/assets/images/editorial/m12.jpg'
import m13 from '@/assets/images/editorial/m13.jpg'
import m14 from '@/assets/images/editorial/m14.jpg'
import m15 from '@/assets/images/editorial/m15.jpg'
import m16 from '@/assets/images/editorial/m16.jpg'

export const editorialTabs = [
  {
    // Таҳрир кенгаши таркиби — university leadership on the council
    id: 'board',
    members: [
      { id: 'm1', photo: m1 },
      { id: 'm2', photo: m2 },
      { id: 'm3', photo: m3 },
      { id: 'm4', photo: m4 },
    ],
  },
  {
    // Таҳрир кенгаши аъзолари — council members (order as in the design grid)
    id: 'members',
    members: [
      { id: 'm5', photo: m5 },
      { id: 'm6', photo: m6 },
      { id: 'm7', photo: m7 },
      { id: 'm8', photo: m8 },
      { id: 'm9', photo: m9 },
      { id: 'm10', photo: m10 },
      { id: 'm11', photo: m11 },
      { id: 'm12', photo: m12 },
      { id: 'm13', photo: m13 },
      { id: 'm14', photo: m14 },
      { id: 'm15', photo: m15 },
      { id: 'm16', photo: m16 },
    ],
  },
]
