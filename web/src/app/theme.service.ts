import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    isDarkMode;

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {

        const mode = localStorage.getItem('mode') ? localStorage.getItem('mode') : 'dark';
        this.isDarkMode = mode === 'dark';

        this.document.body.classList.add(mode + '-mode');
    }

    setDark() {

        this.document.body.classList.remove('light-mode');
        this.document.body.classList.add('dark-mode');

        localStorage.setItem('mode', 'dark');
    }

    setLight() {

        this.document.body.classList.remove('dark-mode');
        this.document.body.classList.add('light-mode');

        localStorage.setItem('mode', 'light');
    }

    toggleMode() {

        if (this.isDarkMode) {

            this.setLight();
        } else {

            this.setDark();
        }

        this.isDarkMode = !this.isDarkMode;
    }
}
