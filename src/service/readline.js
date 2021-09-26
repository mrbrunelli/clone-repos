import rl from "readline";

export class ReadLineService {
  constructor() {
    this.readLine = rl.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  question(query) {
    return new Promise((resolve) => {
      this.readLine.question(query, resolve);
    });
  }

  isPositiveAnswer(answer) {
    return answer === "y";
  }

  closeReadLine() {
    this.readLine.close();
  }

  onClose(callback) {
    this.readLine.on("close", callback);
  }
}
