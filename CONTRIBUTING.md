# Contributing

Thanks for wanting to make contribution and wanting to improve this library for everyone!

## Project setup

1.  Fork and clone the repo
2.  Run `npm install` to install dependencies
3.  Create a branch for your PR with `git checkout -b pr/your-branch-name`

## Add yourself as a contributor

This project follows the [all contributors](https://github.com/kentcdodds/all-contributors)
specification. To add yourself to the table of contributors on the `README.md`, please use the
automated script as part of your PR:

```console
npm run contributors:add
```

Follow the prompt and commit `.all-contributorsrc` and `README.md` in the PR. If you've already
added yourself to the list and are making a new type of contribution, you can run it again and
select the added contribution type.

## Committing and Pushing changes

Please make sure to run the tests before you commit your changes. You can do so by running
`npm test`.

### Add typings

If your PR introduced some changes in the API, you are more than welcome to modify the Typescript
type definition to reflect those changes. Just modify the `index.d.ts` file accordingly. If you have
never seen Typescript definitions before, you can read more about it in its
[documentation pages](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

## Help needed

Please checkout the
[the open issues](https://github.com/testing-library/react-hooks-testing-library/issues)

Also, please watch the repo and respond to questions/bug reports/feature requests! Thanks!
