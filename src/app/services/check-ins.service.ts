import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CheckInsService {

  private supabase: SupabaseClient;

  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getCheckins(routeId: any, profileId: any) {
    return this.supabase.from("check_ins").select
    (`*,
    checkpoints!inner(*)`)
    .eq('route_id', routeId)
    .eq('profile_id', profileId)
    .not('checkpoints.icon','like','%challenges.png');
  }

  getChallenges (routeId: any, profileId: any) {
    return this.supabase.from("check_ins").select
    (`*,
    checkpoints!inner(*)`)
    .eq('route_id', routeId)
    .eq('profile_id', profileId)
    .like('checkpoints.icon','%challenges.png')
  }
}
