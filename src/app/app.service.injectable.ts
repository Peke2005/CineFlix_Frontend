import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CineFlixService {
  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<any> {
    return this.http.get(`/listFilms`);
  }

  getMoviesByCategory(category: string): Observable<any> {
    return this.http.get(`/movieSearchCategory?category=${category}`);
  }

  getMovieByName(name: string): Observable<any> {
    return this.http.get(`/movieSearchTitle?title=${name}`);
  }

  loginUser(user: any): Observable<any> {
    let body = JSON.stringify(user);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('/userLogin', body, { headers: headers });
  }

  registerUser(user: any): Observable<any> {
    let body = JSON.stringify(user);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('/userRegister', body, { headers: headers });
  }

  profileUser(id : any): Observable<any> {
    return this.http.get(`/userSearchById?id=${id}`);
  }
}
