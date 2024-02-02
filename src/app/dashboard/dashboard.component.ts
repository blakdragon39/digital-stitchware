import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router'
import { NgFor } from '@angular/common'
import { Hero } from '../hero'
import { HeroService } from '../services/hero.service'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ 
    RouterModule,
    NgFor, 
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  heroes: Hero[] = []

  private heroService = inject(HeroService)

  ngOnInit(): void {
    this.getHeroes()
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5))
  }
}
