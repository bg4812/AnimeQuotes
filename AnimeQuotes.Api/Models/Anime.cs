namespace AnimeQuotes.Api.Models
{
    public class Anime
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public List<AnimeCharacter> Characters { get; set; } = new();

    }
}
