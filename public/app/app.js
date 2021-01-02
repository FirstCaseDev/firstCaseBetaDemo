angular
  .module('userApp', [
    'appRoutes',
    'userControllers',
    'userServices',
    'ngAnimate',
    'mainControllers',
    'authServices',
  ])
  .config(() => {
    console.log('Testing angular app');
  });
