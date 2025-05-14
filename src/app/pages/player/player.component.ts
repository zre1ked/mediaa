import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
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
    private videoService: VideoService,
    private cdr: ChangeDetectorRef
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Полученный ID из URL:', id);

    this.videoService.getVideos().subscribe({
      next: (videos) => {
        console.log('Полученные видео:', videos);
        const video = videos.find((v) => {
          return +v.id === +id;
        });

        if (video) {
          console.log('Видео найдено:', video);
          this.videoUrl = video.url;
          this.cdr.detectChanges();
        } else {
          console.warn(`Видео с ID ${id} не найдено`);
        }
      },
      error: (err) => {
        console.error('Ошибка при получении списка видео:', err);
      },
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
