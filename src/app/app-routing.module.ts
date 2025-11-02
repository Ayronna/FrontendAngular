import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientsComponent } from "./clients.component";
import { HomeComponenet } from "./home.component";

const routes: Routes = [
  {
    path: "clients",
    component: ClientsComponent,
  },
  {
    path: "",
    component: HomeComponenet,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
