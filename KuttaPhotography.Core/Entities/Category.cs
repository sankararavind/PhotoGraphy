using System;
using System.Collections.Generic;

namespace KuttaPhotography.Core.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<Photo>? Photos { get; set; }
        public ICollection<Video>? Videos { get; set; }
    }
}
