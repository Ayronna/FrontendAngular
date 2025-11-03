import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ClientsComponent } from "./clients.component";
import { HomeComponent } from "./home.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent, ClientsComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
