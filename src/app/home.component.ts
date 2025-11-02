import { Component } from "@angular/core";

@Component({
  selector: "app-clients",
  template: `
    <div class="home">
      <h1>👋 Welcome to the Gerimedica Frontend Assignment</h1>
      <h3> Need improvements in this application</h3>
      <p>Go to clients tab and perform below actions</p>
      <ol>
        <li>Edit the clients</li>
        <li>Delete the clients</li>
        <li>Search the client list using search box</li>
        <li>Filter the clients by isActive checkbox</li>
        <li>Add validations and unit tests</li>
        <li>Beautify the client list</li>
        <li>Improve wherever you can :) </li>
      </ol>
    </div>
  `,
  standalone: false,
  styles: [
    `
      .home {
        width: 760px;
        max-width: 80%;
        margin: 0 auto;
        padding: 16px;
        line-height: 1.7;
        text-align: center;
        font-size: 12px;
      }
      
      li, p {
        text-align: left;
      }
    `,
  ],
})
export class HomeComponenet {}
