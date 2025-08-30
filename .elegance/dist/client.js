(() => {
  window.__name = (func) => func;
  console.log("Elegance.JS is loading..");
  if (!globalThis.pd) globalThis.pd = {};
  const domParser = new DOMParser();
  const xmlSerializer = new XMLSerializer();
  const pageStringCache = /* @__PURE__ */ new Map();
  const loc = window.location;
  const doc = document;
  let cleanupProcedures = [];
  const makeArray = Array.from;
  const sanitizePathname = (pn) => {
    if (!pn.endsWith("/") || pn === "/") return pn;
    return pn.slice(0, -1);
  };
  let currentPage = sanitizePathname(loc.pathname);
  const createStateManager = (subjects) => {
    const state = {
      subjects: subjects.map((subject) => {
        const s = {
          ...subject,
          observers: /* @__PURE__ */ new Map()
        };
        s.signal = () => {
          for (const observer of s.observers.values()) {
            try {
              observer(s.value);
            } catch (e) {
              console.error(e);
              continue;
            }
          }
        };
        return s;
      }),
      get: (id, bind) => {
        if (bind) {
          return pd[bind].get(id);
        }
        return state.subjects.find((s) => s.id === id);
      },
      getAll: (refs) => refs?.map((ref) => {
        if (ref.bind) {
          return pd[ref.bind].get(ref.id);
        }
        return state.get(ref.id);
      }),
      observe: (subject, observer, key) => {
        subject.observers.delete(key);
        subject.observers.set(key, observer);
      }
    };
    return state;
  };
  const loadPage = (deprecatedKeys = [], newBreakpoints) => {
    const fixedUrl = new URL(loc.href);
    fixedUrl.pathname = sanitizePathname(fixedUrl.pathname);
    const pathname = fixedUrl.pathname;
    history.replaceState(null, "", fixedUrl.href);
    let pageData = pd[pathname];
    if (pd === void 0) {
      console.error(`%cFailed to load! Missing page data!`, "font-size: 20px; font-weight: 600;");
      return;
    }
    ;
    console.info(`Loading ${pathname}. Page info follows:`, {
      "Deprecated Keys": deprecatedKeys,
      "New Breakpoints:": newBreakpoints || "(none, initial load)",
      "State": pageData.state,
      "OOA": pageData.ooa,
      "SOA": pageData.soa,
      "Load Hooks": pageData.lh
    });
    for (const [bind, subjects] of Object.entries(pageData.binds || {})) {
      if (!pd[bind]) {
        pd[bind] = createStateManager(subjects);
        continue;
      }
      const stateManager = pd[bind];
      const newSubjects = subjects;
      for (const subject of newSubjects) {
        if (stateManager.get(subject.id)) continue;
        pd[bind].subjects.push(subject);
      }
    }
    let state = pageData.stateManager;
    if (!state) {
      state = createStateManager(pageData.state || []);
      pageData.stateManager = state;
    }
    for (const subject of state.subjects) {
      subject.observers = /* @__PURE__ */ new Map();
    }
    for (const ooa of pageData.ooa || []) {
      const el = doc.querySelector(`[key="${ooa.key}"]`);
      let values = {};
      for (const { id, bind } of ooa.refs) {
        const subject = state.get(id, bind);
        values[subject.id] = subject.value;
        const updateFunction = (value) => {
          values[id] = value;
          try {
            const newValue = ooa.update(...Object.values(values));
            let attribute = ooa.attribute === "class" ? "className" : ooa.attribute;
            el[attribute] = newValue;
          } catch (e) {
            console.error(e);
            return;
          }
        };
        updateFunction(subject.value);
        try {
          state.observe(subject, updateFunction, ooa.key);
        } catch (e) {
          console.error(e);
          return;
        }
      }
    }
    for (const soa of pageData.soa || []) {
      const el = doc.querySelector(`[key="${soa.key}"]`);
      const subject = state.get(soa.id, soa.bind);
      if (typeof subject.value === "function") {
        try {
          el[soa.attribute] = (event) => subject.value(state, event);
        } catch (e) {
          console.error(e);
          return;
        }
      } else {
        el[soa.attribute] = subject.value;
      }
    }
    const loadHooks = pageData.lh;
    for (const loadHook of loadHooks || []) {
      const bind = loadHook.bind;
      if (bind !== void 0 && newBreakpoints && !newBreakpoints.includes(`${bind}`)) {
        continue;
      }
      const fn = loadHook.fn;
      try {
        let cleanupFunction;
        if (fn.constructor.name === "AsyncFunction") {
          const res = fn(state);
          res.then((cleanupFunction2) => {
            if (cleanupFunction2) {
              cleanupProcedures.push({
                cleanupFunction: cleanupFunction2,
                bind: `${bind}`
              });
            }
          });
        } else {
          cleanupFunction = fn(state);
          if (cleanupFunction) {
            cleanupProcedures.push({
              cleanupFunction,
              bind: `${bind}`
            });
          }
        }
      } catch (e) {
        console.error(e);
        return;
      }
    }
    pageStringCache.set(
      currentPage,
      xmlSerializer.serializeToString(doc)
    );
    console.info(
      `Loading finished, registered these cleanupProcedures`,
      cleanupProcedures
    );
  };
  const fetchPage = async (targetURL) => {
    const pathname = sanitizePathname(targetURL.pathname);
    if (pageStringCache.has(pathname)) {
      return domParser.parseFromString(pageStringCache.get(pathname), "text/html");
    }
    console.info(`Fetching ${pathname}`);
    const res = await fetch(targetURL);
    const newDOM = domParser.parseFromString(await res.text(), "text/html");
    const pageDataScript = newDOM.querySelector('script[data-tag="true"]');
    if (!pageDataScript) {
      return;
    }
    if (!pd[pathname]) {
      const { data } = await import(pageDataScript.src);
      pd[pathname] = data;
    }
    pageStringCache.set(pathname, xmlSerializer.serializeToString(newDOM));
    return newDOM;
  };
  const navigateLocally = async (target, pushState = true) => {
    const targetURL = new URL(target);
    const pathname = sanitizePathname(targetURL.pathname);
    console.log(
      `%c${currentPage} -> ${targetURL.pathname}`,
      "font-size: 18px; font-weight: 600; color: lightgreen;"
    );
    let newPage = await fetchPage(targetURL);
    if (!newPage) return;
    if (pathname === currentPage) return;
    const curBreaks = makeArray(doc.querySelectorAll("div[bp]"));
    const curBpTags = curBreaks.map((bp) => bp.getAttribute("bp"));
    const newBreaks = makeArray(newPage.querySelectorAll("div[bp]"));
    const newBpTags = newBreaks.map((bp) => bp.getAttribute("bp"));
    const latestMatchingBreakpoints = (arr1, arr2) => {
      let i = 0;
      const len = Math.min(arr1.length, arr2.length);
      while (i < len && arr1[i].getAttribute("bp") === arr2[i].getAttribute("bp")) i++;
      return i > 0 ? [arr1[i - 1], arr2[i - 1]] : [document.body, newPage.body];
    };
    const [oldPageLatest, newPageLatest] = latestMatchingBreakpoints(curBreaks, newBreaks);
    const deprecatedKeys = [];
    const breakpointKey = oldPageLatest.getAttribute("key");
    const getDeprecatedKeysRecursively = (element) => {
      const key = element.getAttribute("key");
      if (key) {
        deprecatedKeys.push(key);
      }
      if (key === breakpointKey || !breakpointKey) return;
      for (const child of makeArray(element.children)) {
        getDeprecatedKeysRecursively(child);
      }
    };
    getDeprecatedKeysRecursively(doc.body);
    const deprecatedBreakpoints = curBpTags.filter(
      (item) => !newBpTags.includes(item)
    );
    const newBreakpoints = newBpTags.filter(
      (item) => !curBpTags.includes(item)
    );
    for (const cleanupProcedure of [...cleanupProcedures]) {
      const bind = cleanupProcedure.bind;
      if (bind.length < 1 || deprecatedBreakpoints.includes(bind)) {
        try {
          cleanupProcedure.cleanupFunction();
        } catch (e) {
          console.error(e);
          return;
        }
        cleanupProcedures.splice(cleanupProcedures.indexOf(cleanupProcedure), 1);
      }
    }
    oldPageLatest.replaceWith(newPageLatest);
    doc.head.replaceWith(newPage.head);
    if (pushState) history.pushState(null, "", targetURL.href);
    currentPage = pathname;
    if (targetURL.hash) {
      doc.getElementById(targetURL.hash.slice(1))?.scrollIntoView();
    }
    loadPage(deprecatedKeys, newBreakpoints);
  };
  window.onpopstate = async (event) => {
    event.preventDefault();
    const target = event.target;
    await navigateLocally(target.location.href, false);
    history.replaceState(null, "", target.location.href);
  };
  globalThis.client = {
    navigateLocally,
    fetchPage,
    currentPage,
    sanitizePathname,
    getReference: (id) => document.querySelector(`[ref="${id}"]`)
  };
  try {
    loadPage();
  } catch (e) {
    console.error(e);
  }
  const watchServerPort = 3001;
  const eventSource = new EventSource(`http://localhost:${watchServerPort}/events`);
  eventSource.onmessage = async (event) => {
    console.log(`hot-reload, command received: ${event.data}`);
    if (event.data === "reload") {
      for (const cleanupProcedure of cleanupProcedures) {
        cleanupProcedure.cleanupFunction();
      }
      cleanupProcedures = [];
      pd[sanitizePathname(loc.pathname)].stateManager.subjects.map((subj) => ({ ...subj, observers: [] }));
      const newHTML = await fetch(window.location.href);
      const newDOM = domParser.parseFromString(
        await newHTML.text(),
        "text/html"
      );
      document.body.replaceWith(newDOM.body);
      document.head.replaceWith(newDOM.head);
      const link = document.querySelector("[rel=stylesheet]");
      if (!link) return;
      const href = link.getAttribute("href");
      link.setAttribute("href", href.split("?")[0] + "?" + (/* @__PURE__ */ new Date()).getTime());
      loadPage();
    } else if (event.data === "hard-reload") {
      window.location.reload();
    }
  };
})();
