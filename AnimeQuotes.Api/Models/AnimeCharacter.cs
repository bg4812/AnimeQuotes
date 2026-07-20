namespace AnimeQuotes.Api.Models
{
    public class AnimeCharacter
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = string.Empty;

        public int AnimeId { get; set; }
        public  Anime Anime { get; set; } = null!;
        public List<Quote> Quotes { get; set; } = new();

    }
}
