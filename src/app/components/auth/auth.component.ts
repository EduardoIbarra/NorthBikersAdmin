import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loading = false

  constructor(private readonly supabase: SupabaseService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async handleLogin(input: string) {
    try {
      this.loading = true
      await this.supabase.signIn(input)
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error)
    } finally {
      this.loading = false
    }
  }

}
