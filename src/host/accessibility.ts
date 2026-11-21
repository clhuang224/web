const accessibilityAttributes = [
  'accessibility-role',
  'accessibility-label',
  'accessibility-selected',
  'accessibility-disabled',
  'accessibility-hidden',
  'accessibility-open',
  'accessibility-heading-level',
]

function setNativeAttribute(element: HTMLElement, name: string, value: string) {
  Element.prototype.setAttribute.call(element, name, value)
}

/** Adapts declared Lynx semantics to browser accessibility and keyboard input. */
export function enableLynxAccessibility(view: HTMLElement): () => void {
  const root = view.shadowRoot
  if (!root) return () => undefined

  const focusStyle = document.createElement('style')
  focusStyle.textContent = `
    [role="link"], [role="button"] {
      cursor: pointer;
    }
    [role="link"]:focus-visible, [role="button"]:focus-visible {
      outline: 3px solid currentColor;
      outline-offset: 4px;
    }
  `
  root.append(focusStyle)

  function synchronize() {
    for (const element of root!.querySelectorAll<HTMLElement>(
      '[accessibility-role], [accessibility-label], [accessibility-hidden]',
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

      if (role) setNativeAttribute(element, 'role', role)
      if (label !== null) setNativeAttribute(element, 'aria-label', label)

      if (role === 'link' || role === 'button') {
        const disabled =
          element.getAttribute('accessibility-disabled') === 'true'
        element.tabIndex = disabled ? -1 : 0
        setNativeAttribute(element, 'aria-disabled', String(disabled))
        if (label === null) {
          const text = element.textContent?.replace(/\s+/g, ' ').trim()
          if (text) setNativeAttribute(element, 'aria-label', text)
        }

        const selected = element.getAttribute('accessibility-selected')
        if (role === 'link') {
          if (selected === 'true')
            setNativeAttribute(element, 'aria-current', 'page')
          else element.removeAttribute('aria-current')
        } else if (selected !== null) {
          setNativeAttribute(
            element,
            'aria-pressed',
            String(selected === 'true'),
          )
        } else {
          element.removeAttribute('aria-pressed')
        }
      }

      const expanded = element.getAttribute('accessibility-open')
      if (expanded !== null)
        setNativeAttribute(
          element,
          'aria-expanded',
          String(expanded === 'open'),
        )

      const level = element.getAttribute('accessibility-heading-level')
      if (role === 'heading' && level !== null)
        setNativeAttribute(element, 'aria-level', level)

      const hidden = element.getAttribute('accessibility-hidden')
      if (hidden !== null) setNativeAttribute(element, 'aria-hidden', hidden)
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
