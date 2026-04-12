import { Component, AfterViewInit, ElementRef, ViewChild, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('parallaxBg') parallaxBg!: ElementRef;
  private api = inject(ApiService);
  baseUrl = window.location.origin.includes('localhost:4200') ? 'http://localhost:5274' : '';
  
  slides: any[] = [];
  currentSlide = 0;
  slideInterval: any;

  defaultSlides = [
    { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop', title: 'Bike Photo Shooting', subtitle: 'Experience the thrill through our lens' },
    { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop', title: 'Luxury Automotives', subtitle: 'Capturing automotive perfection' }
  ];

  ngOnInit() {
    this.loadSlides();
  }

  loadSlides() {
    this.api.get<any[]>('carousel').subscribe({
      next: (slides) => {
        if (slides && slides.length > 0) {
          this.slides = slides.map(s => ({
            url: this.baseUrl + s.imageUrl,
            title: s.title,
            subtitle: s.subtitle
          }));
        } else {
          this.slides = this.defaultSlides;
        }
        this.startSlider();
      },
      error: () => {
        this.slides = this.defaultSlides;
        this.startSlider();
      }
    });
  }

  ngAfterViewInit() {
  }
  
  startSlider() {
    if (this.slides.length <= 1) return;
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000); // 6 seconds per slide
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
    clearInterval(this.slideInterval);
    this.startSlider(); // reset timer
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.parallaxBg) {
      const scrollValue = window.scrollY;
      this.parallaxBg.nativeElement.style.transform = `translateY(${scrollValue * 0.4}px)`;
    }
  }
}
