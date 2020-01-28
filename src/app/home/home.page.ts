import { Component } from "@angular/core";
import { Insomnia } from "@ionic-native/insomnia/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  percent: number = 0;
  radius: number = 100;
  timer: any = false;
  fullTime: any = "00:01:30";
  progress: any = 0;
  minutes: number = 1;
  seconds: any = 30;

  elapsed: any = {
    h: "00",
    m: "00",
    s: "00"
  };

  overAll: any = false;

  constructor(private insomnia: Insomnia) {}

  startTime() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    if (!this.overAll) {
      this.progressTimer();
      this.insomnia.keepAwake();
    }

    this.timer = false;
    this.percent = 1;
    this.progress = 1;

    let timeSplit = this.fullTime.split(":");

    this.minutes = +timeSplit[1];
    this.seconds = +timeSplit[2];

    let totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);
    this.timer = setInterval(() => {
      if (this.percent == this.radius) {
        clearInterval(this.timer);
      }
      this.percent = Math.floor((this.progress / totalSeconds) * 100) + 1;
      this.progress++;
    }, 1000);
  }

  progressTimer() {
    let countDownDate = new Date();
    this.overAll = setInterval(() => {
      let now = new Date().getTime();
      let distance = now - countDownDate.getTime();

      this.elapsed.h = this.pad(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        2
      );
      this.elapsed.m = this.pad(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        2
      );
      this.elapsed.s = this.pad(Math.floor((distance % (1000 * 60)) / 1000), 2);
    });
  }

  pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  stopTime() {
    clearInterval(this.timer);
    clearInterval(this.overAll);

    this.overAll = false;
    this.timer = false;

    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h: "00",
      m: "00",
      s: "00"
    };

    this.insomnia.allowSleepAgain();
  }

  formatSubtitle = (): string => {
    if (this.percent >= 100) {
      return "Extra time!";
    } else if (this.percent >= 50) {
      return "Half way";
    } else if (this.percent > 0) {
      return "GO GO !";
    } else {
      return "Not started";
    }
  };
}
