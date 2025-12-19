import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  // Bug reproduction: with moduleSuffixes including ".native", 
  // the ThemeName type is not exported from config.native.d.ts
  // causing `theme` to have an error type instead of 'light' | 'dark'
  const uniwind = useUniwind();
  const theme = uniwind.theme;
  const selectedTheme = NAV_THEME[theme]; // throws error

  // This line will show type error: can't index NAV_THEME with error-typed theme
  return (
    <ThemeProvider value={selectedTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
