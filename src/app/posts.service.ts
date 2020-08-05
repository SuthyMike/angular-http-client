import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  public error = new Subject<string>();


  constructor(private http: HttpClient) { }

  public createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };

    return this.http
      .post<{ name: string }>(
        'https://angular-guide-http-3a13311.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response'
        }
      );
  }

  public fetchPosts() {
    let params: HttpParams = new HttpParams();
    params = params.append('print', 'pretty');
    params = params.append('custom', 'my custom param');

    const options = {
      headers: new HttpHeaders({ Auth: 'Auth Token' }),
      params
    };
    return this.http.get<{ [key: string]: Post }>('https://angular-guide-http-3a13311.firebaseio.com/posts.json',
      options
    )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorResponse => {
          return throwError(errorResponse);
        })
      );
  }

  public deletePosts() {
    return this.http.delete(
      'https://angular-guide-http-3a13311.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text'
      }
    ).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      })
    );
  }
}
