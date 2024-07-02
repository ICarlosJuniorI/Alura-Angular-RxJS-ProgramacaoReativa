import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BooksResult } from '../models/livro';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private readonly API: string = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  buscar(typedValue: string): Observable<BooksResult> {
    const params = new HttpParams().append('q', typedValue);
    return this.http.get<BooksResult>(this.API, { params });
  }
}
