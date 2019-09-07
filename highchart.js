// function plotgrapth(data) {

//     let graph = document.querySelector('.graph')
//     console.log(graph)
//     var options = {
//         chart: {
//             renderTo: graph,
//             type: 'area'
//         },
//         title: {
//             text: 'Mobile App usage'
//         },
//         xAxis: {
//             categories: []
//         },
//         yAxis: {
//             title: {
//                 text: 'Unique app start'
//             }
//         },
//         series: [{}]

//     };


// function getPoints(data) {


//     var series = {
//         data: []
//     };

//     data.forEach(function(el) {
//         series.push(el.y)
//     })
//     options.series.push(series);
//     // console.log(series)

// };
// getPoints(data)


// var chart = new Highcharts.Chart(options);
// console.log(chart)

// }



// $.each(data, function(x, y) {
//     console.log(y)
//         // series.data.push((y));

//     // if (itemNo == 0) {
//     //     series.name = item;
//     // } else {
//     //     series.data.push(parseFloat(item));
//     // }
// });

// options.series.push(series);













// function plotgrapth(data) {
//     $('.graph').highcharts({


//         chart: {
//             type: 'area',
//             // backgroundColor: '#416999',
//             // zoomType: 'x',
//             // marginBottom: 42,
//             // renderTo: containerid
//         },


//         title: {
//             text: CRT_TXT,
//             margin: 10,
//             style: {
//                 color: '#FFFFFF',
//                 fontSize: '12px'
//             }
//         },
//         xAxis: {
//             title: {
//                 text: 'Distance (ft)',
//                 margin: 0,
//                 style: {
//                     color: '#FFFFFF'
//                 }
//             },
//             labels: {
//                 style: {
//                     color: '#FFFFFF'
//                 }
//             }
//         },
//         yAxis: {
//             title: {
//                 text: 'Elevation (ft)',

//                 style: {
//                     color: '#FFFFFF'
//                 }
//             },
//             labels: {
//                 style: {
//                     color: '#FFFFFF'
//                 }
//             },
//             tickInterval: 5,
//             min: lowest,
//             allowDecimals: false
//         },
//         credits: {
//             enabled: false
//         },
//         series: [{ name: 'Elevation', data: data, color: '#ddcbbb', negativeFillColor: '#99d0f3' }],
//     });

// }