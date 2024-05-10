import { Injectable } from '@angular/core';
import { Cocktail } from './cocktail';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: string[] = []; // Initialize favorites array here

  constructor() {}

  // Method to add a cocktail to favorites
  addToFavorites(cocktailId: string): void {
    if (!this.isFavorite(cocktailId)) {
      this.favorites.push(cocktailId);
    }
  }

  // Method to remove a cocktail from favorites
  removeFromFavorites(cocktailId: string): void {
    const index = this.favorites.indexOf(cocktailId);
    if (index !== -1) {
      this.favorites.splice(index, 1);
    }
  }

  // Method to check if a cocktail is in favorites
  isFavorite(cocktailId: string): boolean {
    return this.favorites.includes(cocktailId);
  }

  // Method to retrieve the list of favorites
  getFavorites(): string[] {
    return this.favorites;
  }
}