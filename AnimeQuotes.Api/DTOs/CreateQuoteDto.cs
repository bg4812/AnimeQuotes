using AnimeQuotes.Api.Models;
using System.Runtime.CompilerServices;

namespace AnimeQuotes.Api.DTOs
{
    public class CreateQuoteDto
    {
        public string AnimeName { get; set; } = string.Empty;
        public string AnimeGenre { get; set; } = string.Empty;
        public string CharacterFirstName { get; set; } = string.Empty;
        public string CharacterLastName { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
    }
}