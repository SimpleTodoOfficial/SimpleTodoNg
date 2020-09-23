import { Pipe, PipeTransform } from '@angular/core';

// Usage example: {{ myString | shorten:10 }}
@Pipe({
    name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

    transform(value: string, limit: number): string {
        if (value == null || limit < 0) {
            return '';
        }
        return value.length > limit ? value.substring(0, limit) + '...' : value;
    }

}
