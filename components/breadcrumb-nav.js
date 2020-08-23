import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

function NavItem(props) {
  if (props.stateOrder[props.state] > props.stateOrder[props.currentState]) {
    return
  }
  if (props.currentState == props.state) {
    return html`<li class="breadcrumb-item active" aria-current="page">${props.displayName}</li>`;
  }
  return html`
    <li class="breadcrumb-item">
      <a
        href="#"
        onclick=${e => props.setState(props.state)}
      >
        ${props.displayName}
      </a>
    </li>`;
}

export default function BreadCrumbNav(props) {
  const stateOrder = {}
  props.navItems.forEach((n,i) => stateOrder[n.value] = i);
  return html`
    <nav area-label="breadcrumb">
      <ol class="breadcrumb">
        ${props.navItems.map(item => html`
          <${NavItem}
            displayName=${item.displayName}
            state=${item.value}
            currentState=${props.currentState}
            setState=${props.setState}
            stateOrder=${stateOrder}
          />`
        )}
      </ol>
    </nav>`;
}
