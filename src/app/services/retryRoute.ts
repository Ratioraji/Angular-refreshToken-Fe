import { Observable, of, throwError } from 'rxjs';
import {delay, mergeMap, retryWhen } from 'rxjs/operators';

const DefaultMaxRetry = 5;

export function delayedRetry(delayInMls: number, maxRetry = DefaultMaxRetry) {
    let retries  = maxRetry;

    return (src: Observable<any>) =>
        src.pipe(
            retryWhen((errors: Observable<any>) => errors.pipe(
                delay(delayInMls),
                mergeMap(error  => retries-- > 0 ? of(error) : throwError('i gave up on retrying'))
            ))
        );

}
