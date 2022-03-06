export default {
  repository: 'https://github.com/ReeceDonovan/cs3305', // project repo
  docsRepository: 'https://github.com/ReeceDonovan/CS3305', // docs repo
  branch: 'master', // branch of docs
  path: '/', // path of docs
  titleSuffix: ' - SREC Docs',
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null, // customizable, you can use algolia for example
//   darkMode: true,
  footer: true,
  footerText: `MIT ${new Date().getFullYear()} © Team 1 CS3305`,
  footerEditOnGitHubLink: true,
  logo: <>
    <svg>...</svg>
    <span>SREC Website Documentation</span>
  </>,
  head: <>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Documentation for the UCC SREC website" />
    <meta name="og:title" content="SREC Website Documentation" />
  </>
}