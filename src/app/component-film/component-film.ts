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
  comentarios: any[] = [];
  showActors: boolean = false;
  showButtons: boolean = false;
  inputValue: string = '';
  showResponseInput: boolean = false;
  selectedCommentId: number | null = null;
  responseValue: string = '';
  comentariosExpandido: { [key: number]: boolean } = {};

  sanitizeImage(base64: string): SafeUrl {
    if (base64.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(base64);
    }
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/png;base64,${base64}`
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      const title = params.get('titleFilm');

      this.cineflixService.getMovieByName(title).subscribe({
        next: (response) => {
          this.film = response.data[0];
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.film.trailer
          );
          this.loadComentarios(this.film.id);

          if (this.film.comentarios) {
            this.film.comentarios.forEach((comentario: any) => {
              if (!Array.isArray(comentario.respuestas)) {
                comentario.respuestas = comentario.respuesta
                  ? [comentario.respuesta]
                  : [];
              }
              this.comentariosExpandido[comentario.id] = false;
            });
          } else {
            this.film.comentarios = [];
          }
        },
        error: (err) => {
          console.error('Error al cargar la película:', err);
        },
      });
    });
  }

  loadComentarios(filmId: number): void {
    this.cineflixService.loadComments(filmId).subscribe({
      next: (response: any) => {
        const comentariosArray = response.data || [];
        this.comentarios = comentariosArray.map((comentario: any) => ({
          ...comentario,
          respuestas: Array.isArray(comentario.respuestas)
            ? comentario.respuestas
            : comentario.respuesta
            ? [comentario.respuesta]
            : [],
        }));
        this.comentarios.forEach((comentario: any) => {
          this.comentariosExpandido[comentario.id] = false;
        });
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        this.comentarios = [];
      },
    });
  }

  formatFechaNacimiento(fecha: string | null): string {
    if (!fecha || fecha === 'undefined/00:00:00.0000000/')
      return 'No disponible';
    const partes = fecha.split(' ')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  submitComment(): void {
    if (this.inputValue.trim()) {
      const userId = localStorage.getItem('idUser');
      const nombre = localStorage.getItem('nameUser');
      const foto = localStorage.getItem('foto_perfil') || null;

      this.cineflixService
        .subirComentario(userId, this.film.id, this.inputValue)
        .subscribe({
          next: () => {
            const newComment = {
              id: Date.now(),
              mensaje: this.inputValue.trim(),
              fecha_creacion: new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' '),
              usuario: {
                id: Number(userId),
                nombre,
                foto_perfil: foto,
              },
              respuestas: [],
            };

            this.comentarios.unshift(newComment);
            this.comentariosExpandido[newComment.id] = false;
            this.inputValue = '';
          },
          error: (error) => {
            console.error('Error al agregar comentario', error);
          },
        });
    }
  }

  cancelAction(): void {
    this.inputValue = '';
    this.showButtons = false;
  }

  onRespondClick(commentId: number): void {
    this.selectedCommentId = commentId;
    this.showResponseInput = true;
    this.responseValue = '';
  }

  toggleRespuestas(commentId: number): void {
    this.comentariosExpandido[commentId] =
      !this.comentariosExpandido[commentId];
  }

  submitResponse(): void {
    if (this.responseValue.trim() && this.selectedCommentId !== null) {
      const userId = localStorage.getItem('idUser');
      const nameUser = localStorage.getItem('nameUser') || 'Usuario';
      const fotoPerfil = localStorage.getItem('foto_perfil') || null;

      this.cineflixService
        .sumbitRespuesta(userId, this.selectedCommentId, this.responseValue)
        .subscribe({
          next: () => {
            const newResponse = {
              mensaje: this.responseValue.trim(),
              fecha_creacion: new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' '),
              usuario: {
                id: Number(userId),
                nombre: nameUser,
                foto_perfil: fotoPerfil,
              },
            };

            const comment = this.comentarios.find(
              (c: any) => c.id === this.selectedCommentId
            );
            if (comment) {
              if (!comment.respuestas) comment.respuestas = [];
              comment.respuestas.push(newResponse);
              this.comentariosExpandido[comment.id] = true;
            }

            this.showResponseInput = false;
            this.selectedCommentId = null;
            this.responseValue = '';
          },
          error: (error) => {
            console.error('Error al agregar respuesta', error);
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
