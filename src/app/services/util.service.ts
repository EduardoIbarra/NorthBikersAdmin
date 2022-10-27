import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private baseUrl = 'http://localhost:3000';
  private uploadUrl = '~/../uploads';
  private supabase: SupabaseClient;
  currentUser: any;
  constructor(private http: HttpClient) { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    console.log(this.uploadUrl);
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploads`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadFileFromBase64 = async (base64: string, type: string) => {
    const file = await this.dataUrlToFile(base64.replace('data:image/jpeg;base64,', ''), 'myFile');
    const fileName = `${type}/${Date.now()}.jpg`;

    await this.supabase
    .storage
    .from('pictures')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

    return fileName;
  }

  dataUrlToFile = (dataUrl: string, fileName: string = 'myFile') => {
    return fetch(`data:image/jpeg;base64,${dataUrl}`)
      .then(res => res.blob())
    .then(blob => {
      return new File([blob], fileName, { type: 'image/jpeg' });
    });
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  getUserFromLocalStorage = () => {
    this.currentUser = JSON.parse(window.localStorage.getItem('nb_user') || '{}');
    return this.currentUser;
  }

  setLocalStorage(key: string, value: any, isJson: boolean = true) {
    if (isJson) {
      localStorage.setItem(key, JSON.stringify(value))
    }

    if (!isJson) {
      localStorage.setItem(key, value)
    }
  }

  getLocalStorage(key: string) {
    const data = localStorage.getItem(key)?.toString();
    try {
      return JSON.parse(data || '{}');
    } catch (e) {
      return data;
    }
  }
}
