(() => {
  "use strict";

  const GROUPS = [
    { label: "Page", keys: ["Canvas", "CanvasText"] },
    { label: "Controls", keys: ["ButtonFace", "ButtonText", "ButtonBorder"] },
    { label: "Fields", keys: ["Field", "FieldText"] },
    {
      label: "Selection",
      keys: ["Highlight", "HighlightText", "SelectedItem", "SelectedItemText"],
    },
    { label: "Links", keys: ["LinkText", "VisitedText", "ActiveText"] },
    { label: "Accent", keys: ["AccentColor", "AccentColorText"] },
    { label: "Marks", keys: ["Mark", "MarkText"] },
    { label: "Disabled", keys: ["GrayText"] },
  ];

  const COLUMNS = [
    { browser: "chrome", os: "macos" },
    { browser: "firefox", os: "macos" },
    { browser: "safari", os: "macos" },
    { browser: "chrome", os: "windows" },
    { browser: "firefox", os: "windows" },
  ];

  const OS_GROUPS = [
    { os: "macOS", count: 3 },
    { os: "Windows", count: 2 },
  ];

  const BROWSER_LABELS = { chrome: "Chrome", firefox: "Firefox", safari: "Safari" };
  const OS_LABELS = { macos: "macOS", windows: "Windows" };

  function el(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs)
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "colSpan" || k === "scope") e[k] = v;
        else if (k === "className") e.className = v;
        else e.setAttribute(k, v);
      }
    for (const c of children) {
      if (typeof c === "string") e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    }
    return e;
  }

  function renderMatrix(data, mode) {
    const container = document.getElementById("matrix");
    container.innerHTML = "";

    const table = el("table", { className: "matrix" });

    const thead = el("thead");

    const osRow = el("tr");
    osRow.appendChild(el("td", null));
    for (const g of OS_GROUPS) {
      osRow.appendChild(
        el("th", { colSpan: g.count, scope: "colgroup", className: "matrix-os-header" }, g.os),
      );
    }
    thead.appendChild(osRow);

    const browserRow = el("tr");
    browserRow.appendChild(el("td", null));
    for (const col of COLUMNS) {
      browserRow.appendChild(
        el("th", { scope: "col", className: "matrix-browser-header" }, col.browser),
      );
    }
    thead.appendChild(browserRow);
    table.appendChild(thead);

    for (const group of GROUPS) {
      const tbody = el("tbody");

      const groupRow = el("tr");
      groupRow.appendChild(
        el(
          "th",
          { colSpan: COLUMNS.length + 1, scope: "colgroup", className: "matrix-group-label" },
          group.label,
        ),
      );
      tbody.appendChild(groupRow);

      for (const colorName of group.keys) {
        const row = el("tr", { className: "matrix-row" });
        row.appendChild(el("th", { scope: "row", className: "matrix-row-label" }, colorName));

        for (const col of COLUMNS) {
          const key = `${col.browser}-${col.os}-${mode}`;
          const source = data[key];
          const value = source ? source[colorName] : undefined;

          if (!value || value === "--") {
            row.appendChild(el("td", { className: "matrix-cell unsupported" }, "--"));
          } else {
            const swatch = el("span", { className: "swatch", "aria-hidden": "true" });
            swatch.style.backgroundColor = value;
            const cellContent = el("span", { className: "swatch-cell" }, swatch, el("span", { className: "hex-value" }, value));
            row.appendChild(el("td", { className: "matrix-cell" }, cellContent));
          }
        }

        tbody.appendChild(row);
      }

      table.appendChild(tbody);
    }

    container.appendChild(table);
  }

  function fillColorRefs(data) {
    for (const span of document.querySelectorAll("[data-ref]")) {
      const ref = span.getAttribute("data-ref");
      const slash = ref.indexOf("/");
      const key = ref.substring(0, slash);
      const colorName = ref.substring(slash + 1);
      const source = data[key];
      const value = source ? source[colorName] : undefined;

      span.innerHTML = "";
      if (value) {
        span.appendChild(document.createTextNode(value));
      } else {
        span.appendChild(document.createTextNode("N/A"));
      }
    }
  }

  function fillCompareTables(data, mode) {
    for (const table of document.querySelectorAll("[data-compare]")) {
      const colorNames = table.getAttribute("data-compare").split(",");
      const tableMode = table.getAttribute("data-mode") || mode;

      table.innerHTML = "";
      table.classList.add("compare-table");

      if (colorNames.length > 1) {
        const thead = el("thead");
        const headerRow = el("tr");
        headerRow.appendChild(el("th", null));
        for (const name of colorNames) {
          headerRow.appendChild(el("th", null, name));
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
      }

      const tbody = el("tbody");
      for (const col of COLUMNS) {
        const key = `${col.browser}-${col.os}-${tableMode}`;
        const source = data[key];
        if (!source) continue;

        const row = el("tr");
        const label = `${BROWSER_LABELS[col.browser] || col.browser} / ${OS_LABELS[col.os] || col.os}`;
        row.appendChild(el("th", { scope: "row" }, label));

        for (const colorName of colorNames) {
          const value = source[colorName];
          row.appendChild(el("td", { className: value ? null : "color-na" }, value || "—"));
        }

        tbody.appendChild(row);
      }
      table.appendChild(tbody);
    }
  }

  // Inject swatches for bare hex values in notes prose and tables.
  // Runs once — notes are static and don't change with mode toggle.
  function fillNotesSwatches() {
    const hexRe = /^#[0-9a-fA-F]{6}$/;
    for (const code of document.querySelectorAll("#notes code")) {
      if (code.querySelector(".swatch")) continue;
      const text = code.textContent.trim();
      if (hexRe.test(text)) {
        const swatch = el("span", { className: "swatch", "aria-hidden": "true" });
        swatch.style.backgroundColor = text;
        code.insertBefore(swatch, code.firstChild);
      }
    }
  }

  function main() {
    const toggle = document.getElementById("mode-toggle");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    toggle.value = prefersDark ? "dark" : "light";

    function render() {
      const data = typeof DATA !== "undefined" ? DATA : {};
      document.documentElement.style.colorScheme = toggle.value;
      renderMatrix(data, toggle.value);
      fillColorRefs(data);
      fillCompareTables(data, toggle.value);
    }

    render();
    fillNotesSwatches();
    toggle.addEventListener("change", render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
