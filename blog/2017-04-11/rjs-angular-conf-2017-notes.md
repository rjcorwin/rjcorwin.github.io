# R.J.'s NG Conf 2017 notes 

Here's a boiled down selection of my notes from NG Conf 2017.

- [Angular Conf 2017 Playlist](https://www.youtube.com/playlist?list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K)
- Angular CLI is a serious effort of the Angular Team to implement best practices and also spread the work on Angular to things like the build tools.
    - In a way, Angular is a way of doing things with many libraries and the Angular CLI is what brings it all together.
    - The [ABC initiative](https://www.youtube.com/watch?v=lOOyxwADTjI&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=66) is bringing internal Blaze and Clojure tools to Angular CLI for improving build time. 
- John Papa's presentation wow'ed the room with how efficient developers can be with the NG CLI, snippets, and modern IDEs like VS Code. https://www.youtube.com/watch?v=h7eVZg3j_Lk&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=12
- Typescript is our new best friend and it's time to start taking advantage of it in our code. Dan Wahlin and John Papa give a good walkthrough in [Diving into TypeScript](https://www.youtube.com/watch?v=4xScMnaasG0&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=65). Skip half-way through to get into live coding examples.
- In many cases the docs are outdate.
    - Flagship Tutorial for Angular, [Tour of Heroes](https://angular.io/docs/ts/latest/tutorial/), doesn't use CLI among other things.
    - Docs for building Angular as Progressive Web App are "90% outdated" as described at the session https://www.youtube.com/watch?v=ecu1vAO23ZM&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=26
    - Google is working on an official Angular Course
- i18n support started with the ngx-tranlate module, now efforts from the same developer is to get it into core angular libraries. New i18n library in Angular has a lot in common but one big difference is that the older library you could switch translations on the fly, in the new library you have end up with a different build folder for each translation.  
    - old http://www.ngx-translate.com/
    - new https://angular.io/docs/ts/latest/cookbook/i18n.html
    - Angular Conf 2017 - Lost in Translation https://www.youtube.com/watch?v=dihyu1a2bPc&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=30
- Component Libraries at Angular Conf 2017 - Don't forget you can mix and match!
    - Material
      - https://material.angular.io/
      - Workshop video from NG Conf 2017 https://www.youtube.com/watch?v=8hIBy2VCUSc&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=59
    - Covalent from Teradata
      - https://github.com/Teradata/covalent
    - PrimeNG
      - https://www.primefaces.org/primeng/#/
      - NG Conf 2017 Session https://www.youtube.com/watch?v=yzhARGULsVQ&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=23
    - Kendo UI
      - http://www.telerik.com/kendo-angular-ui/
    - VMware's Clarity
      - https://vmware.github.io/clarity/
    - ag-Grid
      - https://www.ag-grid.com/
      - CSV export of 100,000 rows is fast!
    - IgniteUI
      - https://github.com/IgniteUI/igniteui-angular2
- A lot of us are confused with how many types of Modules we're dealing with these days. The Module Vs. Module session provided some clarity https://www.youtube.com/watch?v=ntJ-P-Cvo7o&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K&index=8

