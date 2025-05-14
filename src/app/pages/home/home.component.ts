import { Component } from '@angular/core';
import { VideoService, Video } from '../../core/video.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  videos: Video[] = [];
  searchQuery = '';
  form: FormGroup;

  constructor(private videoService: VideoService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: '',
      url: '',
    });

    this.videoService.getVideos().subscribe((videos) => {
      this.videos = videos;
    });
  }

  addVideo() {
    if (this.form.valid) {
      const newVideo: Video = {
        id: Date.now(),
        title: this.form.value.title,
        url: this.form.value.url,
      };
      this.videoService.addVideo(newVideo);
      this.form.reset();
    }
  }

  get filteredVideos() {
    if (!this.searchQuery) return this.videos;
    return this.videos.filter((video) =>
      video.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
