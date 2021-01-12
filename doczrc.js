export default {
  title: 'React Hooks Testing Library',
  files: '**/*.{md,mdx}',
  src: 'docs',
  dest: 'site',
  public: './public',
  ignore: ['CODE_OF_CONDUCT.md', 'CONTRIBUTING.md', 'LICENSE.md'],
  htmlContext: {
    favicon: '/public/ram.png'
  },
  themeConfig: {
    mode: 'light',
    logo: {
      src: '/public/ram.png',
      margin: 'auto',
      width: 128
    }
  },
  menu: [
    { name: 'Introduction' },
    { name: 'Installation' },
    { name: 'Usage', menu: ['Basic Hooks', 'Advanced Hooks', 'Server-Side Rendering'] },
    { name: 'API Reference' }
  ]
}
