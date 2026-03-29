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
    { url: 'https://images.unsplash.com/photo-1542051812871-7575058aa0eb?q=80&w=1200&auto=format&fit=crop', title: 'Capturing Moments', subtitle: 'Cinematic Photography & Videography' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', title: 'Eternal Romance', subtitle: 'Award-winning Wedding Narratives' }
  ];

  ngOnInit() {
    this.loadSlides();
  }

  loadSlides() {
    this.api.get<any[]>('photos').subscribe({
      next: (photos) => {
        if (photos && photos.length > 0) {
          this.slides = photos.slice(0, 3).map(p => ({
            url: this.baseUrl + p.imageUrl,
            title: p.title,
            subtitle: p.description
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
