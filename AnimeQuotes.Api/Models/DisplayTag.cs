namespace AnimeQuotes.Api.Models
{
    public class DisplayTag
    {
        public int DisplayId { get; set; }

        public Display Display { get; set; } = null!;

        public int TagId { get; set; }

        public Tag Tag { get; set; } = null!;
    }
}