namespace AnimeQuotes.Api.Models
{
    public class QuoteTag
    {
        public int QuoteId { get; set; }
        public Quote Quote { get; set; } = null!;
        public int TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}
