
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add viewport meta tag for mobile responsiveness
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
document.getElementsByTagName('head')[0].appendChild(meta);

// Add theme color meta for browser UI on mobile
const themeColor = document.createElement('meta');
themeColor.name = 'theme-color';
themeColor.content = '#ffffff';
document.getElementsByTagName('head')[0].appendChild(themeColor);

// Add apple-mobile-web-app-capable meta for iOS
const appleMobileWebAppCapable = document.createElement('meta');
appleMobileWebAppCapable.name = 'apple-mobile-web-app-capable';
appleMobileWebAppCapable.content = 'yes';
document.getElementsByTagName('head')[0].appendChild(appleMobileWebAppCapable);

createRoot(document.getElementById("root")!).render(<App />);
