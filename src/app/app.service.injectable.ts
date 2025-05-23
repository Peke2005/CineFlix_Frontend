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

  getMovieByName(name: string, userId?: string | null): Observable<any> {
    let params = new HttpParams().set('title', name);
    if (userId) {
      params = params.set('idUser', userId);
    }
    return this.http.get(`/movieSearchTitle`, { params });
  }

  getActores(): Observable<any> {
    return this.http.get(`/actores`);
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

  profileUser(id: any): Observable<any> {
    return this.http.get(`/userSearchById?id=${id}`);
  }

  updateUser(body: any): Observable<any> {
    return this.http.put('http://localhost:8000/updateUser', body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getPeliculas(): Observable<any[]> {
    return this.http.get<any>(`/listFilms`);
  }

  crearPelicula(pelicula: any): Observable<any> {
    return this.http.post<any>(`/createFilm`, pelicula);
  }

  actualizarPelicula(id: number, pelicula: any): Observable<any> {
    return this.http.put<any>(`updateFilm/${id}`, pelicula);
  }

  eliminarPelicula(id: number): Observable<void> {
    return this.http.delete<void>(`deleteFilm/${id}`);
  }

  eliminarUsuario(id: any): Observable<any> {
    return this.http.delete<any>(`/deleteUser?id=${id}`);
  }

  subirComentario(
    idUser: any,
    idPelicula: any,
    comentario: any
  ): Observable<any> {
    let body = {
      userId: idUser,
      movieId: idPelicula,
      commentMessage: comentario,
    };
    return this.http.post<any>(`/uploadComentario`, body);
  }

  sumbitRespuesta(
    idUser: any,
    idComentario: any,
    comentario: any
  ): Observable<any> {
    let body = {
      userId: idUser,
      commentId: idComentario,
      responseMessage: comentario,
    };
    return this.http.post<any>(`/uploadCommentResponse`, body);
  }

  loadComments(idFilm: any, userId: string | null = null): Observable<any> {
    let params = new HttpParams().set('idFilm', idFilm);
    if (userId) {
      params = params.set('idUser', userId);
    }
    return this.http.get('/comments', { params });
  }

  getHistorial(idUser: any): Observable<any> {
    return this.http.get(`/historial?id=${idUser}`);
  }

  reaccionComentario(
    comentarioId: number,
    usuarioId: string,
    tipo: 'like' | 'dislike'
  ) {
    const formData = new FormData();
    formData.append('comentario_id', comentarioId.toString());
    formData.append('usuario_id', usuarioId);
    formData.append('tipo', tipo);

    return this.http.post<any>(
      'http://localhost:8000/comentario/reaccion',
      formData
    );
  }

  reaccionRespuesta(
    respuestaId: number,
    usuarioId: string,
    tipo: 'like' | 'dislike'
  ) {
    const formData = new FormData();
    formData.append('respuesta_id', respuestaId.toString());
    formData.append('usuario_id', usuarioId);
    formData.append('tipo', tipo);

    return this.http.post<any>(
      'http://localhost:8000/respuesta/reaccion',
      formData
    );
  }

  addToHistorial(
    usuarioId: string,
    peliculaId: string,
    fechaVista?: string
  ): Observable<any> {
    const body = {
      usuarioId,
      peliculaId,
      fechaVista: fechaVista || new Date().toISOString(),
    };

    return this.http.post<any>('http://localhost:8000/historial', body);
  }
  getUserRating(userId: string, movieId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('movieId', movieId.toString());

    return this.http.get(`/getUserRating`, { params });
  }

  rateMovie(userId: string, movieId: number, stars: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('movieId', movieId.toString())
      .set('valor', stars.toString());

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    return this.http.post(`/rateMovie`, params.toString(), { headers });
  }
}
