import { Reminder } from "./reminder";

export class TimedReminder extends Reminder {
  constructor(
    text: string,
    private timeMs: number,
  ) {
    super(text)
  }

  override notify() {
    setTimeout(() => {
      super.notify()
    }, this.timeMs)
  }
}
