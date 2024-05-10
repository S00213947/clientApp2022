import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Cocktail } from '../cocktail';
import { FavoritesService } from '../favorites.service';
import { CocktailService } from '../cocktail.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: Cocktail[] = [];

  constructor(private favoritesService: FavoritesService, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.refreshFavorites();
  }

  refreshFavorites(): void {
    const ids = this.favoritesService.getFavorites();
    const observables: Observable<Cocktail>[] = ids.map(id => this.cocktailService.getCocktailById(id));

    forkJoin(observables).subscribe(cocktails => {
      this.favorites = cocktails;
      console.log('Favorites:', this.favorites);
    }, error => console.error('Error fetching favorites:', error));
  }

  removeFromFavorites(cocktailId: string): void {
    this.favoritesService.removeFromFavorites(cocktailId);
    this.refreshFavorites();  // Refresh to reflect changes
  }
}
