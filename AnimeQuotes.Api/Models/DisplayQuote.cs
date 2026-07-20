namespace AnimeQuotes.Api.Models
{
    public class DisplayQuote
    {
        public int DisplayId { get; set; }

        public Display Display { get; set; } = null!;

        public int QuoteId { get; set; }

        public Quote Quote { get; set; } = null!;
    }
}