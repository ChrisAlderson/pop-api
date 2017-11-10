# Contributing

So you're interested in giving us a hand? That's awesome! We've put together
some brief guidelines that should help you get started quickly and easily.

There are lots and lots of ways to get involved, this document covers:
 - [Raising Issues](#raising-issues)
   - [Report  A Bug](#report-a-bug)
   - [Feature Requests](#feature-requests)
 - [Styleguides](#styleguides)
   - [JavaScript Styleguide](#javascript-styleguide)
   - [Tests Styleguide](#tests-styleguide)
   - [Documentation Styleguide](#documentation-styleguide)

## Raising Issues

If you're about to raise an issue because you think that you've found a problem
with Butter, or you'd like to make a request for a new feature in the codebase,
or any other reason… please read this first.

The GitHub issue tracker is the preferred channel for [bug reports](#report-a-bug),
[feature requests](#feature-requests), [change requests](#change-requests), but
please respect the following restrictions:

* Please **search for existing issues**. Help us keep duplicate issues to a
minimum by checking to see if someone has already reported your problem or
requested your idea.
* Please **do not** use the issue tracker for personal support requests.
* Please **do not** derail or troll issues. Keep the discussion on topic and
respect the opinions of others.

### Report A Bug

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:
1. **Use the GitHub issue search** &mdash; check if the issue has already been reported.
2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
latest `development` or look for [closed issues](https://github.com/popcorn-official/pop-api/issues?q=is%3Aissue+is%3Aclosed).
3. **Include a screencast if relevant** - Is your issue about a design or front
end feature or bug? The most helpful thing in the world is if we can *see* what
you're talking about. Just drop the picture after writing your issue, it'll be
uploaded and shown to the developers.
3. Use the Issue tab on GitHub to start [creating a bug report](https://github.com/popcorn-official/pop-api/issues/new).
A good bug report shouldn't leave others needing to chase you up for more
information. Be sure to include all the possible required details and the steps
to take to reproduce the issue.

### Feature Requests

Feature requests are welcome. Before you submit one be sure to:
1. **Use the [GitHub Issues search](https://github.com/popcorn-official/pop-api/issues)**
and check the feature hasn't already been requested.
2. Take a moment to think about whether your idea fits with the scope and aims
of the project, or if it might better fit being an app/plugin.
3. Remember, it's up to *you* to make a strong case to convince the project's
leaders of the merits of this feature. Please provide as much detail and
context as possible, this means explaining the use case and why it is likely to
be common.
4. Clearly indicate whether this is a feature request for the application
itself, or for packages like Providers, Metadatas, or other.

## Styleguides

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](http://standardjs.com/).

* Inline `export`s with expressions whenever possible
  ```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```

### Tests Styleguide

- Include thoughtfully-worded, well-structured [Mocha](https://mochajs.org/) tests in the `./tests` folder.
- Treat `describe` as a noun or situation.
- Treat `it` as a statement about state or how an operation changes state.

### Documentation Styleguide

 * Use [Markdown](https://daringfireball.net/projects/markdown).
 * Reference methods and classes in markdown with the custom `{}` notation:
   * Reference classes with `{ClassName}`
   * Reference instance methods with `{ClassName.methodName}`
   * Reference class methods with `{ClassName#methodName}`
