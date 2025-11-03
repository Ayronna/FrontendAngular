import { Component } from "@angular/core";

@Component({
  selector: "app-clients",
  template: `
    <div class="home">
      <h1>👋 Welcome to the Gerimedica Frontend Assignment</h1>
      <h3> Need improvements in this application</h3>
      <p>Go to clients tab and perform below actions</p>
      <ol>
        <li><s>Edit the clients</s></li>
        <li><s>Delete the clients</s></li>
        <li><s>Search the client list using search box</s></li>
        <li><s>Filter the clients by isActive checkbox</s></li>
        <li><s>Add validations and unit tests</s></li>
        <li>Beautify the client list</li>
        <li>Split up the monolith ClientsComponent into smaller components</li>
        <li>Consider server-side filtering for name</li>
        <li>Add pagination to the client list</li>
        <li>Add sorting to the client list</li>
        <li>Add tests for the existing components</li>
        <li>Remove all in-line styling and move to proper CSS classes</li>
        <li>Fix styling, use BEM naming conventions where applicable</li>
        <li>Centralize validation rules/messages</li>
        <li>Provide reusable validators</li>
        <li>Consider reactive forms instead of template-driven forms</li>
        <li>Create a small validationService/helper library</li>
        <li>Create a presentational error component to display validation errors</li>
        <li>Accessibility improvements</li>
        <li>Create and improve unit, integration tests</li>
        <li>Consider application testing (Cypress?)</li>
        <li>Enable strict mode in tsconfig.json</li>
        <li>Improve UI and UX, make it more user friendly</li>
        <li>Convert larger features to lazy-loaded modules</li>
        <li>Check standalone components where applicable</li>
        <li>Continue expanding the app!</li>

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
export class HomeComponent {}
