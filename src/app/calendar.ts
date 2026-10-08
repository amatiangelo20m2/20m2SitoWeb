import {FormsModule} from '@angular/forms';
import {Component,inject,signal,computed,viewChild,ElementRef,effect,DestroyRef} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute,Router} from '@angular/router';
import {Icon} from './icons';
import {LOCATIONS} from './site';
import {EVENT_TYPES,monthDays,monthEvents,filterEvents,findEvent,dateLabel,ClubEvent,googleCalendarUrl,isFutureDate,SEASON} from './calendar-core';

const MONTH_RE=/^\d{4}-(0[1-9]|1[0-2])$/;

@Component({imports:[Icon,FormsModule],templateUrl:'./calendar.html'})
export class Calendar{
  private route=inject(ActivatedRoute);
  private router=inject(Router);
  private location=inject(Location);

  today=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Rome'});
  types=EVENT_TYPES;
  venues=LOCATIONS;
  weekdays=['LUN','MAR','MER','GIO','VEN','SAB','DOM'];
  season=SEASON;
  view=signal('calendar');

  dialog=viewChild.required<ElementRef<HTMLDialogElement>>('eventModal');
  agenda=viewChild<ElementRef<HTMLElement>>('agenda');

  /** Stato dei filtri: vive nel componente, l'URL viene solo aggiornato (niente navigazione = niente salto in cima). */
  month=signal(this.defaultMonth);
  venue=signal('all');
  type=signal('all');
  query=signal('');
  eventId=signal('');
  /** Giorno toccato nella griglia compatta (telefono). */
  pickedDay=signal<string|null>(null);

  days=computed(()=>{const[y,m]=this.month().split('-').map(Number);return monthDays(y,m-1)});
  heading=computed(()=>new Intl.DateTimeFormat('it-IT',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(this.month()+'-01T12:00:00Z')));
  visible=computed(()=>filterEvents(monthEvents(this.month()),this.venue(),this.type(),this.query()));
  agendaEvents=computed(()=>{const d=this.pickedDay();return d?this.visible().filter(e=>e.date===d):this.visible()});
  pickedLabel=computed(()=>{const d=this.pickedDay();return d?new Intl.DateTimeFormat('it-IT',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z')):''});
  selected=computed(()=>findEvent(this.eventId()));

  constructor(){
    // Legge i parametri all'arrivo sulla pagina (e se si arriva da un link interno, es. dalla home).
    const sub=this.route.queryParamMap.subscribe(p=>{
      const m=p.get('month');
      this.month.set(m&&MONTH_RE.test(m)?m:this.defaultMonth);
      const v=p.get('venue');this.venue.set(this.venues.some(x=>x.slug===v)?v!:'all');
      const t=p.get('type');this.type.set(this.types.some(x=>x.id===t)?t!:'all');
      this.query.set(p.get('q')??'');
      this.eventId.set(p.get('event')??'');
      this.pickedDay.set(null);
    });
    inject(DestroyRef).onDestroy(()=>sub.unsubscribe());

    effect(()=>{const e=this.selected();const el=this.dialog().nativeElement;if(e){if(!el.open)el.showModal()}else if(el.open)el.close()});
  }

  /** Mese corrente, limitato alla stagione in calendario. */
  get defaultMonth(){const m=this.today.slice(0,7);return m<SEASON.first?SEASON.first:m>SEASON.last?SEASON.last:m}

  /** Aggiorna l'indirizzo della pagina senza ricaricarla né scorrere in cima. */
  private syncUrl(){
    const params:Record<string,string>={};
    if(this.month()!==this.defaultMonth)params['month']=this.month();
    if(this.venue()!=='all')params['venue']=this.venue();
    if(this.type()!=='all')params['type']=this.type();
    if(this.query())params['q']=this.query();
    if(this.eventId())params['event']=this.eventId();
    const url=this.router.serializeUrl(this.router.createUrlTree(['/calendar'],{queryParams:params}));
    this.location.replaceState(url);
  }

  change(key:'month'|'venue'|'type'|'q',value:string){
    const v=value===''?'all':value;
    if(key==='month')this.month.set(v);
    if(key==='venue')this.venue.set(v);
    if(key==='type')this.type.set(v);
    if(key==='q')this.query.set(value);
    this.eventId.set('');
    this.pickedDay.set(null);
    this.syncUrl();
  }
  move(delta:number){const[y,m]=this.month().split('-').map(Number);this.change('month',new Date(Date.UTC(y,m-1+delta,1)).toISOString().slice(0,7))}
  open(e:ClubEvent){this.eventId.set(e.id);this.syncUrl()}
  close(){this.eventId.set('');this.syncUrl()}
  onCancel(e:Event){e.preventDefault();this.close()}
  backdrop(e:MouseEvent){if(e.target===e.currentTarget)this.close()}
  reset(){this.venue.set('all');this.type.set('all');this.query.set('');this.pickedDay.set(null);this.syncUrl()}

  pick(date:string){
    this.pickedDay.set(this.pickedDay()===date?null:date);
    queueMicrotask(()=>this.agenda()?.nativeElement.scrollIntoView({behavior:'smooth',block:'nearest'}));
  }

  eventsOn(date:string){return this.visible().filter(e=>e.date===date)}
  details(type:string){return this.types.find(t=>t.id===type)!}
  label=dateLabel;
  isFuture(e:ClubEvent){return isFutureDate(e.date,this.today)}
  googleCalendar(e:ClubEvent){return googleCalendarUrl(e,this.venueDetails(e))}
  venueDetails(e:ClubEvent){return this.venues.find(v=>v.slug===e.venue)!}
  isPast(e:ClubEvent){return e.date<this.today}
  weekdayShort(date:string){return new Intl.DateTimeFormat('it-IT',{weekday:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z')).replace('.','')}
}
