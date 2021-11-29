import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, retry, throwError } from "rxjs";
import { Post } from "./models/Post";

@Injectable({
  providedIn: "root",
})
export class PracticeService {
  api = "http://localhost:3000";

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  options = { headers: this.headers };

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http
      .get<Post[]>(this.api + "/posts")
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * were passing json. and a post body.
   */
  addPost(post) {
    const options = { headers: this.options };
    return this.http
      .post<Post>(this.api + "/posts", post, this.options)
      .pipe(catchError(this.handleError));
  }

  /**
   * return type of this method is Observable<Post>
   * return type of http.put is <Post>
   * observable returned is a cold recipe. subscribe to trigger
   */
  updatePost(postId, post) {
    const url = this.api + "/posts/" + postId;
    return this.http
      .put(url, post, this.options)
      .pipe(catchError(this.handleError));
  }

  searchPosts(keyword): Observable<Post[]> {
    const path = "/posts";
    const query = "?q=" + keyword;

    return this.http
      .get<Post[]>(this.api + path + query)
      .pipe(catchError(this.handleError));
  }

  getPaginatedPosts(page) {
    const params = new HttpParams().set("_page", page);
    const options = { params: params };
    return this.http
      .get<Post[]>(this.api + "/posts", options)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error("client side or network error: ", error.error);
      return throwError("client side or network error");
    } else {
      console.error(
        `Backend returned code ${error.status} body was ${error.error}`
      );
      return throwError("Backend returned an error.");
    }
  }
}
