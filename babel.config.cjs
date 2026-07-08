module.exports = function (api) {
  // Caches the structural Babel configuration mapping based on the active build environment
  api.cache(true);
  
  return {
    // 1. Core Framework Core Compilation Pipeline Preset
    presets: ['babel-preset-expo'],
    
    // 2. Compilation Plugin Matrix Stack
    plugins: [
      // Safe injection of Expo Router compilation configurations
      require.resolve('expo-router/babel'),

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