import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService } from '../../core/video.service';
import { MediaControlsComponent } from '../../shared/components/media-controls/media-controls.component';

@Component({
  standalone: true,
  selector: 'app-player',
  imports: [CommonModule, MediaControlsComponent, RouterLink],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  videoUrl = '';
  currentTime = 0;
  duration = 0;
  volume = 1;
  playbackRate = 1;
  isPaused = true;
  showControls = true;
  private hideControlsTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.videoService.getVideos().subscribe((videos) => {
      const video = videos.find((v) => v.id === id);
      if (video) this.videoUrl = video.url;
      console.log('Видео URL:', this.videoUrl);
    });
  }

  onUserActivity() {
    this.showControls = true;
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
    }
    this.hideControlsTimeout = setTimeout(() => {
      this.showControls = false;
    }, 4000);
  }

  playPause() {
    const video = this.videoElement.nativeElement;
    if (video.paused) {
      video.play().catch((err) => {
        console.error('Ошибка воспроизведения:', err);
      });
      this.isPaused = false;
    } else {
      video.pause();
      this.isPaused = true;
    }
  }

  seek(position: number) {
    this.videoElement.nativeElement.currentTime = position;
  }

  changeVolume(volume: number) {
    this.videoElement.nativeElement.volume = volume;
    this.volume = volume;
  }

  changeRate(rate: number) {
    this.videoElement.nativeElement.playbackRate = rate;
    this.playbackRate = rate;
  }

  toggleFullscreen() {
    const video = this.videoElement.nativeElement;
    if (video.requestFullscreen) video.requestFullscreen();
  }

  downloadVideo() {
    const a = document.createElement('a');
    a.href = this.videoUrl;
    a.download = 'video';
    a.click();
  }

  onTimeUpdate() {
    const video = this.videoElement.nativeElement;
    this.currentTime = video.currentTime;
    this.duration = video.duration;
  }
}
