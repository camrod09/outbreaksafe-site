(function () {
  "use strict";

  var filename = window.location.pathname.split("/").pop() || "index.html";
  var slug = filename.replace(/\.html$/i, "") || "index";
  var contentUrl = "/content/pages/" + slug + ".json";

  function byCmsId(id) {
    return document.querySelector('[data-cms-id="' + CSS.escape(id) + '"]');
  }

  function safeTextHtml(value) {
    var template = document.createElement("template");
    template.innerHTML = value;
    Array.prototype.slice.call(template.content.querySelectorAll("*")).forEach(function (element) {
      if (element.tagName === "BR") {
        Array.prototype.slice.call(element.attributes).forEach(function (attribute) {
          element.removeAttribute(attribute.name);
        });
      } else {
        element.replaceWith(document.createTextNode(element.textContent || ""));
      }
    });
    return template.innerHTML;
  }

  function applySplitWords(element, value) {
    var words = value.trim().split(/\s+/).filter(Boolean);
    var spans = Array.prototype.slice.call(element.querySelectorAll(":scope > .gsap_split_word"));
    if (!spans.length || !words.length) return;
    while (spans.length < words.length) {
      var clone = spans[spans.length - 1].cloneNode(false);
      clone.className = "gsap_split_word gsap_split_word" + (spans.length + 1);
      element.appendChild(document.createTextNode(" "));
      element.appendChild(clone);
      spans.push(clone);
    }
    spans.forEach(function (span, index) {
      if (index < words.length) {
        span.textContent = words[index];
        span.hidden = false;
      } else {
        span.hidden = true;
      }
    });
    element.setAttribute("aria-label", words.join(" "));
  }

  function applyContent(page) {
    if (page.seo) {
      if (page.seo.title) document.title = page.seo.title;
      var description = document.querySelector('meta[name="description"]');
      if (description && page.seo.description) description.content = page.seo.description;
    }

    (page.content || []).forEach(function (item) {
      var element = byCmsId(item.cmsId);
      if (!element || typeof item.html !== "string") return;
      if (item.mode === "splitWords") applySplitWords(element, item.html);
      else element.innerHTML = safeTextHtml(item.html);
    });

    (page.links || []).forEach(function (item) {
      var element = byCmsId(item.cmsId);
      if (element && typeof item.href === "string") element.setAttribute("href", item.href);
    });

    (page.images || []).forEach(function (item) {
      var element = byCmsId(item.cmsId);
      if (!element) return;
      if (typeof item.src === "string" && item.src) element.setAttribute("src", item.src);
      if (typeof item.alt === "string") element.setAttribute("alt", item.alt);
    });

    document.dispatchEvent(new CustomEvent("outbreaksafe:content-ready", { detail: page }));
  }

  fetch(contentUrl, { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Content request failed: " + response.status);
      return response.json();
    })
    .then(applyContent)
    .catch(function (error) {
      console.warn("Tina-managed content unavailable; using embedded page content.", error);
    });
})();
