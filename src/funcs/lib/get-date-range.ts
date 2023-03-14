

export class GetDateRange {

  public start: string;
  public end: string;

  constructor() {
    const now = new Date(Date.now());
    if (now.getDate() === 1) {
      // Last month
      this.start = this.dateFormatString(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      this.end = this.dateFormatString(new Date(now.getFullYear(), now.getMonth(), 0));
    } else {
      this.start = this.dateFormatString(new Date(now.getFullYear(), now.getMonth(), 1));
      this.end = this.dateFormatString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    }
  }

  private dateFormatString = (date: Date): string => {
    return (date.getFullYear()) + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + (date.getDate())).slice(-2);
  };
}