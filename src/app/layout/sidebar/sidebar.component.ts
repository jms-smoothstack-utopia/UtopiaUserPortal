import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import PathConstants from 'src/environments/paths';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) {}

  goToProfile(): void {
    this.router.navigate([PathConstants.USER_PROFILE]);
  }

  ngOnInit(): void {}
}
