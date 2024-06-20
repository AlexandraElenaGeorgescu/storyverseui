export class ThemeService {
  private darkMode = false;

  constructor() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkMode = JSON.parse(savedTheme);
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    this.applyTheme();
  }

  applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      this.setBackgroundImage('dark');
    } else {
      document.body.classList.remove('dark-mode');
      this.setBackgroundImage('light');
    }
  }

  setBackgroundImage(theme: string) {
    const backgroundImage = theme === 'dark' 
      ? 'url("https://passporttoeden.com/wp-content/uploads/2022/09/DarkAcademiaLibraries_Featured-1-of-1.jpg")' 
      : 'url("https://www.cottagesandbungalowsmag.com/wp-content/uploads/2018/10/chris-lawton-236413-unsplash-1.jpg")';
    const backgroundImageElement = document.querySelector('.background-image');
    if (backgroundImageElement) {
      backgroundImageElement.setAttribute('style', `background-image: ${backgroundImage};`);
    }
  }

  isDarkMode() {
    return this.darkMode;
  }
}