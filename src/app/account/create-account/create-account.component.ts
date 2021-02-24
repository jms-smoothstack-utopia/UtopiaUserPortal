import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  constructor(private accountService: AccountService, private log: NGXLogger) {}

  ngOnInit(): void {}
}
