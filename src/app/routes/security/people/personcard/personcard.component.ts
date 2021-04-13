import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Person, PeopleService } from 'app/services';


@Component({
  selector: 'app-personcard',
  templateUrl: './personcard.component.html',
  styleUrls: ['./personcard.component.scss'],
  providers: [PeopleService],
})
export class PersoncardComponent implements OnInit {
  public picture: File;
  public baseURL: string;
  constructor(public peopleService: PeopleService) {

      this.baseURL = environment.apiURL;
  }
  @Input() person: Person;

  ngOnInit(): void {

  }
}
