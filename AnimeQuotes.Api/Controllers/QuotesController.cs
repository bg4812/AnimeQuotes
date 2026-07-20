using AnimeQuotes.Api.Data;
using AnimeQuotes.Api.DTOs;
using AnimeQuotes.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
 

namespace AnimeQuotes.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuotesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult Get()
        {
            var quotesData = _context.Quotes
                .Select(q=>new 
                {
                    q.Id,
                    q.Text,
                    Anime=q.AnimeCharacter.Anime.Name,
                    q.AnimeCharacter.FirstName,
                    q.AnimeCharacter.MiddleName,
                    q.AnimeCharacter.LastName 
                   })
                .ToList();
            return Ok(quotesData);
        }
        
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var quote = _context.Quotes.FirstOrDefault(q=>q.Id==id);

            if (quote == null)
            {
                return NotFound();
            }
            return Ok(quote);
        }
        [HttpGet("tag/{tag}")]
        public IActionResult GetByTag(string tag)
        {
            var quote = _context.Quotes.Where(q => q.QuoteTags.Any(qt=>qt.Tag.Name==tag));

            if (quote == null)
            {
                return NotFound();
            }
            return Ok(quote);
        }
        [HttpGet("filter")]
        public IActionResult FilterByTags([FromQuery] List<string> tags)
        {
            if (tags == null || tags.Count == 0)
            {
                return BadRequest("At least one tag is required.");
            }

            var quotes = _context.Quotes
                .Where(q => q.QuoteTags.Any(qt => tags.Contains(qt.Tag.Name)))
                .Select(q => new
                 {           
                    q.Id,
                    q.Text,
           
                    Tags = q.QuoteTags.Select(qt => qt.Tag.Name).ToList()
                 })
        .ToList();

            return Ok(quotes);
        }
        [HttpGet("display")]
        public IActionResult GetDisplayQuotes([FromQuery] List<string>? tags)
        {
            var query = _context.Quotes.AsQueryable();

            if (tags != null && tags.Count > 0)
            {
                query = query.Where(q =>
                    q.QuoteTags.Any(qt => tags.Contains(qt.Tag.Name)));
            }

            var quotes = query
                .Select(q => new
                {
                    q.Id,
                    q.Text
                })
                .ToList();

            return Ok(quotes);
        }
        [HttpPost]
        public IActionResult Create(CreateQuoteDto request)
        {
            var anime = _context.Animes
                .FirstOrDefault(a => a.Name == request.AnimeName);

            if (anime == null)
            {
                anime = new Anime
                {
                    Name = request.AnimeName,
                    Genre = request.AnimeGenre
                };

                _context.Animes.Add(anime);
                _context.SaveChanges();
            }

            var character = _context.AnimeCharacters
                .FirstOrDefault(c =>
                    c.FirstName == request.CharacterFirstName && c.LastName == request.CharacterLastName &&
                    c.AnimeId == anime.Id);

            if (character == null)
            {
                character = new AnimeCharacter
                {
                    FirstName = request.CharacterFirstName,
                    LastName = request.CharacterLastName,
                    AnimeId = anime.Id
                };

                _context.AnimeCharacters.Add(character);
                _context.SaveChanges();
            }

            
            var quote = new Quote
            {
                Text = request.Text,
                AnimeCharacterId = character.Id
            };

            _context.Quotes.Add(quote);
            _context.SaveChanges();

            foreach (var tagName in request.Tags)
            {
                var tag = _context.Tags.FirstOrDefault(t => t.Name == tagName);

                if (tag == null)
                {
                    tag = new Tag { Name = tagName };
                    _context.Tags.Add(tag);
                    _context.SaveChanges();
                }
                var quoteTag = new QuoteTag
                {
                    QuoteId = quote.Id,
                    TagId = tag.Id
                };

                _context.QuoteTags.Add(quoteTag);
                _context.SaveChanges();
            }

            return Ok(new
            {
                quote.Id,
                quote.Text,
                quote.AnimeCharacterId,
                FirstName = character.FirstName,
                MiddleName = character.MiddleName,
                LastName = character.LastName,
                AnimeName = anime.Name,
                Tags = request.Tags
            });
        }
    }
}
