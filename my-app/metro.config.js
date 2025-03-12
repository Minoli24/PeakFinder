/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// module.exports = {
//     resolver: {
//       sourceExts: ['jsx', 'js', 'ts', 'tsx'], // Add extensions if needed
//     },
//   };
//  const { getDefaultConfig } = require("expo/metro-config");

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig(__dirname);

//   defaultConfig.resolver.assetExts.push("cjs"); // ✅ Fix for Metro bundler issues

//   return defaultConfig;
// })();

const { getDefaultConfig } = require("expo/metro-config");

module.exports = {
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx"], // Ensure TypeScript and JSX support
  },
  ...getDefaultConfig(__dirname),
};
