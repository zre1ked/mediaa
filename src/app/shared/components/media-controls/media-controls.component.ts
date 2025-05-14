import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-controls',
  standalone: true,
  templateUrl: './media-controls.component.html',
  styleUrls: ['./media-controls.component.scss'],
  imports: [CommonModule],
})
export class MediaControlsComponent {
  @Input() currentTime = 0;
  @Input() duration = 0;
  @Input() volume = 1;
  @Input() playbackRate = 1;
  @Input() isPaused = true;

  @Output() playPause = new EventEmitter<void>();
  @Output() seek = new EventEmitter<number>();
  @Output() volumeChange = new EventEmitter<number>();
  @Output() rateChange = new EventEmitter<number>();
  @Output() toggleFullscreen = new EventEmitter<void>();
  @Output() downloadVideo = new EventEmitter<void>();

  onSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    this.seek.emit(Number(input.value));
  }

  onVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volumeChange.emit(Number(input.value));
  }

  onRate(event: Event) {
    const input = event.target as HTMLInputElement;
    this.rateChange.emit(Number(input.value));
  }
}
