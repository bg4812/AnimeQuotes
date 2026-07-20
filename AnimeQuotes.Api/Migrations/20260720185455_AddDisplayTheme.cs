using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeQuotes.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDisplayTheme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Theme",
                table: "Displays",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Dark");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Theme",
                table: "Displays");
        }
    }
}
