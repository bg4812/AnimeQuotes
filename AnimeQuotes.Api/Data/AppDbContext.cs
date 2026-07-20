using AnimeQuotes.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace AnimeQuotes.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Anime> Animes { get; set; } = null!;
        public DbSet<AnimeCharacter> AnimeCharacters { get; set; } = null!;
        public DbSet<Quote> Quotes { get; set; } = null!;
        public DbSet<QuoteTag> QuoteTags { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;
        public DbSet<Display> Displays { get; set; } = null!;
        public DbSet<DisplayTag> DisplayTags { get; set; } = null!;
        public DbSet<DisplayQuote> DisplayQuotes { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<QuoteTag>()
                .HasKey(qt => new { qt.QuoteId, qt.TagId });

            modelBuilder.Entity<DisplayTag>()
                .HasKey(dt => new { dt.DisplayId, dt.TagId });

            modelBuilder.Entity<DisplayQuote>()
                .HasKey(dq => new { dq.DisplayId, dq.QuoteId });

            modelBuilder.Entity<Display>()
                .Property(d => d.Theme)
                .HasMaxLength(20)
                .HasDefaultValue("Dark");
        }
    }

}
