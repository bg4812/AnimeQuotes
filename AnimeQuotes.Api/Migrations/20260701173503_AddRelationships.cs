using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeQuotes.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Quotes_AnimeCharacterId",
                table: "Quotes",
                column: "AnimeCharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_AnimeCharacters_AnimeId",
                table: "AnimeCharacters",
                column: "AnimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeCharacters_Animes_AnimeId",
                table: "AnimeCharacters",
                column: "AnimeId",
                principalTable: "Animes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Quotes_AnimeCharacters_AnimeCharacterId",
                table: "Quotes",
                column: "AnimeCharacterId",
                principalTable: "AnimeCharacters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimeCharacters_Animes_AnimeId",
                table: "AnimeCharacters");

            migrationBuilder.DropForeignKey(
                name: "FK_Quotes_AnimeCharacters_AnimeCharacterId",
                table: "Quotes");

            migrationBuilder.DropIndex(
                name: "IX_Quotes_AnimeCharacterId",
                table: "Quotes");

            migrationBuilder.DropIndex(
                name: "IX_AnimeCharacters_AnimeId",
                table: "AnimeCharacters");
        }
    }
}
