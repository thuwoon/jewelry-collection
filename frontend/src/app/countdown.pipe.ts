import { Pipe, PipeTransform } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith, takeWhile, takeUntil } from 'rxjs/operators';


@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {
  formatCountdown(remainingTime: number): string {
    // You can format the remaining time as needed
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  transform(created_at: string): Observable<string> {
    // Parse the created_at timestamp to a Date object
    const createdAtDate = new Date(created_at);

    // Calculate the target end time (one day later)
    const oneDayLater = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000);


    return interval(1000).pipe(
      map(() => {
        const remainingTime = oneDayLater.getTime() - Date.now();
        
        if (remainingTime > 0) {
          const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
          return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          return 'Auction closed.';
        }
      }),
      takeWhile((remainingTime) => remainingTime !== 'Auction closed.'),
      startWith(this.formatCountdown(oneDayLater.getTime() - Date.now())),
      // takeUntil(this.onDestroy)
    );
  }
}
