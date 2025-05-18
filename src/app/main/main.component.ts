import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GeneralService } from '../services/general.service';
import { MatSidenav } from '@angular/material/sidenav';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  user: any;

  mobileQuery: MediaQueryList;

  @ViewChild('sidenav') sidenav!: MatSidenav; // Use @ViewChild to get #sidenav
  private _mobileQueryListener: () => void;

  private dateTimeInterval: any;

  constructor(
    private us: UserService,
    private as: AuthService,
    private gs: GeneralService,
    private ds: DataService,

    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 680px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.getUser();
    this.updateDateTime();

    this.dateTimeInterval = setInterval(() => this.updateDateTime(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.dateTimeInterval);
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getUser() {
    this.user = this.us.getUser();
  }


  async logout() {
    let logout = await this.gs.confirmationAlert(
      'Logout?',
      'You will be exiting the application',
      'warning',
      'Logout'
    );

    if (!logout) return;

    this.as.logout().subscribe(
      (response) => {
        this.gs.makeToast('You have been logged out.', 'success');
        this.router.navigate(['/login']);
      },
      (error) => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    );
  }

  // Correctly declare updateDateTime as a method
  updateDateTime(): void {
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
      // Check if dateTimeElement is not null
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long' as const,
        month: 'short' as const,
        day: 'numeric' as const,
        year: 'numeric' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
      };
      dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  currentScrollLevel: number = 0;
  hideHeader: boolean = false;

  @ViewChild('bodyContent', { static: true }) bodyContent!: ElementRef;

  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;

    if (scrollTop <= 50) {
      this.currentScrollLevel = scrollTop;
      this.hideHeader = false;
      return;
    }

    if (Math.abs(this.currentScrollLevel - scrollTop) >= 70) {
      this.hideHeader = this.currentScrollLevel < scrollTop;
      this.currentScrollLevel = scrollTop;
    }
  }
}
