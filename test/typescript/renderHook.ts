import { useState, createContext, useContext, useMemo } from 'react'
import { renderHook } from 'react-hooks-testing-library'

const DARK: 'dark' = 'dark'
const LIGHT: 'light' = 'light'

type InitialTheme = typeof DARK | typeof LIGHT | undefined

const themes = {
  light: { primaryLight: '#FFFFFF', primaryDark: '#000000' },
  dark: { primaryLight: '#000000', primaryDark: '#FFFFFF' }
}

const ThemesContext = createContext(themes)

const useTheme = (initialTheme: InitialTheme = DARK) => {
  const themes = useContext(ThemesContext)
  const [theme, setTheme] = useState(initialTheme)
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  return useMemo(() => ({ ...themes[theme], toggleTheme }), [theme])
}

function checkTypesWithNoInitialProps() {
  const { result, unmount, rerender } = renderHook(() => useTheme())

  // check types
  const _result: {
    current: {
      primaryDark: string
      primaryLight: string
      toggleTheme: () => void
    }
  } = result
  const _unmount: () => boolean = unmount
  const _rerender: () => void = rerender
}

function checkTypesWithInitialProps() {
  const { result, unmount, rerender } = renderHook(({ theme }) => useTheme(theme), {
    initialProps: { theme: DARK }
  })

  // check types
  const _result: {
    current: {
      primaryDark: string
      primaryLight: string
      toggleTheme: () => void
    }
  } = result
  const _unmount: () => boolean = unmount
  const _rerender: (_?: { theme: typeof DARK }) => void = rerender
}
