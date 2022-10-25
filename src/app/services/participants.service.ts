import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../../environments/environment";
import { CheckInsService } from 'src/app/services/check-ins.service';


@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private supabase: SupabaseClient;
  public participants: Array<any> = [];

  constructor(private readonly checkinsService: CheckInsService) { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getEventProfileWithDetail = (routeId:any) => {
    return this.supabase.from(`event_profile`)
      .select(`*,
      profile: profile_id (*),
      route: route_id (*)`)
      .eq('route_id', routeId)
      .order('points', {ascending: false});
  }
}
