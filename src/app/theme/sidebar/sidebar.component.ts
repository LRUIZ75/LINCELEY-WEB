import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() showToggle = true;
  @Input() showUser = false; //TODO: Disabled by LRUIZ
  @Input() showHeader = true; //Controla el header con el branding
  @Input() toggleChecked = false;

  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor() {}
}
