// Saving work in this browser with localStorage.
// - The current code is saved automatically as a draft, so a refresh doesn't lose it.
// - Projects can also be saved by name and opened later.
// The storage object is passed in, so tests can use a simple in-memory fake.

const DRAFT = 'lce:draft';
const SAVED = 'lce:saved';

/** localStorage can be missing or blocked (private windows, strict settings), so every access is guarded. */
export function safeStorage(store = globalThis.localStorage) {
  return {
    get(key) { try { return JSON.parse(store.getItem(key)); } catch { return null; } },
    set(key, value) { try { store.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
  };
}

export class Projects {
  constructor(store) {
    this.store = safeStorage(store);
  }

  saveDraft(project) { return this.store.set(DRAFT, project); }
  draft() { return this.store.get(DRAFT); }

  /** Saved projects, newest first: [{ name, savedAt, html, css, js }] */
  list() {
    const all = this.store.get(SAVED);
    return Array.isArray(all) ? all.slice().sort((a, b) => b.savedAt - a.savedAt) : [];
  }

  /** Saves under a name; saving with the same name again replaces the old copy. */
  save(name, { html, css, js }, now = Date.now()) {
    const clean = String(name).trim().slice(0, 60);
    if (!clean) throw new Error('Give the project a name.');
    const others = this.list().filter((p) => p.name.toLowerCase() !== clean.toLowerCase());
    const ok = this.store.set(SAVED, [{ name: clean, savedAt: now, html, css, js }, ...others]);
    if (!ok) throw new Error('This browser is blocking storage, so the project could not be saved. Try Share instead.');
    return clean;
  }

  open(name) { return this.list().find((p) => p.name === name) ?? null; }

  remove(name) { this.store.set(SAVED, this.list().filter((p) => p.name !== name)); }
}

/** A name to suggest when saving: the first heading or <title> in the HTML. */
export function suggestName(html) {
  const m = /<(title|h1)[^>]*>([^<]{1,60})</i.exec(html);
  return m ? m[2].trim() : 'Untitled';
}
