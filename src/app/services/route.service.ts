import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../../environments/environment";

export interface Routes {
  id: Int16Array | null | undefined,
  show_points: boolean | null | undefined,
  video_id: string | null | undefined,
  rules_file: string | null | undefined,
  title: string | null | undefined,
  description: string | null | undefined,
  start_timestamp: string | null | undefined,
  end_timestamp: string | null | undefined,
  banner: string | null | undefined,
  cover: string | null | undefined,
  created_at: string | null | undefined,
  updated_at: string | null | undefined,
  active: boolean | null | undefined,
  profile_id: string | null | undefined,
  rally: boolean | null | undefined,
  featured: boolean | null | undefined,
  pinned: boolean | null | undefined
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private supabase: SupabaseClient;

  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  updateRoute(route: Routes, id?: any) {
    const update = {
      ...route,
      updated_at: new Date()
    }

    if(id){
      return this.supabase.from('routes').update(update, {
        returning: 'representation',
      }).match({id});
    }

    return this.supabase.from('routes').upsert(update, {
      returning: 'representation',
    });
  }

  deleteRoute = async(deleteId: number) => {
    await this.supabase
    .from('feeds')
    .delete()
    .match({ route_id: deleteId });

    await this.supabase
    .from('event_profile')
    .delete()
    .match({ route_id: deleteId });

    await this.supabase
    .from('check_ins')
    .delete()
    .match({ route_id: deleteId });

    await this.supabase
    .from('checkpoints')
    .delete()
    .match({ route_id: deleteId });

    await this.supabase
    .from('event_checkpoints')
    .delete()
    .match({ event_id: deleteId });

    return await this.supabase
    .from('routes')
    .delete()
    .match({ id: deleteId });
  }

  getAllRoutes() {
    return this.supabase.from(`routes`)
    .select('*')
    .eq('active', 'true')
    .order('featured', { ascending: false })
    .order('id', { ascending: false });
  }

  getRouteWithDetail = (routeId: any) => {
    return this.supabase.from(`routes`)
    .select('*')
    .eq('id', routeId)
    .order('id', { ascending: true })
  }

  getCheckpoints = () => {
    return this.supabase.from(`checkpoints`)
    .select('*')
    .order('order', { ascending: true });
  }
  
  getCheckpointsForRoute = (routeId: any) => {
    return this.supabase.from(`event_checkpoints`)
    .select('*, checkpoints:checkpoint_id(*)')
    .eq('event_id', routeId)
    .order('order', { ascending: true });
  }

  getFeaturedRoute() {
    return this.supabase.from(`routes`)
    .select('*')
    .range(0, 1)
    .order('id', { ascending: false })
    .eq('featured', 'true');
  }

  searchRoute(title: string) {
    return this.supabase.from(`routes`)
      .select()
      .ilike('title', `%${title}%`)
  }

  getEventPauses = (eventId: any) => {
    return this.supabase.from(`event_pauses`)
    .select('*')
    .eq('event_id', eventId)
    .order('id', { ascending: true })
  }
}
