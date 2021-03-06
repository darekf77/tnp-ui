import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DraggablePopupComponent } from 'components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  modalOpen = true;
  @ViewChild('popupDrag') popupDrag: DraggablePopupComponent;
  toogleOpen() {
    this.modalOpen = !this.modalOpen;
  }

  public value: Observable<string>;

  constructor(
    public router: Router
  ) {

  }

  aa() {
    // this.router.navigateByUrl('/aa');
  }

  ngAfterViewInit(): void {
    // this.popupDrag.init(true);
  }

}
