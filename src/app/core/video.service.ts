import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Video {
  id: number;
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private videos$ = new BehaviorSubject<Video[]>([]);

  constructor(private http: HttpClient) {
    console.log('VideoService: Инициализация сервиса. Загружаем видео...');
    this.loadVideos();
  }

  private loadVideos() {
    console.log('VideoService: Запрашиваем видео с сервера...');
    this.http.get<Video[]>('http://localhost:3000/videos').subscribe({
      next: (videos) => {
        console.log('VideoService: Видео успешно загружены:', videos);
        this.videos$.next(videos);
      },
      error: (err) => {
        console.error('VideoService: Ошибка при загрузке видео:', err);
      },
    });
  }

  getVideos(): Observable<Video[]> {
    console.log('VideoService: Подписка на список видео');
    return this.videos$.asObservable();
  }

  addVideo(video: Video): void {
    console.log('VideoService: Добавляем новое видео:', video);
    this.http.post<Video>('http://localhost:3000/videos', video).subscribe({
      next: (newVideo) => {
        const current = this.videos$.getValue();
        console.log('VideoService: Новое видео получено от сервера:', newVideo);
        this.videos$.next([...current, newVideo]);
        console.log('VideoService: Список видео обновлён с новым элементом');
      },
      error: (err) => {
        console.error('VideoService: Ошибка при добавлении видео:', err);
      },
    });
  }

  searchVideos(query: string): Observable<Video[]> {
    console.log(`VideoService: Выполняем поиск видео по запросу: "${query}"`);
    return this.getVideos().pipe(
      map((videos) => {
        const filtered = videos.filter((v) =>
          v.title.toLowerCase().includes(query.toLowerCase())
        );
        console.log(
          `VideoService: Найдено ${filtered.length} совпадений для запроса "${query}"`
        );
        return filtered;
      })
    );
  }
}
