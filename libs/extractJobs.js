const TARGET_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "li",
  "strong",
  "b",
  "span",
  "em",
  "i",
  "div",
];

function getDirectTextNodes(el) {
  return Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    .map((n) => ({ tag: "text", text: n.textContent.trim() }));
}

function processElement(el, output) {
  const tag = el.tagName.toLowerCase();
  const directTextNodes = getDirectTextNodes(el);
  const childElements = Array.from(el.childNodes).filter(
    (n) =>
      n.nodeType === Node.ELEMENT_NODE &&
      TARGET_TAGS.includes(n.tagName.toLowerCase())
  );

  // --- handle list items as grouped blocks ---
  if (tag === "li") {
    const parentList = el.closest("ul,ol");
    if (parentList) {
      if (
        !output._currentList ||
        output._currentList.tag !== parentList.tagName.toLowerCase()
      ) {
        if (output._currentList) output.elements.push(output._currentList);
        output._currentList = {
          tag: parentList.tagName.toLowerCase(),
          items: [],
        };
      }
      output._currentList.items.push(el.innerText.trim());
      return;
    }
  }

  // flush current list when hitting a non-li element
  if (output._currentList) {
    output.elements.push(output._currentList);
    output._currentList = null;
  }

  // --- special handling for elements with mixed content ---
  if (directTextNodes.length > 0 && childElements.length > 0 && tag !== "div") {
    // build parts array (preserve order of text + children)
    const parts = [];
    el.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        parts.push({ tag: "text", text: n.textContent.trim() });
      } else if (
        n.nodeType === Node.ELEMENT_NODE &&
        TARGET_TAGS.includes(n.tagName.toLowerCase())
      ) {
        const childDirect = getDirectTextNodes(n);
        if (childDirect.length > 0) {
          parts.push({
            tag: n.tagName.toLowerCase(),
            text: childDirect.map((c) => c.text).join(" "),
          });
        }
      }
    });

    if (parts.length > 0) {
      output.elements.push({ tag, parts });
    }
    return;
  }

  // --- simple case: direct text only (or div with direct text) ---
  if (directTextNodes.length > 0 && tag !== "div") {
    output.elements.push({
      tag,
      text: directTextNodes.map((c) => c.text).join(" "),
    });
  } else {
    // no direct text → flatten children
    el.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        output.elements.push({ tag: "text", text: n.textContent.trim() });
      } else if (
        n.nodeType === Node.ELEMENT_NODE &&
        TARGET_TAGS.includes(n.tagName.toLowerCase())
      ) {
        processElement(n, output);
      }
    });
  }
}

function collectFlat() {
  const output = { elements: [], _currentList: null };

  document.body
    .querySelectorAll(TARGET_TAGS.join(","))
    .forEach((el) => processElement(el, output));

  if (output._currentList) output.elements.push(output._currentList);

  return output.elements;
}

export function extractJobPosting() {
  return {
    url: window.location.href,
    elements: collectFlat(),
  };
}
