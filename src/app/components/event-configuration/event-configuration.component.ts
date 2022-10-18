import { Component, OnInit } from '@angular/core';
import { Routes, RouteService } from '../../services/route.service';
import { FormGroup, FormControl } from '@angular/forms';
import {UtilService} from '../../services/util.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-configuration',
  templateUrl: './event-configuration.component.html',
  styleUrls: ['./event-configuration.component.scss']
})
export class EventConfigurationComponent implements OnInit {
  public routes: Routes[] | any;
  bannerFile?: File;
  coverFile?: File;
  rulesFile?: File;
  currentFile?: File;
  fileInfos?: Observable<any>;
  routeResponse: Routes | any;
  selectedRouteId: any;
  
  routeForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    start_timestamp: new FormControl(''),
    end_timestamp: new FormControl(''),
    banner: new FormControl(''),
    cover: new FormControl(''),
    active: new FormControl(false),
    rally: new FormControl(false),
    featured: new FormControl(false),
    pinned: new FormControl(false),
    show_points: new FormControl(false),
    video_id: new FormControl(''),
    rules_file: new FormControl('')
  });
  constructor(
    private readonly routeService: RouteService,
    private utilService: UtilService,
    private activatedRoute: ActivatedRoute) { 
      
    }

  ngOnInit() {
    this.getRoutes();
  }

  getRouteInfo = async (event: any) => {
    this.selectedRouteId = event.target.value;
    console.log(event.target.value);
    this.routeService.getRouteWithDetail(this.selectedRouteId).then((response: any) => {
      if (response && response.data && response.data[0]) {
        this.routeResponse =  response.data[0];

        console.log('routeResponse', this.routeResponse);
        this.routeForm.controls['title'].setValue(this.routeResponse.title);
        this.routeForm.controls['description'].setValue(this.routeResponse.description);
        //this.routePicture.path  = this.getImg(this.routeResponse.banner);
        //this.routeForm.controls['banner'].setValue(this.routeResponse.banner);
        //this.routeForm.controls['cover'].setValue(this.routeResponse.cover);
        this.routeForm.controls['start_timestamp'].setValue(this.routeResponse.start_timestamp);
        this.routeForm.controls['end_timestamp'].setValue(this.routeResponse.end_timestamp);
        this.routeForm.controls['rally'].setValue(this.routeResponse.rally);
        this.routeForm.controls['active'].setValue(this.routeResponse.active);
        this.routeForm.controls['featured'].setValue(this.routeResponse.featured);
        this.routeForm.controls['pinned'].setValue(this.routeResponse.pinned);
        this.routeForm.controls['show_points'].setValue(this.routeResponse.show_points);
        this.routeForm.controls['video_id'].setValue(this.routeResponse.video_id == null ? '' : 'https://www.youtube.com/embed/' + this.routeResponse.video_id);
        //this.routeForm.controls['rules_file'].setValue(this.routeResponse.rules_file);
      }
    });
  }

  getRoutes() {
    this.routeService.getAllRoutes().then(response => {
      this.routes = response.data;
      console.log(this.routes);
    });
  }

  selectFile = async(event: any, index:any) => {
    if(index == 0) this.bannerFile = event.target.files[0];
    if(index == 1) this.coverFile = event.target.files[0];
    if(index == 2) this.rulesFile = event.target.files[0];
  }

  handleUpload = async (event:any) => {
    const file = event;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    var fileResult : any = "";
    reader.onload = async () => {
      fileResult = reader.result;
      let fileName = await this.utilService.uploadFileFromBase64(fileResult, 'route');
      console.log(fileName);
      return fileName;
    };
  }

  saveRoute = async() => {
    const bannerName = await this.handleUpload(this.bannerFile);
    const coverName = await this.handleUpload(this.coverFile);
    const rulesName = await this.handleUpload(this.rulesFile);
    let videoId = this.getVideoId(this.routeForm.value.video_id);
    console.log(bannerName);
    console.log(coverName);
    console.log(rulesName);
    /*const route: Routes = {
      title: this.routeForm.value.title,
      description: this.routeForm.value.description,
      banner: bannerName,
      cover: coverName,
      start_timestamp: this.routeForm.value.start_timestamp,
      end_timestamp: this.routeForm.value.end_timestamp,
      featured: this.routeForm.value.featured,
      rally: this.routeForm.value.rally,
      pinned: this.routeForm.value.pinned,
      show_points: this.routeForm.value.show_points,
      video_id: videoId,
      rules_file: rulesName,
      created_at: undefined,
      updated_at: undefined,
      active: this.routeForm.value.active,
      profile_id: undefined,
      id: undefined
    }*/

    /*this.routeService.updateRoute(route, this.routeResponse?.id).then((response: any) => {
      console.log(response);
      this.routeResponse = response.data[0];
      //loading.dismiss();
      if (this.routeResponse?.id && this.selectedRouteId) {
        //this.utilService.presentToast('Rodada editada correctamente', 'warning');
        //this.router.navigateByUrl(`/route/${this.routeResponse?.id}`, {replaceUrl: true});
        return
      }


    }, ()=>{
      //loading.dismiss();
    });*/
  }

  getVideoId = (url: any) => {
    if(url == null) return null;
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

}
