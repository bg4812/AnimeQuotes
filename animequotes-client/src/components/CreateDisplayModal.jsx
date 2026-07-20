import { useEffect, useState } from "react";

function CreateDisplayModal({
  apiUrl,
  onClose,
  onDisplayCreated,
}) {
  const [name, setName] = useState("");
  const [animationStyle, setAnimationStyle] =
    useState("Floating");
  const [speed, setSpeed] = useState("Slow");

  const [creationMode, setCreationMode] = useState("blank");

  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTags() {
      try {
        const response = await fetch(`${apiUrl}/api/tags`);

        if (!response.ok) {
          throw new Error("Tags could not be loaded.");
        }

        const data = await response.json();
        setTags(data);
      } catch (error) {
        setError(error.message);
      }
    }

    loadTags();
  }, [apiUrl]);

  function toggleTag(tagId) {
    setSelectedTagIds((currentTagIds) => {
      if (currentTagIds.includes(tagId)) {
        return currentTagIds.filter(
          (currentTagId) => currentTagId !== tagId
        );
      }

      return [...currentTagIds, tagId];
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      creationMode === "template" &&
      selectedTagIds.length === 0
    ) {
      setError("Select at least one tag for the template.");
      return;
    }

    setIsCreating(true);

    try {
      const createResponse = await fetch(
        `${apiUrl}/api/displays`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            animationStyle,
            speed,
          }),
        }
      );

      if (!createResponse.ok) {
        throw new Error("Display could not be created.");
      }

      const createdDisplay = await createResponse.json();

      if (creationMode === "template") {
        const populateResponse = await fetch(
          `${apiUrl}/api/displays/${createdDisplay.id}/populate-from-tags`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tagIds: selectedTagIds,
            }),
          }
        );

        if (!populateResponse.ok) {
          throw new Error(
            "Display was created, but its template quotes could not be added."
          );
        }
      }

      await onDisplayCreated(createdDisplay);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div
      className="display-modal-overlay"
      onClick={onClose}
    >
      <section
        className="display-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="display-modal-header">
          <div>
            <h2>Create a display</h2>
            <p>Build it yourself or begin with a template.</p>
          </div>

          <button
            className="close-button"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form
          className="create-display-form"
          onSubmit={handleSubmit}
        >
          <label>
            Display name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="My Training Arc"
              required
            />
          </label>

          <fieldset className="creation-mode">
            <legend>Starting point</legend>

            <div className="creation-mode-options">
              <label
                className={
                  creationMode === "blank"
                    ? "mode-option selected"
                    : "mode-option"
                }
              >
                <input
                  type="radio"
                  name="creationMode"
                  value="blank"
                  checked={creationMode === "blank"}
                  onChange={() => setCreationMode("blank")}
                />

                <span>
                  <strong>Start from scratch</strong>
                  <small>Create an empty display.</small>
                </span>
              </label>

              <label
                className={
                  creationMode === "template"
                    ? "mode-option selected"
                    : "mode-option"
                }
              >
                <input
                  type="radio"
                  name="creationMode"
                  value="template"
                  checked={creationMode === "template"}
                  onChange={() => setCreationMode("template")}
                />

                <span>
                  <strong>Start from tags</strong>
                  <small>Add matching quotes automatically.</small>
                </span>
              </label>
            </div>
          </fieldset>

          {creationMode === "template" && (
            <fieldset className="tag-selector">
              <legend>Choose tags</legend>

              <div className="template-tags">
                {tags.map((tag) => {
                  const isSelected =
                    selectedTagIds.includes(tag.id);

                  return (
                    <label
                      className={
                        isSelected
                          ? "template-tag selected"
                          : "template-tag"
                      }
                      key={tag.id}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTag(tag.id)}
                      />

                      <span>{tag.name}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="display-setting-row">
            <label>
              Animation
              <select
                value={animationStyle}
                onChange={(event) =>
                  setAnimationStyle(event.target.value)
                }
              >
                <option value="Floating">Floating</option>
                <option value="Bouncing">Bouncing</option>
                <option value="Still">Still</option>
              </select>
            </label>

            <label>
              Speed
              <select
                value={speed}
                onChange={(event) =>
                  setSpeed(event.target.value)
                }
              >
                <option value="Slow">Slow</option>
                <option value="Medium">Medium</option>
                <option value="Fast">Fast</option>
              </select>
            </label>
          </div>

          {error && (
            <p className="create-display-error">{error}</p>
          )}

          <button
            className="create-display-submit"
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Display"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateDisplayModal;