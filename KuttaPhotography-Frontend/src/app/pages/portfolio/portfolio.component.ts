import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {
  private api = inject(ApiService);
  filter: string = 'all';
  baseUrl = window.location.origin.includes('localhost:4200') ? 'http://localhost:5274' : '';
  
  portfolioItems: any[] = [];
  filteredItems: any[] = [];

  ngOnInit() {
    this.loadMedia();
  }

  loadMedia() {
    forkJoin({
      photos: this.api.get<any[]>('photos'),
      videos: this.api.get<any[]>('videos')
    }).subscribe(({ photos, videos }) => {
      const allPhotos = photos.map(p => ({ ...p, type: 'image', displayUrl: this.baseUrl + p.imageUrl, category: p.category?.name?.toLowerCase() }));
      const allVideos = videos.map(v => ({ ...v, type: 'video', displayUrl: this.baseUrl + v.videoUrl, category: v.category?.name?.toLowerCase() }));
      
      this.portfolioItems = [...allPhotos, ...allVideos];
      this.filteredItems = this.portfolioItems;
      this.initObserver();
    });
  }

  initObserver() {
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.gallery-item').forEach((el) => {
        observer.observe(el);
      });
    }, 100);
  }

  setFilter(f: string) {
    this.filter = f;
    if (f === 'all') {
      this.filteredItems = this.portfolioItems;
    } else {
      this.filteredItems = this.portfolioItems.filter(item => 
        item.category === f || (f === 'photo' && item.type === 'image') || (f === 'video' && item.type === 'video')
      );
    }
    
    // re-trigger animation
    setTimeout(() => {
      document.querySelectorAll('.gallery-item').forEach(el => el.classList.add('visible'));
    }, 50);
  }

  toggleVideo(video: HTMLVideoElement) {
    if (!video) return;
    if (video.paused) {
      video.play().catch(err => console.error('Error playing video:', err));
    } else {
      video.pause();
    }
  }
}
