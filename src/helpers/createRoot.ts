import * as ReactDOM from 'react-dom'
import * as React from 'react'

/* istanbul ignore next */
function createLegacyRoot(container: Element): ReactDOM.Root {
  return {
    render(element: React.ReactElement) {
      ReactDOM.render(element, container)
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container)
    }
  }
}

/* istanbul ignore next */
export function createRoot(container: Element) {
  return (ReactDOM.createRoot ? ReactDOM.createRoot : createLegacyRoot)(container)
}

/* istanbul ignore next */
export function hydrateLegacyRoot(container: Element, element: React.ReactElement): ReactDOM.Root {
  ReactDOM.hydrate(element, container)
  return createLegacyRoot(container)
}

/* istanbul ignore next */
export function hydrateRoot(container: Element, element: React.ReactElement) {
  return (ReactDOM.hydrateRoot ? ReactDOM.hydrateRoot : hydrateLegacyRoot)(container, element)
}
