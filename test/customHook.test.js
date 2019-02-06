import { useState, createContext, useContext, useMemo } from 'react'
import { useHook, cleanup } from 'src'

describe('custom hook tests', () => {
  const themes = {
    light: { primaryLight: '#FFFFFF', primaryDark: '#000000' },
    dark: { primaryLight: '#000000', primaryDark: '#FFFFFF' }
  }

  const ThemesContext = createContext(themes)

  const useTheme = (initialTheme) => {
    const themes = useContext(ThemesContext)
    const [theme, setTheme] = useState(initialTheme)
    const changeTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }
    return useMemo(() => ({ ...themes[theme], changeTheme }), [theme])
  }

  afterEach(cleanup)

  test('should get initial theme from custom hook', () => {
    const { getCurrentValue } = useHook(() => useTheme('light'))

    const theme = getCurrentValue()

    expect(theme.primaryLight).toBe('#FFFFFF')
    expect(theme.primaryDark).toBe('#000000')
    expect(typeof theme.changeTheme).toBe('function')
  })

  test('should update theme using custom hook', () => {
    const { getCurrentValue, act } = useHook(() => useTheme('light'))

    const { changeTheme } = getCurrentValue()

    act(() => changeTheme())

    const theme = getCurrentValue()

    expect(theme.primaryLight).toBe('#000000')
    expect(theme.primaryDark).toBe('#FFFFFF')
    expect(typeof theme.changeTheme).toBe('function')
  })

  test('should get custom theme from custom hook', () => {
    const customThemes = {
      light: { primaryLight: '#AABBCC', primaryDark: '#CCBBAA' },
      dark: { primaryLight: '#CCBBAA', primaryDark: '#AABBCC' }
    }

    const { getCurrentValue, addContextProvider } = useHook(() => useTheme('light'))

    addContextProvider(ThemesContext, { value: customThemes })

    const theme = getCurrentValue()

    expect(theme.primaryLight).toBe('#AABBCC')
    expect(theme.primaryDark).toBe('#CCBBAA')
    expect(typeof theme.changeTheme).toBe('function')
  })
})
