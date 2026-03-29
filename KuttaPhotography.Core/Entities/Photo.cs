using System;

namespace KuttaPhotography.Core.Entities
{
    public class Photo
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
