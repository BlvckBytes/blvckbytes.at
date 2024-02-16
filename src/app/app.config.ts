import "hammerjs";

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { patchingTokenWalker } from './markdown-tokenizer-patches';
import { patchedRenderer } from './markdown-renderer-patches';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideMarkdown({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: (): MarkedOptions => ({
          walkTokens: patchingTokenWalker,
          renderer: patchedRenderer,
        })
      }
    }),
    provideHttpClient(),
  ]
};
