angular
  .module('userControllers', ['userServices'])
  .controller('regCtrl', function ($http, $location, $timeout, User) {
    this.regUser = function (regData) {
      var app = this;

      app.failureMsg = false;
      app.successMsg = false;
      app.loading = true;

      User.create(app.regData).then(function (data) {
        console.log(data.data.success);
        console.log(data.data.msg);
        if (data.data.success) {
          app.loading = false;
          app.successMsg = data.data.msg;
          $timeout(function () {
            $location.path('/');
          }, 2000);
        } else {
          app.loading = false;
          app.failureMsg = data.data.msg;
        }
      });
    };
  });
