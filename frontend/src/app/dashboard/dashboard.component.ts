import {AfterContentInit, AfterViewInit, Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {UrlService} from "../service/url.service";
import {ShortUrl} from "../model/ShortUrl";
import {MatRow, MatTable, MatTableDataSource} from "@angular/material/table";
import {map} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  BASE_URL = 'http://localhost:8001/url/';

  url: string = '';

  _shortUrls: ShortUrl[] = [];
  columnsToDisplay: string[] = ['longUrl', 'shortUrl', 'clicks', 'copy', 'remove'];
  @ViewChild('shortUrlsTable') shortUrlsTable!: MatTable<ShortUrl>;

  pageSize: number = 10;
  @ViewChild('paginator') paginator!: MatPaginator;
  dataSource: MatTableDataSource<ShortUrl> = new MatTableDataSource<ShortUrl>();

  constructor(private urlService: UrlService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fetchUrls();
  }

  get shortUrls() { return this._shortUrls; }

  set shortUrls(shortUrls: ShortUrl[]) {
    this._shortUrls = shortUrls;
    this.dataSource = new MatTableDataSource(this._shortUrls);
    this.dataSource.paginator = this.paginator;
  }


  fetchUrls() {
    this.urlService.get({ id: 1 })
      .pipe(map(shortUrls =>
        shortUrls.map(shortUrl => ({...shortUrl, hash: shortUrl.hash}))
      ))
      .subscribe((shortUrls) => { this.shortUrls = shortUrls });
  }

  onShorten() {
    if(this.url == '') return;
    this.urlService.add({longUrl: this.url}, {id: 1})
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
    this.urlService.delete(row, { id: 1 }).subscribe(response => {
      this.shortUrls = this.shortUrls.filter(sUrl => sUrl !== row);
      this._snackBar.open("Url deleted", "Dismiss");
    }, error => {
      this._snackBar.open("Error deleting url", "Dismiss");
    })
  }
}
