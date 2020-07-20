import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ConfirmEqualValidatorDirective } from './directives/not-equal.directive';

import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';


import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';





import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';




import { MatSidenavModule } from '@angular/material/sidenav';


import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';



// import { MatBadgeModule } from '@angular/material/badge';
// import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatTreeModule } from '@angular/material/tree';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { RouterModule } from '@angular/router';
import { UnauthorisedComponent } from './unauthorised/unauthorised/unauthorised.component';
import { AuthHeaderComponent } from './layout/auth/header/auth-header.component';
import { FooterComponent } from './layout/main/footer/footer.component';
import { SidebarComponent } from './layout/main/sidebar/sidebar.component';
import { MainHeaderComponent } from './layout/main/header/main-header.component';
import { GoogleChartsModule } from 'angular-google-charts';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [UnauthorisedComponent,
    AuthHeaderComponent, MainHeaderComponent, FooterComponent, SidebarComponent, ConfirmEqualValidatorDirective],
  imports: [
    CommonModule,
    MatFormFieldModule,
    PerfectScrollbarModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NotifierModule.withConfig(customNotifierOptions),
    GoogleChartsModule.forRoot(),
    // NgbModule,
    MatSidenavModule,
    
    MDBBootstrapModule.forRoot()
  ],
  exports: [
    FormsModule,
    RouterModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    GoogleChartsModule,
    AuthHeaderComponent,
    MainHeaderComponent,
    SidebarComponent,
    FooterComponent,
    ConfirmEqualValidatorDirective,
    MDBBootstrapModule,

    // MatBadgeModule,
    // MatBottomSheetModule,
    MatButtonModule,
    // MatButtonToggleModule,
    // MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatStepperModule,
    MatDatepickerModule,
    // MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    // MatDividerModule,
    // MatExpansionModule,
    // MatGridListModule,
    // MatIconModule,
    // MatListModule,
    // MatMenuModule,
    MatNativeDateModule,
    // MatPaginatorModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
    MatRadioModule,
    // MatRippleModule,
    MatSelectModule,
    // MatSidenavModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatSnackBarModule,
    // MatSortModule,
    // MatTableModule,
    // MatTabsModule,
    // MatToolbarModule,
    // MatTooltipModule,
    // MatTreeModule,
    NotifierModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class SharedModule { }
