import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { Cocktail } from './cocktail';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {

  private dataUri = `${environment.apiUri}/cocktails`;
  constructor(private http: HttpClient) { }

  getCocktails(): Observable<Cocktail[]> {

    console.log("get cocktails called" );

    return this.http.get<Cocktail[]>(`${this.dataUri}`)
    .pipe(
      retry(3),
     // catchError(this.handleError)
     catchError(this.handleError)
    );
  }

  getCocktailById(cocktailId: string): Observable<Cocktail> {
    const url = `${this.dataUri}/${cocktailId}`;
    return this.http.get<Cocktail>(url);
  }

  addCocktail(cocktail: Cocktail): Observable<Cocktail> {
    return this.http.post<Cocktail>(this.dataUri, cocktail)
      .pipe(
        catchError(this.handleError)
      )
  }

  

  /** DELETE: delete the cocktail from the server */
deleteCocktail(id: string): Observable<unknown> {
  const url = `${this.dataUri}/${id}`; // DELETE 
  return this.http.delete(url)
    .pipe(
      catchError(this.handleError)
    );
}

  updateCocktail(id: string, cocktail: Cocktail): Observable<Cocktail> {
    console.log('subscribing to update' + id);
    let cocktailURI: string = this.dataUri + '/' + id;
    return this.http.put<Cocktail>(cocktailURI, cocktail)
      .pipe(
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
