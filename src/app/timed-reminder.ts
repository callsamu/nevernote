export class TimedReminder {
  constructor(
    private text: string,
    private timeMs: number,
  ) {}

  notify() {
    setTimeout(() => {
      alert(this.text);
    }, this.timeMs)
  }
}
