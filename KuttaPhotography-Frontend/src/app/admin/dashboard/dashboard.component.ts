import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  activeTab: 'photos' | 'videos' | 'contacts' = 'photos';
  baseUrl = window.location.origin.includes('localhost:4200') ? 'http://localhost:5274' : '';
  
  photos: any[] = [];
  videos: any[] = [];
  contacts: any[] = [];
  categories: any[] = [];

  photoForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categoryId: ['', Validators.required],
    file: [null as File | null, Validators.required]
  });

  videoForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categoryId: ['', Validators.required],
    file: [null as File | null, Validators.required]
  });

  uploading = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.get<any[]>('photos').subscribe(data => this.photos = data);
    this.api.get<any[]>('videos').subscribe(data => this.videos = data);
    this.api.get<any[]>('contacts').subscribe(data => this.contacts = data);
    this.api.get<any[]>('categories').subscribe(data => this.categories = data);
  }

  setTab(tab: 'photos' | 'videos' | 'contacts') {
    this.activeTab = tab;
  }

  onFileChange(event: any, type: 'photo' | 'video') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'photo') {
        this.photoForm.patchValue({ file: file });
      } else {
        this.videoForm.patchValue({ file: file });
      }
    }
  }

  uploadPhoto() {
    if (this.photoForm.valid) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('title', this.photoForm.value.title!);
      formData.append('description', this.photoForm.value.description || '');
      formData.append('categoryId', this.photoForm.value.categoryId!.toString());
      formData.append('file', this.photoForm.value.file!);

      this.api.post('photos', formData).subscribe({
        next: () => {
          this.uploading = false;
          this.photoForm.reset();
          this.loadData();
        },
        error: () => this.uploading = false
      });
    }
  }

  uploadVideo() {
    if (this.videoForm.valid) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('title', this.videoForm.value.title!);
      formData.append('description', this.videoForm.value.description || '');
      formData.append('categoryId', this.videoForm.value.categoryId!.toString());
      formData.append('file', this.videoForm.value.file!);

      this.api.post('videos', formData).subscribe({
        next: () => {
          this.uploading = false;
          this.videoForm.reset();
          this.loadData();
        },
        error: () => this.uploading = false
      });
    }
  }

  deletePhoto(id: number) {
    if (confirm('Delete this photo?')) {
      this.api.delete(`photos/${id}`).subscribe(() => this.loadData());
    }
  }

  deleteVideo(id: number) {
    if (confirm('Delete this video?')) {
      this.api.delete(`videos/${id}`).subscribe(() => this.loadData());
    }
  }

  deleteContact(id: number) {
    if (confirm('Delete this message?')) {
      this.api.delete(`contacts/${id}`).subscribe(() => this.loadData());
    }
  }

  logout() {
    this.auth.logout();
  }
}
