import { Injectable, inject } from '@angular/core';
import { Hero } from '../hero'
import { Observable, of } from 'rxjs'
import { MessageService } from './message.service'

const HEROES: Hero[] = [
  { id: 12, name: 'Dr. Nice' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr. IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
]

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private messageService = inject(MessageService)

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES)
    this.messageService.add('HeroService: fetched heroes')
    return heroes
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(h => h.id === id)!
    this.messageService.add(`HeroService: fetched hero id=${id}`)
    return of(hero)
  }
}
