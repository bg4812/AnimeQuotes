namespace AnimeQuotes.Api.Models
{
    public class Quote
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int AnimeCharacterId { get; set; }
        public AnimeCharacter AnimeCharacter { get; set; } = null!;

        public  List<QuoteTag> QuoteTags { get; set; } = new();
        public List<DisplayQuote> DisplayQuotes { get; set; } = new();
    }
}
