import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CineFlixService } from '../app.service.injectable';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

@Component({
  selector: 'component-film',
  standalone: false,
  templateUrl: './component-film.html',
  styleUrl: './component-film.css',
})
export class ComponentFilm implements OnInit {
  constructor(
    private Route: Router,
    private route: ActivatedRoute,
    private cineflixService: CineFlixService,
    private sanitizer: DomSanitizer
  ) {}

  trailerUrl!: SafeResourceUrl;
  film: any;
  showActors: boolean = false;
  showButtons: boolean = false;
  inputValue: string = '';
  showResponseInput: boolean = false;
  selectedCommentId: number | null = null;
  responseValue: string = '';

  sanitizeImage(base64: string): SafeUrl {
    if (base64.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(base64);
    }
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/png;base64,${base64}`
    );
  }

  getResponses(respuesta: any): any[] {
    return Array.isArray(respuesta) ? respuesta : [respuesta];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.cineflixService.getMovieByName(params.get('titleFilm')).subscribe({
        next: (response) => {
          this.film = response.data[0];
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.film.trailer
          );

          const usuariosConImagen = new Map<number, string>();
          if (this.film.comentarios) {
            this.film.comentarios.forEach((comentario: any) => {
              const usuario = comentario.usuario;
              if (usuario?.id && usuario.foto_perfil) {
                usuariosConImagen.set(usuario.id, usuario.foto_perfil);
              }
              if (
                usuario?.id &&
                (!usuario.foto_perfil || usuario.foto_perfil === null) &&
                usuariosConImagen.has(usuario.id)
              ) {
                usuario.foto_perfil = usuariosConImagen.get(usuario.id);
              }
              console.log('Comentario:', comentario);
              console.log('Usuario del comentario:', usuario);
              console.log('Foto de perfil:', usuario?.foto_perfil);
            });
          }
          console.log('Datos de la película:', this.film);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }

  formatFechaNacimiento(fecha: string | null): string {
    if (!fecha || fecha === 'undefined/00:00:00.0000000/') {
      return 'No disponible';
    }
    const partes = fecha.split(' ');
    const fechaParte = partes[0];
    if (!fechaParte) {
      return 'No disponible';
    }
    const fechaPartes = fechaParte.split('-');
    return `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;
  }

  submitComment(): void {
    if (this.inputValue.trim()) {
      const usuario = {
        id: Number(localStorage.getItem('idUser')),
        nombre: localStorage.getItem('nameUser'),
        foto_perfil: localStorage.getItem('foto_perfil') || null,
      };

      const newComment = {
        id: Date.now(),
        mensaje: this.inputValue.trim(),
        fecha_creacion: new Date().toISOString().slice(0, 19).replace('T', ' '),
        respuesta: null,
        usuario: usuario,
      };

      this.cineflixService
        .subirComentario(
          localStorage.getItem('idUser'),
          this.film.id,
          this.inputValue
        )
        .subscribe({
          next: (response) => {
            console.log('Comentario añadido con éxito', response);
            if (!this.film.comentarios) {
              this.film.comentarios = [];
            }
            this.film.comentarios.unshift(newComment);
            this.inputValue = '';
          },
          error: (error) => {
            console.error('Error al agregar comentario', error);
          },
        });
    }
  }

  cancelAction() {
    this.inputValue = '';
    this.showButtons = false;
  }

  onRespondClick(commentId: number): void {
    this.selectedCommentId = commentId;
    this.showResponseInput = true;
    this.responseValue = '';
  }

  submitResponse(): void {
    if (this.responseValue.trim() && this.selectedCommentId !== null) {
      const userId = localStorage.getItem('idUser');
      console.log('Enviando respuesta:', {
        userId,
        commentId: this.selectedCommentId,
        responseMessage: this.responseValue,
      });
      this.cineflixService
        .sumbitRespuesta(userId, this.selectedCommentId, this.responseValue)
        .subscribe({
          next: (response) => {
            console.log('Respuesta añadida con éxito', response);
            const newResponse = {
              autor: localStorage.getItem('nameUser'),
              mensaje: this.responseValue.trim(),
              fechaCreacion: new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' '),
            };
            const comment = this.film.comentarios.find(
              (c: any) => c.id === this.selectedCommentId
            );
            if (comment) {
              if (!comment.respuesta) {
                comment.respuesta = [];
              }
              if (!Array.isArray(comment.respuesta)) {
                comment.respuesta = [comment.respuesta];
              }
              comment.respuesta.push(newResponse);
            }
            this.showResponseInput = false;
            this.selectedCommentId = null;
            this.responseValue = '';
          },
          error: (error) => {
            console.error('Error al agregar respuesta', error);
            if (error.error && error.error.message) {
              console.error('Mensaje del servidor:', error.error.message);
            }
          },
        });
    }
  }

  cancelResponse(): void {
    this.showResponseInput = false;
    this.selectedCommentId = null;
    this.responseValue = '';
  }
}
