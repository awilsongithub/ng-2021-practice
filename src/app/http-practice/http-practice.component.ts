import { PracticeService } from "./../practice.service";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder } from "@angular/forms";
import { debounce, filter, tap, timer } from "rxjs";

@Component({
  selector: "app-http-practice",
  templateUrl: "./http-practice.component.html",
  styleUrls: ["./http-practice.component.css"],
})
export class HttpPracticeComponent implements OnInit {
  posts: any;
  searchForm = this.formBuilder.group({
    keyword: "",
  });

  constructor(
    private practiceService: PracticeService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addSearchCallback();
  }

  addSearchCallback() {
    this.searchForm
      .get("keyword")
      ?.valueChanges.pipe(
        debounce(() => timer(300)),
        filter((val) => val.length > 2),
        tap((val: string) => {
          console.log(val);
          this.searchPostsByKeyword(val);
        })
      )
      .subscribe();
  }

  getPosts() {
    this.practiceService.getPosts().subscribe((posts) => {
      console.log("posts", posts);
      this.posts = posts;
    });
  }

  getPaginatedPosts() {
    if (9 <= 10) {
      this.practiceService
        .getPaginatedPosts(2)
        .subscribe((posts) => (this.posts = posts));
    } else {
      alert("Enter number 10 or less");
    }
  }

  addPost() {
    const post = {
      body: "This is the post body",
      title: "This is the post title",
      userId: 1,
    };
    this.practiceService.addPost(post).subscribe((post) => {
      console.log(post);
      this.posts.unshift(post);
      this._snackBar.open("Post saved");
    });
  }

  updatePost() {
    const date = new Date().toLocaleTimeString("en-US");
    const updatedPost = {
      title: `Updated Title at ${date}`,
      body: `Updated body at ${date}`,
    };
    this.practiceService.updatePost(1, updatedPost).subscribe((post) => {
      console.log(post);
      this.getPosts();
    });
  }

  searchPostsByKeyword(keyword) {
    this.practiceService.searchPosts(keyword).subscribe((posts) => {
      this.posts = posts;
    });
  }
}
