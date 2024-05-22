import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UserSigninComponent } from './user-signin/user-signin.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { StoryCreateComponent } from './story-create/story-create.component';
import { StoryBrowseComponent } from './story-browse/story-browse.component';
import { StoryDetailsComponent } from './story-details/story-details.component';
import { StoryStatsComponent } from './story-stats/story-stats.component';
import { ReviewBrowseComponent } from './chat-room/review-browse/review-browse.component';
import { ReviewEditComponent } from './chat-room/review-edit/review-edit.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';

export const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'user-signup', component: UserSignupComponent },
  { path: 'user-signin', component: UserSigninComponent },
  { path: 'user-dashboard/:listType/:pageSize/:pageId', component: UserDashboardComponent, canActivate: [AuthGuardService] },
  { path: 'story-create', component: StoryCreateComponent, canActivate: [AuthGuardService] },
  { path: 'story-browse/:pageSize/:pageId', component: StoryBrowseComponent },
  { path: 'story-details/:id', component: StoryDetailsComponent },
  { path: 'story-stats/:id', component: StoryStatsComponent, canActivate: [AuthGuardService] },
  { path: 'review-browse/:storyId/:pageSize/:pageId', component: ReviewBrowseComponent },
  { path: 'review-edit/:id', component: ReviewEditComponent, canActivate: [AuthGuardService] },
  { path: 'chat-room/:storyId', component: ChatRoomComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: 'story-browse/6/0', pathMatch: 'full' },
  { path: '**', component: RouteNotFoundComponent }
];
