import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public loadedPosts = [];
  public error = null;

  private errorSub: Subscription;
  private isFetching = false;

  constructor(private http: HttpClient, private postsService: PostsService) { }

  ngOnInit(): void {
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content).subscribe(posts => {
      console.log(posts);
    });
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts()
      .subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
        error => {
          this.error = error.message;
        });
  }

  onHandleError(): void {
    this.error = null;
  }

  onClearPosts() {
    this.postsService.deletePosts().subscribe(response => {
      this.loadedPosts = [];
    });
  }
}
