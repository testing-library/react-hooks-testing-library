import React from 'react'
import { useState, createContext, useContext, useMemo } from 'react'
import { testHook, cleanup, act } from 'src'

describe('custom hook tests', () => {
  const themes = {
    light: { primaryLight: '#FFFFFF', primaryDark: '#000000' },
    dark: { primaryLight: '#000000', primaryDark: '#FFFFFF' }
  }

  const ThemesContext = createContext(themes)

  const useTheme = (initialTheme) => {
    const themes = useContext(ThemesContext)
    const [theme, setTheme] = useState(initialTheme)
    const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }
    return useMemo(() => ({ ...themes[theme], toggleTheme }), [theme])
  }

  afterEach(cleanup)

  test('should use theme', () => {
    const { result } = testHook(() => useTheme('light'))

    const theme = result.current

    expect(theme.primaryLight).toBe('#FFFFFF')
    expect(theme.primaryDark).toBe('#000000')
  })

  test('should update theme', () => {
    const { result } = testHook(() => useTheme('light'))

    const { toggleTheme } = result.current

    act(() => toggleTheme())

    const theme = result.current

    expect(theme.primaryLight).toBe('#000000')
    expect(theme.primaryDark).toBe('#FFFFFF')
  })

  test('should use custom theme', () => {
    const customThemes = {
      light: { primaryLight: '#AABBCC', primaryDark: '#CCBBAA' },
      dark: { primaryLight: '#CCBBAA', primaryDark: '#AABBCC' }
    }

    const wrapper = ({ children }) => (
      <ThemesContext.Provider value={customThemes}>{children}</ThemesContext.Provider>
    )

    const { result } = testHook(() => useTheme('light'), { wrapper })

    const theme = result.current

    expect(theme.primaryLight).toBe('#AABBCC')
    expect(theme.primaryDark).toBe('#CCBBAA')
  })
})
