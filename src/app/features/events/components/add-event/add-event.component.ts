import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../../../shared/service/events.service';
import { Eventy } from '../../../../model/eventy';
import { futurDateValidator } from '../../../../shared/Validators/futur-date.validator';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent implements OnInit {
  eventForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.pattern('[a-zA-Z]*')
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(30)
      ]],
      date: ['', [Validators.required, futurDateValidator(7)]],
      location: ['', Validators.required],
      price: ['', [
        Validators.required,
        Validators.pattern('^\\d+(\\.\\d+)?$')
      ]],
      imageUrl: [''],
      nbPlaces: ['', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]?$|^100$')
      ]],
      domaines: new FormArray([
        new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
      ]),
      detailedAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        governorate: ['', Validators.required],
        zipcode: ['', Validators.required]
      })
    });
  }

  // Getter for domaines FormArray
  get domaines() {
    return this.eventForm.get('domaines') as FormArray;
  }

  // Add a new domaine field
  addDomain() {
    this.domaines.push(new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]));
  }

  // Remove a domaine field
  removeDomaine(index: number): void {
    if (this.domaines.length > 1) {
      this.domaines.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const newEvent: Eventy = {
        id: this.eventsService.events.length > 0 
          ? Math.max(...this.eventsService.events.map(e => e.id)) + 1 
          : 1,
        title: formValue.title,
        description: formValue.description,
        date: new Date(formValue.date),
        location: formValue.location,
        price: parseFloat(formValue.price),
        imageUrl: formValue.imageUrl || '',
        nbPlaces: parseInt(formValue.nbPlaces),
        nbrLike: 0,
        organizerId: 1,
        domaines: formValue.domaines.filter((d: string) => d.trim() !== ''),
        detailedAddress: formValue.detailedAddress
      };
      this.eventsService.events.push(newEvent);
      this.router.navigate(['/events']);
    }
  }

  onReset(): void {
    this.eventForm.reset();
  }
}
