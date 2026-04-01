export class Reminder {
  constructor(
    private text: string
  ) {}

  notify() {
    alert(this.text);
  }
}
