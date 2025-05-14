import { Pipe, PipeTransform } from '@angular/core';
import { Video } from '../../core/video.service';

@Pipe({ standalone: true, name: 'search' })
export class SearchPipe implements PipeTransform {
  transform(videos: Video[], searchText: string): Video[] {
    if (!videos || !searchText) return videos;
    return videos.filter((v) =>
      v.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
