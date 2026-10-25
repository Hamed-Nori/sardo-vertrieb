import { THEME_STORAGE_KEY } from "@/lib/theme";

// Läuft vor dem ersten Rendern im <head>: gespeicherte Wahl anwenden, sonst Systemeinstellung.
// Ohne JavaScript greift allein prefers-color-scheme in tokens.css.
const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
