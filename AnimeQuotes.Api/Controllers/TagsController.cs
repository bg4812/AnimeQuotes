using AnimeQuotes.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuotes.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TagsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var tags = _context.Tags
                .OrderBy(t => t.Name)
                .Select(t => new
                {
                    t.Id,
                    t.Name
                })
                .ToList();

            return Ok(tags);
        }
    }
}