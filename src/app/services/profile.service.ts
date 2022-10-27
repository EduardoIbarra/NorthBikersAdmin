import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../../environments/environment";

export interface Profile {
  id?: number;
  name?: string;
  email?: string;
  bike?: string;
  avatar_url?: string;
  city?: number;
  points?: number;
  blocked_users?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }

   createProfile(Profile: Profile) {
    const create = {
      ...Profile,
      updated_at: new Date()
    }

    return this.supabase.from('profiles').insert(create, {
      returning: 'representation',
    });
  }

  updateProfile(Profile: Profile) {
    const update = {
      ...Profile,
      updated_at: new Date()
    }

    return this.supabase.from('profiles').upsert(update, {
      returning: 'representation',
    });
  }

  deleteProfile = async (profileId: string) => {
    await this.supabase
    .from('check_ins')
    .delete()
    .match({ profile_id: profileId });

    await this.supabase
    .from('event_profile')
    .delete()
    .match({ profile_id: profileId });

    await this.supabase
    .from('feed_comments')
    .delete()
    .match({ profile_id: profileId });

    await this.supabase
    .from('feeds')
    .delete()
    .match({ profile_id: profileId });

    await this.supabase
    .from('my_emergencies')
    .delete()
    .match({ id: profileId });

    await this.supabase
    .from('profile_reards')
    .delete()
    .match({ profile_id: profileId });

    await this.supabase
    .from('track_comments')
    .delete()
    .match({ profile_id: profileId });

    return await this.supabase
    .from('profiles')
    .delete()
    .match({ id: profileId });
  }

  getAllProfiles() {
    return this.supabase.from(`profiles`).select('*');
  }

  getProfileById = (profileId: any) => {
    return this.supabase.from(`profiles`)
    .select('*')
    .eq('id', profileId);
  }

  getProfileByEmail = (email: any) => {
    return this.supabase.from(`profiles`)
    .select('*')
    .eq('email', email);
  }
}
