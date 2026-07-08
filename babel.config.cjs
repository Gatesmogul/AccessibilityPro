module.exports = function (api) {
  // Caches the structural Babel configuration mapping based on the active build environment
  api.cache(true);
  
  return {
    // 1. Core Framework Core Compilation Pipeline Preset (Handles Expo Router internally in SDK 52)
    presets: ['babel-preset-expo'],
    
    // 2. Compilation Plugin Matrix Stack
    plugins: [
      // FIX: Removed the deprecated require.resolve('expo-router/babel') plugin

      // Module Resolver for Clean Absolute Paths (No more complex '../../' imports)
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.js',
            '.android.js',
            '.ios.tsx',
            '.android.tsx',
            '.js',
            '.ts',
            '.jsx',
            '.tsx',
            '.json',
          ],
          alias: {
            '@components': './src/components',
            '@constants': './src/constants',
            '@context': './src/context',
            '@screens': './src/screens',
            '@services': './src/services',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],
      // Reanimated Plugin must ALWAYS be declared absolute LAST inside the plugins array matrix
      'react-native-reanimated/plugin',
    ],
  };
};
