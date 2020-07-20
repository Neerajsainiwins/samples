import { Component, OnInit, Input } from '@angular/core';
import { ProfileModel } from 'src/app/core/models/profile.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input()
  disableRipple: Boolean
  private notifier: NotifierService;

  constructor(private adminService: AdminService,
    private localStorage: LocalStorageService,
    notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
  }
  profileData: ProfileModel = {
    userId: 0,
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    dateOfJoining: null,
    dateOfLeaving: null,
    designation: null,
    gender: null,
    userName: "ria sahni",
    phone: null,
    alternateNumber: null,
    officialEmail: null,
    skype: null,
    mediaId: 0,
    pan: null,
    bloodGroup: null
  }

  saveProfile() {
    debugger;
    // if(form.valid){
    let userData = this.localStorage.getUserCredentials();
    this.profileData.userId = userData.UserId;
    this.adminService.addProfile(this.profileData).subscribe(res => {
      this.notifier.notify("success", res.message);
    }, error => {
      this.notifier.notify("error", error.error.Message);
    })
    // }
  }
}
