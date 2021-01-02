angular
  .module('mainControllers', ['authServices'])

  .controller('mainCtrl', function (Auth, $timeout, $location, $http) {
    var app = this;
    this.doLogin = function (loginData) {
      app.failureMsg = false;
      app.loading = true;

      Auth.login(app.loginData).then(function (data) {
        if (data.data.success) {
          app.loading = false;
          app.successMsg = data.data.msg + '... Redirecting';
          $timeout(function () {
            $location.path('/about');
          }, 2000);
        } else {
          app.loading = false;
          app.failureMsg = data.data.msg;
        }
      });
    };
  });
