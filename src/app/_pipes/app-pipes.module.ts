import { NgModule } from '@angular/core';

import { ShortenPipe } from './shorten.pipe';

@NgModule({
    imports: [
    ],
    declarations: [
        ShortenPipe
    ],
    exports: [
        ShortenPipe
    ]
})
export class ApplicationPipesModule {
    // Nothing to see here...
}
