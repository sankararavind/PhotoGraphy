namespace KuttaPhotography.Core.Entities
{
    public class CarouselSlide
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
