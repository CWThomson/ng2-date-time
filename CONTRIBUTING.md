Contributing
------------

1. [How to contribute](#how-to-contribute)
    * [Reporting a bug](#reporting-a-bug)
    * [Writing a pull request](#writing-a-pull-request)
2. [Writing a component](#writing-a-component)
    * [Component declaration](#component-declaration)
    * [Building an example](#building-an-example)
    * [Write some Tests](#write-some-tests)
3. [Documentation](#documentation)

## How to contribute

If you are reading this you probably want to contribute, so thanks! Maintaining an open-source project is hard work and any help is welcome.

### Reporting a bug

If you find a bug, before reporting it, check if it's not [already reported][issues].  

If you're the first one to report it, please, follow those recommendations: 
- Write a clear and precise title
- Write a description which contain a scenario on how to reproduce the bug. Feel free to post a link to [Plunker][plunker]
- You'll never be too precise so don't hesitate to give more informations: OS, browser, ...

### Writing a pull request

Fork the [ng2-date-time][ng2-date-time] project and work on your own fork.  
You have to work on a branch with a clear name (feature/writing-how-to-contribute for example). Prefix your branch by "feature" (for new feature) and "hotfix" (for issue resolving) is a good practice.

When your work is done:
 
- Be sure that all tests pass.
- Squash your commits to one commit and follow those recommandations about [writing good commit message][writing-good-commit-message]
- Build a pull request via github from your yourFork/yourBranch to the ng2-material/master branch
 
### Write some Tests

Don't forget to write tests. Even if it's pretty awesome, it could help to avoid regression in the future.
Follow recommandations about [writing test in angular2][writing-test].
There is an npm script for Test Driven Development: `npm run tdd`, which can be helpful.
When your tests pass and only after that, you can [propose a pull request](#how-to-contribute)



## Documentation
[Writing test in Angular 2][writing-test]

[ng2-date-time]: https://github.com/cwthomson/ng2-date-time/
[issues]: https://github.com/cwthomson/ng2-date-time/issues
[plunker]: https://plnkr.co/edit/?p=catalogue
[writing-good-commit-message]: https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines
[writing-test]: https://medium.com/google-developer-experts/angular-2-unit-testing-with-jasmine-defe20421584#.ymzbmrloz
