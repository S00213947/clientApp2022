import { Component, OnInit } from '@angular/core';
import { Cocktail } from 'src/app/cocktail';
import { CocktailService } from 'src/app/cocktail.service';
import { FakecocktailService } from 'src/app/fakecocktail.service';
import { CocktailApiService } from 'src/app/services/cocktail-api.service';
import { DrinkReponse } from '../cocktailresponse';
import { Observable, catchError, of, tap } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AuthService } from '@auth0/auth0-angular';
import { FavoritesService } from 'src/app/favorites.service';


library.add(faHeart);

@Component({
  selector: 'app-cocktail-list',
  templateUrl: './cocktail-list.component.html',
  styleUrls: ['./cocktail-list.component.css'],
  
  
})
export class CocktailListComponent implements OnInit {

  cocktailList: Cocktail[] = [];
  message: string = "";
  cocktaildata: DrinkReponse | any;
cocktailrandom: DrinkReponse | any;
errorMessage:any;
icon=faHeart;
isFavorited: boolean = false;
searchPerformed: boolean = false; 


  currentCocktail : Cocktail | undefined;
  showCocktailForm: boolean = false;

  constructor(private _cocktailservice:CocktailApiService,public auth: AuthService, private cocktailservice: CocktailService,  private favoritesService: FavoritesService) { }
 // constructor(private cocktailservice: FakecocktailService) { }
  ngOnInit(): void {
    this.cocktailservice.getCocktails().subscribe({
      next: (value: Cocktail[] )=> this.cocktailList = value,
      complete: () => console.log("cocktail service finished"),
      error: (mess) => this.message = mess
    })
  }
  clicked (cocktail: Cocktail): void {
    this.currentCocktail = cocktail;
  }

  openAddCocktail(): void {
    this.currentCocktail = undefined;
    this.showCocktailForm = true;
  }

  openEditCocktail(): void {
    this.showCocktailForm = true;
  }

  dismissAlert() {
    this.message = "";
  }

  toggleFavourite() 
  {
    this.isFavorited = !this.isFavorited;
  }

  getDrinkDetails(searchTerm: string): void {
  this._cocktailservice.getSearchData(searchTerm).subscribe(
    cocktaildata => {
      this.cocktaildata = cocktaildata;
      console.log('drink name' + this.cocktaildata.name);
      // Set the first drink as the current cocktail after search
      if (this.cocktaildata.drinks && this.cocktaildata.drinks.length > 0) {
        this.currentCocktail = this.cocktaildata.drinks[0];
      }
    },
    error => this.errorMessage = <any>error
  );
}


    getrandomDetails(): void {
      this._cocktailservice.getrandomData().subscribe(
        cocktailrandom => {
          this.cocktailrandom = cocktailrandom;
          console.log('Cocktail Random Data:', this.cocktailrandom);
        },
        error => {
          this.errorMessage = <any>error;
          console.error('Error:', error);
        }
      );
    }

    addToFavorites(drink: any): void {
      this.favoritesService.addToFavorites(drink.idDrink);
    }


      addFavoriteCocktail(cocktailId: string): void {
        this.auth.user$.subscribe((user) => {
          if (user) {
            const userId = user!.sub!;
            this._cocktailservice.addFavorite(userId, cocktailId).subscribe((response) => {
              console.log('Cocktail added to favorites', response);
            });
          } else {
            console.error('User Id is undefined');
          }
        });
      }
      
     

      getsandomDetails(): Observable<any> {
        return this._cocktailservice.getrandomData().pipe(
          tap(cocktailrandom => {
            this.cocktailrandom = cocktailrandom;
            console.log('drink name' + this.cocktailrandom.name);
          }),
          catchError(error => {
            this.errorMessage = <any>error;
            return of(null);
          })
        );
      }



  updateCocktail(id: string, cocktail: Cocktail): void {
    console.log('updating ');
    console.table (cocktail);
    this.cocktailservice.updateCocktail(id, cocktail)
      .subscribe({
        next: cocktail => {
          console.log(JSON.stringify(cocktail) + ' has been updated');
          this.message = " cocktail has been updated";
          this.ngOnInit();
          this.currentCocktail=undefined;
        },
        error: (err) => this.message = err
      }); 
  }

  cocktailFormClose(cocktail?: any): void {
    this.showCocktailForm = false;
    console.table(cocktail);
    if (cocktail == null) {
      this.message = "form closed without saving";
      this.currentCocktail = undefined
    }
    else if (this.currentCocktail == null) {
     this.addNewCocktail(cocktail);
    }
    else {
     this.updateCocktail(this.currentCocktail._id, cocktail)
    }
  }

addNewCocktail(newCocktail: Cocktail): void {
  console.log('adding new cocktail ' + JSON.stringify(newCocktail));
  this.cocktailservice.addCocktail({ ...newCocktail })
    .subscribe({
      next: cocktail => {
        console.log(JSON.stringify(cocktail) + ' has been added');
        this.message = "new cocktail has been added";
        this.ngOnInit();
      },
      error: (err) => this.message = err
    });
  }


  deleteCocktail() {
    console.log('deleting a drink ');
    if (this.currentCocktail) {
      this.cocktailservice.deleteCocktail(this.currentCocktail._id)
        .subscribe({
          next: cocktail => {
            console.log(JSON.stringify(cocktail) + ' has been deleted');
            this.message = "drink has been deleted";
            this.ngOnInit();
            this.currentCocktail=undefined;
          },
          error: (err) => this.message = err
        });
    }
  }
  
  
  isSelected(cocktail: Cocktail): boolean {
    if (!cocktail || !this.currentCocktail) {
      return false;
    }
    else {
      return cocktail._id === this.currentCocktail._id;
  
    }
  }
  
  
  }