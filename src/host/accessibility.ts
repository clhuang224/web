const accessibilityAttributes = [
  'accessibility-role',
  'accessibility-label',
  'accessibility-selected',
  'accessibility-disabled',
  'accessibility-hidden',
]

/** Adapts declared Lynx semantics to browser accessibility and keyboard input. */
export function enableLynxAccessibility(view: HTMLElement): () => void {
  const root = view.shadowRoot
  if (!root) return () => undefined

  const focusStyle = document.createElement('style')
  focusStyle.textContent = `
    [role="link"]:focus-visible, [role="button"]:focus-visible {
      outline: 3px solid currentColor;
      outline-offset: 4px;
    }
  `
  root.append(focusStyle)

  function synchronize() {
    for (const element of root!.querySelectorAll<HTMLElement>(
      '[accessibility-role], [accessibility-label]',
    )) {
      const declaredRole = element.getAttribute('accessibility-role')
      const label = element.getAttribute('accessibility-label')
      const image =
        element.localName === 'x-image' ||
        element.getAttribute('lynx-tag') === 'image'
      const role =
        declaredRole === 'image'
          ? 'img'
          : declaredRole || (image && label ? 'img' : null)

      if (role) element.setAttribute('role', role)
      if (label !== null) element.setAttribute('aria-label', label)

      if (role === 'link' || role === 'button') {
        const disabled =
          element.getAttribute('accessibility-disabled') === 'true'
        element.tabIndex = disabled ? -1 : 0
        element.setAttribute('aria-disabled', String(disabled))
        if (label === null) {
          const text = element.textContent?.replace(/\s+/g, ' ').trim()
          if (text) element.setAttribute('aria-label', text)
        }

        const selected = element.getAttribute('accessibility-selected')
        if (role === 'link') {
          if (selected === 'true') element.setAttribute('aria-current', 'page')
          else element.removeAttribute('aria-current')
        } else if (selected !== null) {
          element.setAttribute('aria-pressed', String(selected === 'true'))
        } else {
          element.removeAttribute('aria-pressed')
        }
      }

      const hidden = element.getAttribute('accessibility-hidden')
      if (hidden !== null) element.setAttribute('aria-hidden', hidden)
    }
  }

  function activateFromKeyboard(event: Event) {
    if (!(event instanceof KeyboardEvent)) return
    const control = event
      .composedPath()
      .find(
        (target): target is HTMLElement =>
          target instanceof HTMLElement &&
          root!.contains(target) &&
          target.matches('[role="link"], [role="button"]'),
      )
    if (!control) return
    const activates =
      event.key === 'Enter' ||
      (event.key === ' ' && control.getAttribute('role') === 'button')
    if (!activates) return
    event.preventDefault()
    event.stopPropagation()
    if (event.repeat || control.getAttribute('aria-disabled') === 'true') return
    // Lynx for Web maps the DOM click event to its registered tap handler.
    control.click()
  }

  synchronize()
  const observer = new MutationObserver(synchronize)
  observer.observe(root, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: accessibilityAttributes,
  })
  root.addEventListener('keydown', activateFromKeyboard)

  return () => {
    observer.disconnect()
    root.removeEventListener('keydown', activateFromKeyboard)
    focusStyle.remove()
  }
}
