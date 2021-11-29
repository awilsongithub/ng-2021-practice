import { Router, NavigationStart, RouterEvent } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.css"],
})
export class AnalyticsComponent implements OnInit {
  pageVisits: Array<any> = [];
  prevNavigation: number;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        console.log("ROUTER EVENT:", event.url);
        const time = Date.now();

        switch (event.url) {
          case "/":
            this.pageVisits.push({
              time: (Date.now() - this.prevNavigation) / 1000 + "seconds",
              page: event.url,
            });
            this.prevNavigation = time;
            break;
          case "/cart":
            this.pageVisits.push({
              time: (Date.now() - this.prevNavigation) / 1000 + " seconds",
              page: event.url,
            });
            this.prevNavigation = time;
            break;
          default:
        }

        /**
         * start building a log of time on pages
         * at each navigation add entry to list page: timeOnPage:
         * time, page
         * on nav set prevNavTime
         * on next nav set time on page to now - prevNavTime.
         *
         */
      });
  }
}
