# Microfrontends

Separate major features in separate repos. Direct communication between
features is avoided. Communication is implemented via the backend.

Each of those pieces could then be assigned to separate developer teams.

![alt text](microfrontends.PNG)

There is a container app in addition to the microfrontends, that decides
which app should be displayed.

![alt text](mfe-integration.PNG)

![alt text](mfe-integrations.PNG)

Will be focusing on run-time integration as that is far more complicated.

We choose a container that integrates the other library.
ModuleFederationPlugin can be used to expose files to the other
process. And then the same plugin can be used to connect the container to
the dependency.

A dependency provides several configuration options that define the name of 
files that are exposed to the container file.
* `name` provides the name for the module with which it will be referenced
from the parent container along with its URL and filename.
* `filename` defines the file name that contains the list of files that
are available from the project and directions on how to load them.
* `exposes` defines the files that are exposed and what is the alias for them.
Left side being the alias and the right side being the file that is
exposed.

When the dependency is being loaded, then several files are loaded. First the
file that is defined using `filename`. In the example it is 
`listOfFilesThatAreAvailableFromThisProjectAndDirectionsOnHowToLoadThem.js`. 
This gives instructions on how to bind the custom code and dependencies together.
Then there is the file that contains our exposed code in the format of 
`<folderStructure>_<exposedFileName>_js.js`. So in our example `src_fileNameToExposeInProducts_js.js`.
If our file would be more deeply nested, for example `src/nesting/fileNameToExposeInProducts.js`, then
the file name would be `src_nesting_fileNameToExposeInProducts_js.js`.
Finally, is a file related to the dependencies.

The dependency also spits out the main file in addition to those so that it could
still be loaded standalone.

The consuming container has to then include the dependency. It defines the name of the module,
same as the dependency. Additionally, it provides the `remotes` property, which defines the
alias of the dependency, with which we can refer to it in the container project. In our example 
it is the `products` object key. It then defines the target from which the code is got. The source
is in the format of `<definedProjectNameInTheDependency>@<projectDeployedDomain>/<definedFileNameInDependency>`.
So the example in our project is 
`nameOfTheProductsProject@http://localhost:8081/listOfFilesThatAreAvailableFromThisProjectAndDirectionsOnHowToLoadThem.js`.
This is because we defined the `name` property in our dependency as `nameOfTheProductsProject`. We had it deployed on
`http://localhost:8081` and the `filename` property in our dependency as 
`listOfFilesThatAreAvailableFromThisProjectAndDirectionsOnHowToLoadThem.js`.

The common `filename` used is `remoteEntry.js`.

Now when the consuming container wants to actually add it, it has to separate it with an async call. This allows us to 
tell Webpack that it has to get some code that has to queried from an external source. You can have either
your own file that you call async. In our example `import ('./bootstrap');` from `index.js`. Then we can add the external
dependency as a regular sync import. This would add easier handling for the dependency if we want to add our custom logic.
Alternatively, we can add a direct async import to the external dependency, thus not needing the middle layer of our own
file, so `import ('products/AliasForExposedIndexFileFromProducts');` from `index.js`.

![alt text](module_federation_connections.PNG)

So the entire execution flow looks like this.

1. When we open up the container app, then `main.js` is loaded an executed.
2. `main.js` contains a line that says we need to asynchronously get `bootstrap.js` and execute it.
3. It then sees that `bootstrap.js` requires a file from the `products` project. It fetches 
`listOfFilesThatAreAvailableFromThisProjectAndDirectionsOnHowToLoadThem.js` to figure out how to fetch that required file.
4. The file tells our app that it requires `fileNameToExposeInProducts.js` and the `faker.js` dependency.
5. Get both of those, fetch and execute `bootstrap.js`.

We can define shared modules in the module federation plugin, so that every dependency wouldn't try to load their own
copies of large dependencies that are being used by both of the dependencies. Can use the `shared` property for it.
This, however, causes a problem in the module itself, as setting a dependency as shared marks it for async loading.
So we need the same kind of async importing as we did with the container's `bootstrap.js`. In order for sharing to
work the entry filenames have to be the same, otherwise multiple copies of the same library are loaded. Additionally,
for sharing to work the dependency versions have to be the same or the dependencies have to be declared in a manner
that allows for reuse. That is, if a caret is added, then the major versions have to match for sharing, but if the minor
version differs, then reuse is still allowed. So the version generalization that you define inside of `package.json` is
respected. The basic example works here `shared: ['faker']`. 

If you need more control over how the dependencies are shared, then you have to use a different structure. For example,
with React you cannot load multiple versions at the same time, so you'd always want a single version of React to be loaded.
Can specify a singleton in that case. If you have different sub-projects defining different rules for a singleton dependency
version, then you'd get a `Unsatisfied version ... of shared singleton module ... (required ...)` warning in the console.
When running in isolation, it doesn't matter, these issues start showing up in the container.

When you assign an ID to an element in the DOM, then that DOM element will be assigned to a variable with that ID's name
in the browser as a global variable. If you have a global variable with the same name already, then you're going to
have a clash. For example if you name your dependency project the same as a node, then that project variable will be
overwritten by that element with the ID. When looking at the `remoteEntry.js` file, then you can see that at the top of it
a global variable is declared with the name that is defined in the dependency webpack file.

The node_modules dependency file that is spat out by the sub-project has a name that will not necessarily contain all of
the dependencies. This does not mean that the dependencies are not in it.

As we navigate between components, then CSS might be loaded. This means that if there are global rules, then they will get
activated when rendering this new component and the rules will stay active. So when you go back to the initial component,
then you might be seeing things you do not expect. Have to scope the CSS to avoid it. The two main ways of scoping are:
* CSS-in-JS
* Scoping - have a top parent class and then prefix all of the CSS rules with that. E.g. most parent div with 
`class="pricing-app"`, so the CSS rules would be `.pricing-app h1 { color: purple; }`

CSS-in-JS introduces an issue with micro frontends. When they are built for production, then the class names are minimized.
jss1, jss2 etc. This is done inside of our app. If we have multiple apps that only get connected during runtime, then 
the minimized classes have already been made and the chance of a collision is high as each app has jss1, jss2 etc. Can fix
this by adding custom prefixes.

In our app we use a browser router at the top level and memory router at the sub apps. This is because our sub apps might
not use React and their history implementation might be different, thus it might cause race conditions.

Nested routes cause us issues when we have defined an output without a public path. It replaces the part after the last
slash. `localhost:8082/auth/signin` -> `localhost:8082/auth/main.js`. We could add a public path of slash, but that 
would cause us problems with micro frontends, as it'd try to load the main from the current domain, which is not the 
domain of the micro frontend, but the container. If we don't set a publicPath, then scripts loaded from the remoteEntry.js
file are relative to the URL that we loaded remoteEntry.js from.

**Important takeaways**
* Your requirements drive your architecture - there are multiple different ways of structuring the app.
* Always ask yourself "if I have to change this in the future, will I have to change another app?"
* Everyone will eventually forget React
* Don't forget to scope your CSS
* MFEs might cause issues in production that you don't see in dev