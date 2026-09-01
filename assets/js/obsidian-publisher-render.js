/* obsidian-github-pages-publisher:v1 */
  (function () {
    "use strict";
  
    function renderMermaidBlocks() {
      if (!window.mermaid) return;
      var blocks = Array.prototype.slice.call(document.querySelectorAll("pre code.language-mermaid, pre code.lang-mermaid"));
      if (!blocks.length) return;
      var nodes = [];
      blocks.forEach(function (code, index) {
        var wrapper = document.createElement("div");
        wrapper.className = "mermaid";
        wrapper.setAttribute("data-processed", "false");
        wrapper.textContent = code.textContent;
        code.parentElement.replaceWith(wrapper);
        nodes.push(wrapper);
      });
      window.mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default" });
      window.mermaid.run({ nodes: nodes });
    }
  
    function loadMermaid() {
      if (window.mermaid) {
        renderMermaidBlocks();
        return;
      }
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@11.9.0/dist/mermaid.min.js";
      script.onload = renderMermaidBlocks;
      script.onerror = function () {
        document.documentElement.classList.add("mermaid-load-failed");
      };
      document.head.appendChild(script);
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadMermaid);
    } else {
      loadMermaid();
    }
  })();
  