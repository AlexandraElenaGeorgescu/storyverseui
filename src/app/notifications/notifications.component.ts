import { Component, OnInit, NgZone } from '@angular/core';
import { NotificationsService } from '../services/notification.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [NotificationsService],
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationsService.getNotifications().subscribe((data) => {
      this.notifications = data;
    });
  }

  markAsRead(id: string): void {
    this.notificationsService.markNotificationAsRead(id).subscribe(() => {
      // Update the local notifications list
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        console.log('Notification before update:', notification);
        this.ngZone.run(() => {
          notification.read = true;
          this.cdr.detectChanges(); 
          console.log('Notification after update:', notification);
        });
      }
    });
  }
}
