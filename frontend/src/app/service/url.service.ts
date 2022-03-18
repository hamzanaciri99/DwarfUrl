import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ShortUrl} from "../model/ShortUrl";
import {User} from "../model/User";

const BASE_URL = 'http://localhost:8001'

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(private http: HttpClient) { }

  add(shortUrl: ShortUrl, user: User) {
    return this.http.post<ShortUrl>(`${BASE_URL}/url/${user.id}`, shortUrl);
  }

  get(user: User) {
    return this.http.get<ShortUrl[]>(`${BASE_URL}/user/${user.id}/urls`)
  }

  delete(shortUrl: ShortUrl, user: User) {
    return this.http.delete(`${BASE_URL}/url/${shortUrl.hash}`, {
      params: new HttpParams().set("userId", user.id ?? 0),
      observe: 'response'
    })
  }
}
