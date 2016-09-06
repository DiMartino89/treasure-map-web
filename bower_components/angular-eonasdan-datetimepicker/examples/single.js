(function () {
    'use strict';

    angular.module('plunker', ['ae-datetimepicker'])
        .controller('controller', [function () {
            var vm = this;

            vm.date = moment();
            vm.options = {format: "YYYY/MM/DD HH:mm"};

            vm.getTime = function () {
                alert('Selected time is:' + vm.date.format("YYYY/MM/DD HH:mm"))
            };

            vm.addTime = function (val, selector) {
                vm.date = moment(vm.date.add(val, selector));
            };
        }]);
})();