import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-edit-screens',
  templateUrl: './add-edit-screens.component.html',
  styleUrls: ['./add-edit-screens.component.scss']
})
export class AddEprojectcreensComponent implements OnInit {

  closeResult: string;
  modalOptions:NgbModalOptions;
  constructor( private modalService: NgbModal ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
   }

  ngOnInit(): void {
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
 
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  showFiller = false;

}
