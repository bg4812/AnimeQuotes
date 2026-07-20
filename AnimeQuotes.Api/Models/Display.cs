using System.Runtime.CompilerServices;

namespace AnimeQuotes.Api.Models
{
    public class Display
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string AnimationStyle { get; set; } = "Floating";

        public string Speed { get; set; } = "Medium";

        public string Theme { get; set; } = "Dark";

        public List<DisplayTag> DisplayTags { get; set; } = new();
        public List<DisplayQuote> DisplayQuotes { get; set; } = new();
    }
}