using KuttaPhotography.Core.Entities;
using KuttaPhotography.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KuttaPhotography.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarouselController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CarouselController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarouselSlide>>> GetSlides()
        {
            return await _context.CarouselSlides.OrderBy(s => s.Order).ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CarouselSlide>> PostSlide([FromForm] string title, [FromForm] string subtitle, [FromForm] int order, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("No file uploaded");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "carousel");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var slide = new CarouselSlide
            {
                Title = title,
                Subtitle = subtitle,
                Order = order,
                ImageUrl = $"/uploads/carousel/{fileName}"
            };

            _context.CarouselSlides.Add(slide);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSlides", new { id = slide.Id }, slide);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSlide(int id)
        {
            var slide = await _context.CarouselSlides.FindAsync(id);
            if (slide == null) return NotFound();

            var filePath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), slide.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);

            _context.CarouselSlides.Remove(slide);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
