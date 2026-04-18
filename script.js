// ==UserScript==
// @name         Reddit Base64 Decoder
// @match        https://www.reddit.com/*
// @grant        none
// ==/UserScript==

(function() {
    const base64Regex = /\b[A-Za-z0-9+/]{20,}={0,2}\b/g;

    function decodeBase64(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch {
            return null;
        }
    }

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const matches = node.nodeValue.match(base64Regex);
            if (matches) {
                matches.forEach(match => {
                    const decoded = decodeBase64(match);
                    if (decoded && decoded.length > 3) {
                        node.nodeValue += ` [decoded: ${decoded}]`;
                    }
                });
            }
        }
    }

    function scan(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            processNode(node);
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                scan(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    scan(document.body);
})();
