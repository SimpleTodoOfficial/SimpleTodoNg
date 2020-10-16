import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EmojiService {
    private emojis = [
        '😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😙', '🌻',
        '😜', '😛', '😁', '😂', '😅', '😋', '😎', '👻', '⛄', '🌈',
        '😈', '😇', '😺', '😸', '😻', '😽', '😹', '🔥', '🍄', '🌴',
        '👍', '👌', '✌', '💪', '⭐', '🌼', '🌞', '🎃', '🐖', '🌺',
        '💗', '💕', '💖', '💘', '🎁', '🐫', '🐪', '🐈', '🌸', '🎈',
        '🐶', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🍀', '💐',
        '🐻', '🐷', '🐮', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🌹',
        '🐧', '🐦', '🐤', '🐥', '🐣', '🐔', '🐍', '🐢', '🐛', '🐝',
        '🐜', '🐞', '🐌', '🐠', '🐟', '🐬', '🐳', '🐄', '🐏', '🌷',
        '🐅', '🐇', '🐎', '🐐', '🐓', '🐕'

    ];
    public currentEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];

    constructor(
    ) {
        // Nothing to see here...
    }

    getCurrentEmoji() {
        return this.currentEmoji;
    }

    refreshRandomEmoji() {
        this.currentEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        return this.currentEmoji;
    }

}
