namespace AnimeQuotes.Api.DTOs
{
    public class UpdateDisplayDto
    {
        public string Name { get; set; } = string.Empty;

        public string AnimationStyle { get; set; } = "Floating";

        public string Speed { get; set; } = "Medium";

        public string Theme { get; set; } = "Dark";

        //  public List<int> TagIds { get; set; } = new();
    }
}