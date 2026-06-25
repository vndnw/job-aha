"use client";

import { useEffect } from "react";

export default function BlurProvider() {
  useEffect(() => {
    // Function to traverse DOM tree and replace "ahamove" with a blurred element
    const walkAndBlur = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (/ahamove/i.test(text)) {
          const parent = node.parentNode;
          if (!parent) return;

          // Avoid infinite loops, scripts, styles, textareas, inputs, or already blurred elements
          if (
            parent.nodeName === 'SCRIPT' ||
            parent.nodeName === 'STYLE' ||
            parent.nodeName === 'TEXTAREA' ||
            parent.nodeName === 'INPUT' ||
            (parent.classList && parent.classList.contains('blurred-brand'))
          ) {
            return;
          }

          const regex = /(ahamove)/gi;
          const fragments = document.createDocumentFragment();
          let lastIndex = 0;
          let match;

          while ((match = regex.exec(text)) !== null) {
            // Text before the match
            if (match.index > lastIndex) {
              fragments.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            }

            // Blurred element
            const span = document.createElement('span');
            span.className = 'blurred-brand';
            span.textContent = match[0];
            fragments.appendChild(span);

            lastIndex = regex.lastIndex;
          }

          // Remaining text
          if (lastIndex < text.length) {
            fragments.appendChild(document.createTextNode(text.substring(lastIndex)));
          }

          // Replace text node with our fragment
          parent.replaceChild(fragments, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (tagName !== 'script' && tagName !== 'style' && tagName !== 'textarea' && tagName !== 'input') {
          // Walk children
          // Use Array.from because the childNodes list is live and will change as we modify text nodes
          Array.from(node.childNodes).forEach(walkAndBlur);
        }
      }
    };

    // Perform an initial scan of the entire body
    walkAndBlur(document.body);

    // Setup MutationObserver to watch for changes (dynamic loads, content changes, page navigation)
    const observer = new MutationObserver((mutations) => {
      // Disconnect observer temporarily to prevent infinite loop from modifications
      observer.disconnect();

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            walkAndBlur(node);
          });
        } else if (mutation.type === 'characterData') {
          const parent = mutation.target.parentNode;
          if (parent && /ahamove/i.test(mutation.target.nodeValue)) {
            walkAndBlur(parent);
          }
        }
      }

      // Re-observe
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
