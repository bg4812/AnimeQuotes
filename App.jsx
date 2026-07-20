import { useEffect, useState } from "react";
import "./App.css";
import CreateDisplayModal from "./components/CreateDisplayModal";
import DisplaySettingsModal from "./components/DisplaySettingsModal";

const API_URL = "https://localhost:7184";

const positions = [
  { left: "36%", top: "20%", width: "360px", rotation: "3deg" },
  { left: "8%", top: "15%", width: "260px", rotation: "-6deg" },
  { left: "68%", top: "12%", width: "280px", rotation: "5deg" },
  { left: "15%", top: "55%", width: "250px", rotation: "4deg" },
  { left: "48%", top: "60%", width: "270px", rotation: "-3deg" },
  { left: "73%", top: "55%", width: "260px", rotation: "3deg" },
  { left: "3%", top: "65%", width: "240px", rotation: "-4deg" },
  { left: "58%", top: "35%", width: "230px", rotation: "5deg" },
];

const colors = [
  "#38bdf8",
  "#c084fc",
  "#2dd4bf",
  "#fb7185",
  "#a3e635",
  "#fbbf24",
  "#f97316",
  "#818cf8",
];

async function getDisplay(displayId) {
  const response = await fetch(
    `${API_URL}/api/displays/${displayId}/quotes`
  );

  if (!response.ok) {
    throw new Error("Display could not be loaded.");
  }

  return response.json();
}
async function getDisplays() {
  const response = await fetch(`${API_URL}/api/displays`);

  if (!response.ok) {
    throw new Error("Displays could not be loaded.");
  }

  return response.json();
}

function getCharacterName(quote) {
  return [quote.firstName, quote.middleName, quote.lastName]
    .filter((namePart) => namePart?.trim())
    .join(" ");
}

function App() {
  const [display, setDisplay] = useState(null);
  const [error, setError] = useState("");

  const [allQuotes, setAllQuotes] = useState([]);
  const [showQuotePicker, setShowQuotePicker] = useState(false);
  const [quotePickerError, setQuotePickerError] = useState("");
  const [addingQuoteId, setAddingQuoteId] = useState(null);
  const [showCreateQuoteForm, setShowCreateQuoteForm] = useState(false);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

const [newQuote, setNewQuote] = useState({
  text: "",
  animeName: "",
  animeGenre: "",
  characterFirstName: "",
  characterLastName: "",
  tags: "",
});
const [deletingQuoteId, setDeletingQuoteId] = useState(null);
const [deleteError, setDeleteError] = useState("");
const [displays, setDisplays] = useState([]);
const [selectedDisplayId, setSelectedDisplayId] = useState(null);
const [showDisplaySettings, setShowDisplaySettings] =
  useState(false);
const [showCreateDisplay, setShowCreateDisplay] =
  useState(false);

  useEffect(() => {
  getDisplays()
    .then((data) => {
      setDisplays(data);

      if (data.length > 0) {
        setSelectedDisplayId(data[0].id);
      }
    })
    .catch((error) => setError(error.message));
}, []);

useEffect(() => {
  if (selectedDisplayId === null) {
    return;
  }

  setDisplay(null);

  getDisplay(selectedDisplayId)
    .then((data) => setDisplay(data))
    .catch((error) => setError(error.message));
}, [selectedDisplayId]);

  async function openQuotePicker() {
    setShowQuotePicker(true);
    setQuotePickerError("");

    try {
      const response = await fetch(`${API_URL}/api/quotes`);

      if (!response.ok) {
        throw new Error("Quotes could not be loaded.");
      }

      const quotes = await response.json();
      setAllQuotes(quotes);
    } catch (error) {
      setQuotePickerError(error.message);
    }
  }

  async function addQuoteToDisplay(quoteId) {
    setAddingQuoteId(quoteId);
    setQuotePickerError("");

    try {
      const response = await fetch(
        `${API_URL}/api/displays/${selectedDisplayId}/quotes/${quoteId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Quote could not be added.");
      }

     const updatedDisplay = await getDisplay(selectedDisplayId);
      setDisplay(updatedDisplay);
    } catch (error) {
      setQuotePickerError(error.message);
    } finally {
      setAddingQuoteId(null);
    }
  }
  async function deleteQuoteFromDisplay(quoteId) {
  setDeletingQuoteId(quoteId);
  setDeleteError("");

  try {
    const response = await fetch(
      `${API_URL}/api/displays/${selectedDisplayId}/quotes/${quoteId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Quote could not be removed from the display.");
    }

    setDisplay((currentDisplay) => ({
      ...currentDisplay,
      quotes: currentDisplay.quotes.filter(
        (quote) => quote.id !== quoteId
      ),
    }));
  } catch (error) {
    setDeleteError(error.message);
  } finally {
    setDeletingQuoteId(null);
  }
}
    function handleNewQuoteChange(event) {
    const { name, value } = event.target;

    setNewQuote((currentQuote) => ({
      ...currentQuote,
      [name]: value,
    }));
  }

  async function createQuote(event) {
    event.preventDefault();

    setIsCreatingQuote(true);
    setQuotePickerError("");

    const tags = newQuote.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      const createResponse = await fetch(`${API_URL}/api/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newQuote.text,
          animeName: newQuote.animeName,
          animeGenre: newQuote.animeGenre,
          characterFirstName: newQuote.characterFirstName,
          characterLastName: newQuote.characterLastName,
          tags: tags,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Quote could not be created.");
      }

      const createdQuote = await createResponse.json();

      const addResponse = await fetch(
        `${API_URL}/api/displays/${selectedDisplayId}/quotes/${createdQuote.id}`,
        {
          method: "POST",
        }
      );

      if (!addResponse.ok) {
        throw new Error(
          "The quote was created but could not be added to the display."
        );
      }

      const updatedDisplay = await getDisplay(selectedDisplayId);
      setDisplay(updatedDisplay);

      setNewQuote({
        text: "",
        animeName: "",
        animeGenre: "",
        characterFirstName: "",
        characterLastName: "",
        tags: "",
      });

      setShowCreateQuoteForm(false);
    } catch (error) {
      setQuotePickerError(error.message);
    } finally {
      setIsCreatingQuote(false);
    }
  }
  async function handleDisplayCreated(createdDisplay) {
  const updatedDisplays = await getDisplays();

  setDisplays(updatedDisplays);
  setSelectedDisplayId(createdDisplay.id);
  setShowCreateDisplay(false);
}
function handleDisplayUpdated(updatedDisplay) {
  setDisplay((currentDisplay) => ({
    ...currentDisplay,
    ...updatedDisplay,
  }));

  setDisplays((currentDisplays) =>
    currentDisplays.map((displayOption) =>
      displayOption.id === updatedDisplay.id
        ? {
            ...displayOption,
            ...updatedDisplay,
          }
        : displayOption
    )
  );

  setShowDisplaySettings(false);
}
  if (error) {
    return <p className="status-message">{error}</p>;
  }

  if (display === null) {
    return <p className="status-message">Loading display...</p>;
  }

  const displayQuoteIds = new Set(
    display.quotes.map((quote) => quote.id)
  );

  const availableQuotes = allQuotes.filter(
    (quote) => !displayQuoteIds.has(quote.id)
  );

  const baseDuration =
    display.speed === "Fast" ? 5 : display.speed === "Medium" ? 8 : 12;

  return (
    <main className="quote-stage">
  <header className="stage-header">
    <div className="stage-header-left">
      <div className="brand-block">
        <h1>AnimeQuotes</h1>
        <p>Your world. Your quotes.</p>
      </div>

      <div className="display-switcher">
        <label htmlFor="display-selector">
          Current display
        </label>

        <div className="display-select-wrapper">
          <select
            id="display-selector"
            className="display-selector"
            value={selectedDisplayId ?? ""}
            onChange={(event) =>
              setSelectedDisplayId(Number(event.target.value))
            }
          >
            {displays.map((displayOption) => (
              <option
                key={displayOption.id}
                value={displayOption.id}
              >
                {displayOption.name}
              </option>
            ))}
          </select>

          <span className="display-select-arrow">⌄</span>
        </div>
        <button
            className="new-display-button"
            type="button"
            onClick={() => setShowCreateDisplay(true)}
          >
            + New Display
        </button>
      </div>
    </div>

    <div className="stage-actions">
      <span className="quote-count">
        {display.quotes.length} quotes
      </span>

      <button
        className="add-quotes-button"
        type="button"
        onClick={openQuotePicker}
      >
        + Add Quotes
      </button>
      <button
  className="display-settings-button"
  type="button"
  onClick={() => setShowDisplaySettings(true)}
>
  ⚙ Settings
</button>
    </div>
  </header>

      <section className="quote-canvas">
        {display.quotes.map((quote, index) => {
          const position = positions[index % positions.length];
          const accentColor = colors[index % colors.length];

          return (
            <article
              className="quote-card"
              key={quote.id}
              style={{
                left: position.left,
                top: position.top,
                width: position.width,
                "--rotation": position.rotation,
                "--accent": accentColor,
                "--duration": `${baseDuration + (index % 3)}s`,
                "--delay": `${index * -1.5}s`,
              }}
            >
               <button
                  className="delete-quote-button"
                  type="button"
                  title="Remove from display"
                  aria-label={`Remove quote: ${quote.text}`}
                  onClick={() => deleteQuoteFromDisplay(quote.id)}
                  disabled={deletingQuoteId === quote.id}
                >
                    {deletingQuoteId === quote.id ? "..." : "×"}
                </button>
              <span className="quotation-mark">“</span>

              <p>{quote.text}</p>

              <small>
                {getCharacterName(quote) || "Unknown Character"}
              </small>
            </article>
          );
        })}
      </section>

      {showQuotePicker && (
        <div
          className="quote-picker-overlay"
          onClick={() => setShowQuotePicker(false)}
        >
          <section
            className="quote-picker"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="quote-picker-header">
              <div>
                <h2>Add Quotes</h2>
                <p>Select quotes to add to {display.name}.</p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={() => setShowQuotePicker(false)}
              >
                ×
              </button>
            </header>

            {quotePickerError && (
              <p className="picker-error">{quotePickerError}</p>
            )}
            <button
  className="create-quote-toggle"
  type="button"
  onClick={() =>
    setShowCreateQuoteForm((currentValue) => !currentValue)
  }
>
  {showCreateQuoteForm ? "Cancel" : "+ Create New Quote"}
</button>

{showCreateQuoteForm && (
  <form className="create-quote-form" onSubmit={createQuote}>
    <label>
      Quote
      <textarea
        name="text"
        value={newQuote.text}
        onChange={handleNewQuoteChange}
        required
      />
    </label>

    <div className="form-row">
      <label>
        Character first name
        <input
          name="characterFirstName"
          value={newQuote.characterFirstName}
          onChange={handleNewQuoteChange}
          required
        />
      </label>

      <label>
        Character last name
        <input
          name="characterLastName"
          value={newQuote.characterLastName}
          onChange={handleNewQuoteChange}
          required
        />
      </label>
    </div>

    <div className="form-row">
      <label>
        Anime
        <input
          name="animeName"
          value={newQuote.animeName}
          onChange={handleNewQuoteChange}
          required
        />
      </label>

      <label>
        Genre
        <input
          name="animeGenre"
          value={newQuote.animeGenre}
          onChange={handleNewQuoteChange}
          required
        />
      </label>
    </div>

    <label>
      Tags separated by commas
      <input
        name="tags"
        value={newQuote.tags}
        onChange={handleNewQuoteChange}
        placeholder="strength, motivation, discipline"
      />
    </label>

    <button
      className="submit-quote-button"
      type="submit"
      disabled={isCreatingQuote}
    >
      {isCreatingQuote ? "Creating..." : "Create and Add Quote"}
    </button>
  </form>
)}

            <div className="available-quotes">
              {availableQuotes.map((quote) => (
                <article className="available-quote" key={quote.id}>
                  <div>
                    <p>{quote.text}</p>

                    <small>
                      {getCharacterName(quote) || "Unknown Character"}
                    </small>
                  </div>

                  <button
                    type="button"
                    onClick={() => addQuoteToDisplay(quote.id)}
                    disabled={addingQuoteId === quote.id}
                  >
                    {addingQuoteId === quote.id ? "Adding..." : "Add"}
                  </button>
                </article>
              ))}

              {availableQuotes.length === 0 && !quotePickerError && (
                <p>There are no more quotes available to add.</p>
              )}
            </div>

          </section>
        </div>
      )}
      {showCreateDisplay && (
        <CreateDisplayModal
          apiUrl={API_URL}
          onClose={() => setShowCreateDisplay(false)}
          onDisplayCreated={handleDisplayCreated}
        />
      )}
      {showDisplaySettings && (
  <DisplaySettingsModal
    apiUrl={API_URL}
    display={display}
    onClose={() => setShowDisplaySettings(false)}
    onDisplayUpdated={handleDisplayUpdated}
  />
)}
    </main>
  );
}

export default App;