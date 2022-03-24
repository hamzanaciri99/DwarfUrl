import {AfterContentInit, AfterViewInit, Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {UrlService} from "../service/url.service";
import {ShortUrl} from "../model/ShortUrl";
import {MatRow, MatTable, MatTableDataSource} from "@angular/material/table";
import {map} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../model/User";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  BASE_URL = 'http://localhost:8001/url/';

  url: string = '';

  _shortUrls: ShortUrl[] = [];
  columnsToDisplay: string[] = ['longUrl', 'shortUrl', 'clicks', 'copy'];
  @ViewChild('shortUrlsTable') shortUrlsTable!: MatTable<ShortUrl>;

  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource: MatTableDataSource<ShortUrl> = new MatTableDataSource<ShortUrl>();

  constructor(private urlService: UrlService,
              public userService: UserService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.userService.currentUserSubject.subscribe(user => {
      this.fetchUrls();
      if(this.userService.isLoggedIn()) {
        this.columnsToDisplay.push('remove');
      } else {
        this.columnsToDisplay = this.columnsToDisplay.filter(column => column !== 'remove')
      }
    })
  }

  get shortUrls() { return this._shortUrls; }

  set shortUrls(shortUrls: ShortUrl[]) {
    this._shortUrls = shortUrls;
    this.dataSource = new MatTableDataSource(this._shortUrls);
    this.dataSource.paginator = this.paginator;
  }


  fetchUrls() {
    this.urlService.get(this.userService.currentUser)
      .pipe(map(shortUrls =>
        shortUrls.map(shortUrl => ({...shortUrl, hash: shortUrl.hash}))
      ))
      .subscribe((shortUrls: ShortUrl[]) => this.shortUrls = shortUrls );
  }

  onShorten() {
    if(this.url.trim() === '') return;
    this.urlService.add({longUrl: this.url}, this.userService.currentUser)
      .pipe(map(shortUrl => ({...shortUrl, hash: shortUrl.hash})))
      .subscribe(shortUrl => {
        if(!this.shortUrls.find(row => row.hash === shortUrl.hash)) {
          this.shortUrls= [...this.shortUrls, shortUrl];
        }
      });
  }

  copyUrl(row: ShortUrl) {
    navigator.clipboard.writeText(row.hash ?? "");
  }

  removeUrl(row: ShortUrl) {
    this.urlService.delete(row, this.userService.currentUser).subscribe(response => {
      this.shortUrls = this.shortUrls.filter(sUrl => sUrl !== row);
      this._snackBar.open("Url deleted", "Dismiss");
    }, error => {
      this._snackBar.open("Error deleting url", "Dismiss");
    })
  }
}
