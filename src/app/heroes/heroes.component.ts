import { Component, OnInit, inject } from '@angular/core'
import { CommonModule, NgFor, NgIf } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { HeroDetailComponent } from '../hero-detail/hero-detail.component'
import { Hero } from '../hero'
import { HeroService } from '../services/hero.service'

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    HeroDetailComponent,
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    RouterModule,
  ],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})

export class HeroesComponent implements OnInit {

  private heroService = inject(HeroService)

  heroes: Hero[] = []

  ngOnInit(): void {
    this.getHeroes()
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes)
  }
}
