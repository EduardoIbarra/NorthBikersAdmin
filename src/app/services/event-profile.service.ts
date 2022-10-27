import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EventProfileService {
  private supabase: SupabaseClient;
  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  updateEventProfile = async (form: any, routeId: any, profileId: any) => {
    await this.supabase.from(`event_profile`)
    .update([{...form}])
    .eq(`route_id`, routeId)
    .eq( `profile_id`, profileId);
  }

}
