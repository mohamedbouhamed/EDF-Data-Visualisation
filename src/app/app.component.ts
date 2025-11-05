import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
import topology from '@highcharts/map-collection/custom/europe.topo.json';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ThemeService, ThemeMode } from './services/theme.service';

HC_map(Highcharts);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    HighchartsChartModule,
    TranslateModule  // Assurez-vous que TranslateModule est importé
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentLang: string = 'fr';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  topology: typeof topology = topology;
  isDropdownOpen = false;
  isDarkMode = false;
  themeMode: ThemeMode = 'auto';

  constructor(
    private translate: TranslateService,
    private titleService: Title,
    public themeService: ThemeService
  ) {
    // Langues supportées
    this.initializeTranslations();
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.themeService.themeMode$.subscribe(mode => {
      this.themeMode = mode;
    });
  }

  private initializeTranslations() {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setDefaultLang('fr');

    // Récupère la langue du navigateur
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/fr|en/) ? browserLang : 'fr');
    this.currentLang = this.translate.currentLang;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  ngOnInit() {
    // Mettre à jour le titre quand la langue change
    this.translate.onLangChange.subscribe(() => {
      this.updateTitle();
    });

    // Mettre à jour le titre initialement
    this.updateTitle();
  }

  private updateTitle() {
    this.translate.get('TITLE').subscribe((res: string) => {
      this.titleService.setTitle(res);
    });
  }
}