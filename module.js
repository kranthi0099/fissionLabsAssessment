var fissionLabs = angular.module('fissionLabs', []);
fissionLabs.controller('appController', ['$scope', '$filter', function ($scope, $filter){

    $scope.submit = function (data) {
        // console.log(data);
        if(data == null || data == undefined){
            alert("plz select file");
        }
        var parsedData = [];
        
        var yearsUnique = [];
        var eachRow = data.split("\n");
        // console.log(eachRow);

        for (let index = 0; index < eachRow.length; index++) {

            var eachElement = eachRow[index].split(",");
            var eachSeriesObject = {};
            eachSeriesObject.name = eachElement[0];
            eachSeriesObject.data = [];
            // console.log(eachSeriesObject);

            for (let j = 1; j < eachElement.length; j++) {
                var element = eachElement[j].split("|");
                yearsUnique.push(element[0]);

                object={
                    name : element[0],
                    y: Number(element[1])
                }
                
                eachSeriesObject.data.push(object);
            }
            // console.log(eachSeriesObject);
            eachSeriesObject.data = $filter('orderBy')(eachSeriesObject.data, 'name');
            parsedData.push(eachSeriesObject);
        }
        // console.log(parsedData);



        yearsUnique = yearsUnique.filter(function (value, index) {
            return yearsUnique.indexOf(value) == index
        });
        yearsUnique = yearsUnique.sort();




        var chartData = Highcharts.chart('chartView', {
                        
            title : {
                text: 'Survey'
            },
            
            xAxis: {
                categories: yearsUnique
            },


            yAxis : {
                title: {
                    text: 'Values'
                }
            },


            legend : {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
            },


            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 1990
                }
            },

            series : parsedData,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
           
        });

    }
    
}]);


fissionLabs.directive('fileReader', function () {
    return{
        scope:{
            fileReader: "="
        },
        link: function (sc, el) {
            el.on('change', function (changeEvent) {
                var files = changeEvent.target.files;
                
                if(files.length){

                    var reader = new FileReader();
                    
                    reader.onload = function (e) {
                        var contents = e.target.result;
                        
                        sc.$apply(function () {
                            sc.fileReader = contents;
                        });

                    };
                    reader.readAsText(files[0]);
                }                
            });
            
        }
    };   
});