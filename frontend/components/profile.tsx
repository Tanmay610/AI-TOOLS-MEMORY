import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { PageHeading } from "./shared";

export function Profile({
  onAdd,
  theme,
  toggleTheme,
}: {
  onAdd: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<Record<string, boolean>>({
    enrichment: true,
    notion: true,
    recap: true,
    vector: true,
  });

  useEffect(() => {
    const savedEnrichment = localStorage.getItem("setting-enrichment");
    const savedNotion = localStorage.getItem("setting-notion");
    const savedRecap = localStorage.getItem("setting-recap");
    const savedVector = localStorage.getItem("setting-vector");

    const timer = setTimeout(() => {
      setSettings({
        enrichment: savedEnrichment === null ? true : savedEnrichment === "true",
        notion: savedNotion === null ? true : savedNotion === "true",
        recap: savedRecap === null ? true : savedRecap === "true",
        vector: savedVector === null ? true : savedVector === "true",
      });
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: string) => {
    const nextVal = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: nextVal }));
    localStorage.setItem(`setting-${key}`, String(nextVal));
  };

  return (
    <section className="page profile-page">
      <PageHeading
        title="Workspace Settings"
        subtitle="Configure your personal AI memory system."
        onAdd={onAdd}
      />
      <article className="panel settings-card">
        <div className="profile-person">
          <span>TM</span>
          <div>
            <h2>Tanmay&apos;s Vault</h2>
            <p>Personal workspace - Pro plan</p>
          </div>
        </div>
        {[
          { label: "Automatic AI enrichment", key: "enrichment" },
          { label: "Notion learning notes sync", key: "notion" },
          { label: "Weekly memory recap", key: "recap" },
          { label: "Vector search indexing", key: "vector" },
        ].map(({ label, key }) => (
          <label className="setting" key={label}>
            {label}
            <input
              type="checkbox"
              checked={mounted ? settings[key] : true}
              onChange={() => mounted && handleToggle(key)}
            />
            <i />
          </label>
        ))}
        <label className="setting">
          Dark theme mode
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <i />
        </label>
        <button className="secondary-button" style={{ marginTop: "22px" }}>
          <Settings2 size={16} /> Manage integrations
        </button>
      </article>
    </section>
  );
}
