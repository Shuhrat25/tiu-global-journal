import { nextTick } from 'vue'

/**
 * After a failed submit: once the errors are rendered, moves the focus to the first control marked
 * aria-invalid inside `root` (a form or the content of a dialog). The keyboard lands on the field to fix,
 * and a screen reader announces the field together with its error (linked to it by aria-describedby).
 */
export async function focusFirstInvalid(root) {
  await nextTick()
  root?.querySelector('[aria-invalid="true"]')?.focus()
}
