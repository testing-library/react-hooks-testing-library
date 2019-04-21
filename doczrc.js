export default {
  files: '**/*.{md,mdx}',
  dest: 'site',
  public: './other',
  ignore: ['CODE_OF_CONDUCT.md', 'CONTRIBUTING.md', 'LICENSE.md'],
  htmlContext: {
    favicon: '/public/ram.png'
  },
  themeConfig: {
    mode: 'dark',
    logo: {
      src: '/public/ram.png',
      margin: 'auto',
      width: 128
    }
  },
  menu: [
    { name: 'Getting Started' },
    { name: 'Usage', menu: ['Basic Hooks', 'Advanced Hooks', 'Async Hooks'] },
    { name: 'Examples' },
    { name: 'Reference', menu: ['FAQ', 'Troubleshooting', 'API'] }
  ]
}
