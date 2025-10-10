import { NgModule } from '@angular/core';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from '../app/app.component';
import { SidenavComponent } from '../app/components/sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    SidenavComponent,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [provideAnimationsAsync(), provideStorage(() => getStorage())],
  bootstrap: [AppComponent],
})
export class AppModule {}
