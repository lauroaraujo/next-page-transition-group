# next-page-transition-group
CSS page transitions for Next.js with react-transition-group.

This package is heavily inspired by [next-page-transitions](https://github.com/illinois/next-page-transitions/).

## Why not use `next-page-transitions`
`next-page-transitions` works very well for most cases, but:
- It hasn't been updated in months, and is still marked as beta.
- Its dependencies are a bit out-of-date, and `react-transition-group` is not a peer dependency.
If you want to use `react-transition-group` in your app, you'll likely end up with 2 versions of it.
- It renders pages based on changes to the page component, not the route. This means that the
animation does not start until NextJS completes the route change, i.e.: when the source code
for the next page has already been fetched, causing a slight delay.
- It does not have native typescript support.

## Why not use this library
As of now, `next-page-transition-group` **is not production ready**, and
`next-page-transitions` has more features.

## Roadmap
- [ ] Add tests
- [ ] Setup CI with github actions
- [ ] Support delayed with loading animation callback.
- [ ] Support all use-cases under `next-page-transitions/examples` folder.
