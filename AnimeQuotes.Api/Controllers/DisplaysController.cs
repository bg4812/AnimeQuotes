using AnimeQuotes.Api.Data;
using AnimeQuotes.Api.DTOs;
using AnimeQuotes.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuotes.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DisplaysController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DisplaysController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetDisplays()
        {
            var displays = _context.Displays.OrderBy(d => d.Id);
            return Ok(displays);
        }
        [HttpGet("{id}/quotes")]
        public IActionResult GetDisplayQuotes(int id)
        {
            var display = _context.Displays
                .FirstOrDefault(d => d.Id == id);

            if (display == null)
            {
                return NotFound("Display not found.");
            }

            var quotes = _context.DisplayQuotes
                .Where(dq => dq.DisplayId == id)
                .Select(dq => new
                {
                    dq.Quote.Id,
                    dq.Quote.Text,
                    dq.Quote.AnimeCharacter.FirstName,
                    dq.Quote.AnimeCharacter.MiddleName,
                    dq.Quote.AnimeCharacter.LastName,
                    dq.Quote.AnimeCharacter.Anime.Name
                })
                .ToList();
          

            return Ok(new
            {
                display.Id,
                display.Name,
                display.AnimationStyle,
                display.Speed,
                Quotes = quotes
            });
        }
        [HttpPost]
        public IActionResult Create(CreateDisplayDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Display name is required.");
            }

            var display = new Display
            {
                Name = request.Name,
                AnimationStyle = request.AnimationStyle,
                Speed = request.Speed,
                Theme = request.Theme
            };

            _context.Displays.Add(display);
            _context.SaveChanges();
            return Ok(display);
        }
        [HttpPost("{displayId}/quotes/{quoteId}")]
        public IActionResult AddQuoteToDisplay(int displayId, int quoteId)
        {
            var alreadyAdded = _context.DisplayQuotes
                .Any(dq => dq.DisplayId == displayId && dq.QuoteId == quoteId);

            if (alreadyAdded)
            {
                return BadRequest("Quote is already added to this display.");
            }
            var displayQuote = new DisplayQuote
            {
                DisplayId = displayId,
                QuoteId = quoteId
            };
            _context.DisplayQuotes.Add(displayQuote);
            _context.SaveChanges();
            return Ok("Quote added to display successfully.");
        }

        [HttpDelete("{displayId}/quotes/{quoteId}")]
        public IActionResult RemoveQuoteFromDisplay(int displayId, int quoteId)
        {
            var displayQuote = _context.DisplayQuotes
                .FirstOrDefault(dq => dq.DisplayId == displayId && dq.QuoteId == quoteId);
            if (displayQuote == null)
            {
                return NotFound("Quote not found in this display.");
            }
            _context.DisplayQuotes.Remove(displayQuote);
            _context.SaveChanges();
            return Ok("Quote removed from display successfully.");
        }

        [HttpPost("{displayId}/populate-from-tags")]
        public IActionResult PopulateFromTags(int displayId, PopulateDisplayFromTagsDto request)
        {
          
            var matchingQuoteIds = _context.QuoteTags
                .Where(qt => request.TagIds.Contains(qt.TagId))
                .Select(qt => qt.QuoteId)
                .Distinct()
                .ToList();
            var existingQuoteIds = _context.DisplayQuotes
                .Where(dq => dq.DisplayId == displayId)
                .Select(dq => dq.QuoteId)
                .ToHashSet();
            foreach (var quote in matchingQuoteIds)
            {
                if (!existingQuoteIds.Contains(quote))
                {
                    var displayQuote = new DisplayQuote
                    {
                        DisplayId = displayId,
                        QuoteId = quote
                    };
                    _context.DisplayQuotes.Add(displayQuote);
                }
            }
            _context.SaveChanges();
            return Ok();
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, UpdateDisplayDto request)
        {
            var display = _context.Displays.FirstOrDefault(d => d.Id == id);

            if (display == null)
            {
                return NotFound("Display not found.");
            }

            display.Name = request.Name;
            display.AnimationStyle = request.AnimationStyle;
            display.Speed = request.Speed;
            display.Theme = request.Theme;

            _context.SaveChanges();
            return Ok(new
            {
                display.Id,
                display.Name,
                display.AnimationStyle,
                display.Speed,
                display.Theme
            });
        }
    }
}