import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { RolePermissionsModel } from 'src/app/core/models/role-permission.model';
import { RolePermissionService } from 'src/app/core/services/role-permission.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-roles-permission',
  templateUrl: './roles-permission.component.html',
  styleUrls: ['./roles-permission.component.scss']
})
export class RolesPermissionComponent implements OnInit {
  private notifier: NotifierService;  
  roleFormData: RolePermissionsModel = {
    roleName: null,
    description: null
  }

  roleList: any;
  closeResult: string;
  modalOptions:NgbModalOptions;
  constructor( 
    private modalService: NgbModal,
    private rolePermissionService: RolePermissionService,
    notifier: NotifierService

    ) {
    this.notifier = notifier;
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'     
    }
   }

  ngOnInit(): void {
    this.getAllRoles();
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

  submit(form: NgForm){
    debugger;
    if(form.valid){
      this.rolePermissionService.addUserRole(this.roleFormData).subscribe(response => {
        this.notifier.notify( "success", response.message );
      })
    }
    this.getAllRoles();
  }

  getAllRoles(){
    this.rolePermissionService.GetAllRoles({page:0, limit:0, allRecords:true, orderBy:"RoleName", orderByDescending:true}).subscribe(response => {
      this.roleList = response.roleResponseData;
    })
  }

  removeRole(roleId: number, userId: number){
    let confirmation = confirm('Do you want to delete this job?');
    if (confirmation) {
      this.rolePermissionService.DeleteRole({roleId, userId}).subscribe(res => {
        console.log(res);
        debugger;
      })
    }
    this.getAllRoles();
  }

  update(form: NgForm){
    debugger;
    console.log(this.roleList);
    for(let i = 0; i < this.roleList.length; i++){
      if(form.valid){
        this.rolePermissionService.UpdateRole(this.roleList[i].roleId).subscribe(response => {
          // this.notifier.notify( "success", response.message );
          console.log(response);
          debugger;
        }, error => {
          debugger;
        })
      }
    }
    
    this.getAllRoles();
  
  }

}
