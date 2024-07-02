import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { Book, BooksResult, Item } from 'src/app/models/livro';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  searchField = new FormControl();
  errorMessage: string = '';
  booksResult: BooksResult;
  listBooks: Book[] = [];

  constructor(private livroService: LivroService) {}

  foundBooks$ = this.searchField.valueChanges.pipe(
    // Só executa após o tempo definido na variável PAUSA
    debounceTime(PAUSA),
    tap(() => {
      console.log('Fluxo inicial de dados');
    }),
    // Verifica se o campo de busca tem 3 ou mais caracteres
    filter((valorDigitado) => valorDigitado.length >= 3),
    // Faz a chamada na API
    switchMap((valorDigitado) => this.livroService.buscar(valorDigitado)),
    // Armazena o retorno da API na variável booksResult
    map((resultado) => (this.booksResult = resultado)),
    // Verifica se tem algum retorno
    map((resultado) => resultado.items ?? []),
    tap(console.log),
    // Armazena os itens
    map((items) => (this.listBooks = this.livrosResultadoParaLivros(items))),
    catchError((erro) => {
      console.log(erro);
      return throwError(
        () =>
          new Error(
            (this.errorMessage = `Ops, ocorreu um erro! Recarregue a aplicação!`)
          )
      );
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
