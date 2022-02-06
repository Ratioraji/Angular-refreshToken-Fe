import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { CredentialsService } from './credentials.service';
import { delayedRetry } from './retryRoute';

@Injectable({
  providedIn: 'root'
})
export class BaseService<M> {
  httpOptions: any;
  credService = new CredentialsService();
  constructor(public httpClient: HttpClient) {
  }
  sendGet(url: any, useCache?: boolean, option?: any): Observable<M> {
    const httpOpt = { ...this.httpOptions, ...option };
    if (useCache) {
      return this.httpClient
        .get(url, httpOpt)
        .pipe(
          delayedRetry(4000, 3),
          map((body: any) => body),
          catchError(this.handleError),
          shareReplay()
        );
    } else {
      return this.httpClient.get(url, httpOpt).pipe(
        delayedRetry(4000, 3),
        map((body: any) => body),
        catchError(this.handleError),
        shareReplay()
      );
    }
  }

  sendNoAuthGet(url: any, useCache?: boolean): Observable<M> {
    if (useCache) {
      return this.httpClient
        .get(url)
        .pipe(
          map((body: any) => body),
          catchError(this.handleError)
        );
    } else {
      return this.httpClient.get(url).pipe(
        map((body: any) => body),
        catchError(this.handleError)
      );
    }
  }

  sendNoAuthPost(url: any, payload: any): Observable<M> {
    return this.httpClient.post(url, payload).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendPost(url: any, payload: any): Observable<M> {
    return this.httpClient.post(url, payload, this.httpOptions).pipe(
      delayedRetry(4000, 3),
      map((body: any) => body),
      catchError(this.handleError),
      shareReplay()
    );
  }

  sendPut(url: any, payload: any): Observable<M> {
    return this.httpClient.put(url, payload, this.httpOptions).pipe(
      delayedRetry(4000, 3),
      map((body: any) => body),
      catchError(this.handleError),
      shareReplay()
    );
  }

  sendPatch(url: any, payload: any): Observable<M> {
    return this.httpClient.patch(url, payload, this.httpOptions).pipe(
      delayedRetry(4000, 3),
      map((body: any) => body),
      catchError(this.handleError),
      shareReplay()
    );
  }

  sendDelete(url: any): Observable<M> {
    return this.httpClient.delete(url).pipe(
      delayedRetry(4000, 3),
      map((body: any) => body),
      catchError(this.handleError),
      shareReplay()
    );
  }

  baseUrl(url: string) {
    return environment.serverUrl + url;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.log('handleError', error.error ? error.error.status : '');
      return throwError({
        code: error.error ? error.error.code : '',
        status: error.error ? error.error.status : '',
        message: error.error ? error.error.message : '',
        data: error.error ? error.error.errors : ''
      });
    }
    return throwError(
      JSON.stringify({
        name: error.name,
        status: error.status,
        message: error.message
      })
    );
  }
}
