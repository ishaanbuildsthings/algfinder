// helps with scrolling on the FAQ page, accounting for the navbar, found from https://github.com/rafgraph/react-router-hash-link/issues/25
export default function scrollWithOffset(el) {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -95;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
}
