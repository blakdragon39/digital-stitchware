import { Component, inject } from '@angular/core'
import { CommonModule, Location, NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { Hero } from '../hero'
import { HeroService } from '../services/hero.service'

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [ CommonModule, NgIf, FormsModule ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss'
})
export class HeroDetailComponent {

  private route = inject(ActivatedRoute)
  private location = inject(Location)

  private heroService = inject(HeroService)

  hero?: Hero

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero)
  }

  goBack(): void {
    this.location.back()
  }
}
