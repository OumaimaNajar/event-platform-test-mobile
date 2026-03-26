module.exports = {
  presets: ['module:@react-native/babel-preset'],  // ← changer ici
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ],
};