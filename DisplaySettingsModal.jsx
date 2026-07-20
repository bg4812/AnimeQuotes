import { useState } from "react";
import "./DisplaySettingsModal.css";

function DisplaySettingsModal({
  apiUrl,
  display,
  onClose,
  onDisplayUpdated,
}) {
  const [settings, setSettings] = useState({
    name: display.name,
    animationStyle: display.animationStyle,
    speed: display.speed,
    theme: display.theme ?? "Dark",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/api/displays/${display.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Display settings could not be saved."
        );
      }

      const updatedDisplay = await response.json();

      onDisplayUpdated(updatedDisplay);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="display-settings-overlay"
      onClick={onClose}
    >
      <section
        className="display-settings-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="display-settings-header">
          <div>
            <h2>Display Settings</h2>
            <p>Customize how this display looks and moves.</p>
          </div>

          <button
            className="settings-close-button"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form
          className="display-settings-form"
          onSubmit={handleSubmit}
        >
          <label>
            Display name
            <input
              name="name"
              value={settings.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Animation
            <select
              name="animationStyle"
              value={settings.animationStyle}
              onChange={handleChange}
            >
              <option value="Floating">Floating</option>
              <option value="Bouncing">Bouncing</option>
              <option value="Still">Still</option>
            </select>
          </label>

          <label>
            Speed
            <select
              name="speed"
              value={settings.speed}
              onChange={handleChange}
            >
              <option value="Slow">Slow</option>
              <option value="Medium">Medium</option>
              <option value="Fast">Fast</option>
            </select>
          </label>

          <fieldset className="theme-options">
            <legend>Theme</legend>

            <div className="theme-option-grid">
              <label
                className={
                  settings.theme === "Dark"
                    ? "theme-option selected"
                    : "theme-option"
                }
              >
                <input
                  type="radio"
                  name="theme"
                  value="Dark"
                  checked={settings.theme === "Dark"}
                  onChange={handleChange}
                />

                <span className="dark-preview" />
                <strong>Dark</strong>
              </label>

              <label
                className={
                  settings.theme === "Light"
                    ? "theme-option selected"
                    : "theme-option"
                }
              >
                <input
                  type="radio"
                  name="theme"
                  value="Light"
                  checked={settings.theme === "Light"}
                  onChange={handleChange}
                />

                <span className="light-preview" />
                <strong>Light</strong>
              </label>
            </div>
          </fieldset>

          {error && (
            <p className="display-settings-error">{error}</p>
          )}

          <div className="display-settings-actions">
            <button
              className="settings-cancel-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="settings-save-button"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default DisplaySettingsModal;