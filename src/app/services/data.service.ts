import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class DataService {
    public getGoogleMapsAPiKey(): string { return "API_KEY_HERE"; }
    private baseUrl: string = 'http://localhost:50295/api/';
    public getWebSocketUrl() { return 'ws://localhost:50295/ws' }
    public getImageAbsoluteUrl(relativeUrl: string): string {return this.baseUrl.replace('api/', relativeUrl);}
    

    constructor(private http: HttpClient) { }

    public get<T>(url: string, onSuccess: (response: T) => void, onError: (response: T) => void, token?: string): void {
        this.http.get<T>(this.baseUrl + url, { headers: this.buildHeaders(token) }).subscribe(
            (response: T) => onSuccess(response),
            (error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
                    onError(error.error);
                }
            }
        );
    }

    public post<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any, token?: string): void {
        this.http.post<T>(this.baseUrl + url, data, { headers: this.buildHeaders(token) }).subscribe(
            (response: T) => onSuccess(response),
            (error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
                    onError(error.error);
                }
            }
        );
    }

    public put<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any, token?: string): void {
        this.http.put<T>(this.baseUrl + url, data, { headers: this.buildHeaders(token) }).subscribe(
            (response: T) => onSuccess(response),
            (error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
                    onError(error.error);
                }
            }
        );
    }

    public patch<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, data: any, token?: string): void {
        this.http.patch<T>(this.baseUrl + url, data, { headers: this.buildHeaders(token) }).subscribe(
            (response: T) => onSuccess(response),
            (error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
                    onError(error.error);
                }
            }
        );
    }

    public delete<T>(url: string, onSuccess: (response: T) => void, onError: (error: any) => void, token?: string): void {
        this.http.delete<T>(this.baseUrl + url, { headers: this.buildHeaders(token) }).subscribe(
            (response: T) => onSuccess(response),
            (error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
                    onError(error.error);
                }
            }
        );
    }

    private buildHeaders(token?: string): HttpHeaders {
        const headers = new HttpHeaders({
            'Accept': 'application/json',
            'Authorization': (token != null && token != '') ? 'Bearer ' + token : ''
        });
        if (token != undefined && token != null && token != '') {
            headers.append('Authorization', token);
        }
        return headers;
    }
}
