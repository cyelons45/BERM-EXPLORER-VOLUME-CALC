var map, view, graphicsLayer, activeGraphic, graphicsLayerLine, layer_1, layer_2, layer_3, layerList, legend, state, active_transact, pointGraphic, container
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Legend",
    "esri/geometry/Point",
    "esri/widgets/Print",
    "esri/tasks/PrintTask",
    "esri/tasks/support/PrintTemplate",
    "esri/tasks/support/PrintParameters"
    // "esri/geometry/geometryEngine"
], function(Map, MapView, FeatureLayer, GraphicsLayer, Graphic, QueryTask, Query, BasemapToggle, Legend, Point, Print, PrintTask, PrintTemplate, PrintParameters) {

    map = new Map({
        basemap: "satellite"
    });

    view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-79.47034228448162, 33.00128049734469], // longitude, latitude
        zoom: 9
    });

    var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "streets"
    });

    view.ui.add(basemapToggle, "top-right");



    // var print = new Print({
    //     view: view
    // });
    // // Adds widget below other elements in the top left corner of the view
    // view.ui.add(print, {
    //     position: "top-left"
    // });






    state = []
        // state.graph = 'Up'
    state.transact_points = 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/0'
    state.selected__year = '2014'


    var beachPoints = new FeatureLayer({
        url: `https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/5`,
        outFields: '*'
    });
    map.add(beachPoints);

    // 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/6'


    let selected_2014_Layers = [

        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/2', //transact
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/1', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/3', //gaps

    ]

    let selected_2015_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/8', //transact
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/7', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/9', //gaps

    ]

    let selected_2016_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/13', //transact
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/12', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/14', //gaps

    ]

    let selected_2017_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/17', //transact
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/16', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/18', //gaps

    ]

    let selected_2018_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/21', //transact
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/20', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/22', //gaps
    ]

    // let selected_2019_Layers = [

    //     'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/8',//transact
    //     'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/7',//overLcontig
    //     'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/9',//gaps

    // ]

    layerList = [layer_1, layer_2, layer_3]

    drawLayers(selected_2014_Layers)
    document.querySelector('.year-2014').style.background = '#F05C5A';

    function drawLayers(year) {
        for (let i = 0; i < 3; i++) {
            layerList[i] = new FeatureLayer({
                url: year[i],
                outFields: '*'
            });
            map.add(layerList[i]);
        }


        if (!legend) {
            legend = new Legend({
                view: view
            });
            view.ui.add(legend, "bottom-right");

        } else {
            view.ui.remove(legend);
            legend = new Legend({
                view: view
            });
            view.ui.add(legend, "bottom-right");

        }

    }


    view.on("click", function(event) {

        view.hitTest(event).then(function(response) {

            if (response.results.length) {
                var graphic = response.results.filter(function(result) {

                    return result.graphic.layer === beachPoints || result.graphic.layer === layerList[0];
                })[0].graphic;


                let list = graphic.attributes['NAME'] || graphic.attributes['TRAN_ID'];

                if (list = graphic.attributes['NAME']) {

                    view.whenLayerView(graphic.layer).then(function(layerView) {

                        graphicsLayer.removeAll()

                    })
                    if (graphicsLayerLine) {
                        graphicsLayerLine.removeAll()
                    }


                    var search = new ProcessBerm()

                    var newquery = search.createQuery(list)

                    newquery.queryTask.execute(newquery.query).then(function(results) {

                        search.addPolygonGraphics(results)

                    });
                } else if (list = graphic.attributes['TRAN_ID']) {




                    state.active_transact = list
                        // console.log(state.graph)
                    if (graphicsLayerLine) {
                        graphicsLayerLine.removeAll()
                    }

                    active_transact(list)
                }

            }
        });
    });


    active_transact = function(list) {

        var search = new ProcessBerm()
        var newtranquery = search.createTransactQuery(list)
        var sel_ptquery = search.pointsQuery(list)

        newtranquery.tranqueryTask.execute(newtranquery.tranquery).then(function(results) {
            graphSlideUp()
            search.addLineGraphics(results)

        });

        sel_ptquery.ptqueryTask.execute(sel_ptquery.ptquery).then(function(results) {

            let path = []

            state.transactID = results.features[0].attributes
            for (let i = 0; i < results.features.length; i++) {
                let pointAttribute = results.features[i].attributes

                pointx = pointAttribute["POINT_X"];
                pointy = pointAttribute["POINT_Y"];
                pointelev = pointAttribute["Elevation"];
                pointdist = pointAttribute["DFM"];
                pointstatid = pointAttribute["STATIC_ID"];
                path.push({ lon: pointx, lat: pointy, y: pointelev, x: pointdist, name: `Elevation: ${pointelev} ft`, statid: pointstatid });
            }

            // console.log(path)
            renderElevationProfileChart(path)
        });

    }

    // path.push({ lon: pointx, lat: pointy, y: pointelev, x: pointdist, name: `Elevation: ${pointelev} ft`, statid: pointstatid });

    function renderElevationProfileChart(points) {

        var lowest = 1000000;
        // var data = [];
        // for (var i = 0, l = points.length; i < l; i++) {
        //     // data.push({ x: points[i].miles, y: points[i].elevft, name: points[i].text, lon: points[i].lon, lat: points[i].lat, statid: points[i].statid });
        //     if (points[i].elevft < lowest) lowest = points[i].elevft;
        // }

        // console.log(points)
        //----------------------------------------------------------------------------//
        let data = [];

        function pushdata(points) {
            points.forEach(function(el) {
                data.push({ x: el.x, y: el.y, lon: el.lon, lat: el.lat, statid: el.statid, name: `Elevation:${el.y.toFixed(2)} ft` })
            })
        }
        pushdata(points)

        // console.log(data)
        // `Elevation:${el.y} feet`, lon, lat, statid
        //--------------------------------------------------------------------------------//





        // points.forEach(function(el) {
        //         // let y = el.y;
        //         // let x = el.x;
        //         chart.series.push(el.y)
        //     })
        // console.log(data2)
        // var container = document.querySelector('.graph')
        container = document.getElementById('graph')
            // console.log(container)

        // Highcharts.setOptions({
        //     lang: {
        //         contextButtonTitle: 'Export PNG',
        //     }
        // });

        // console.log(transactID)

        var chart = new Highcharts.Chart({

            // res: `console.log(${data2})`,

            chart: {
                type: 'area',
                backgroundColor: '#006699',
                zoomType: 'x',
                marginBottom: 42,
                renderTo: container
            },


            title: {
                text: `${state.transactID.BEACH}-Transact ${state.transactID.TRAN_ID}, Collected ${state.transactID.COL_DATE}`,
                margin: 10,
                style: {
                    color: '#FFFFFF',
                    fontSize: '12px'
                }
            },
            xAxis: {
                title: {
                    text: 'Distance (ft)',
                    margin: 0,
                    style: {
                        color: '#FFFFFF'
                    }
                },
                labels: {
                    style: {
                        color: '#FFFFFF'
                    }
                },

            },
            yAxis: {
                title: {
                    text: 'Elevation (ft)',

                    style: {
                        color: '#FFFFFF'
                    }
                },
                labels: {
                    style: {
                        color: '#FFFFFF'
                    }
                },
                tickInterval: 5,
                // min: lowest,
                allowDecimals: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                crosshairs: [true, false],
                formatter: function() {
                    return this.point.name
                }
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,

                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                },
                series: {
                    turboThreshold: 0,
                    point: {
                        events: {
                            mouseOver: function() {
                                var point = new Point(this.lon, this.lat);
                                var simpleMarkerSymbol = {
                                    type: "simple-marker",
                                    color: [255, 0, 0],
                                    outline: {
                                        color: [0, 0, 0],
                                        width: 2
                                    }
                                };

                                pointGraphic = new Graphic({
                                    geometry: point,
                                    symbol: simpleMarkerSymbol
                                });
                                if (point) {
                                    view.graphics.removeAll(pointGraphic);
                                    view.graphics.add(pointGraphic);
                                }
                            },
                            click: function() {
                                var point = this;
                                var xValue = point.x;
                                var xAxis = point.series.xAxis;
                                var myPlotLineId;
                                // printchart.xAxis[0].removePlotLine('myPlotLineId');

                                xAxis.addPlotLine({
                                    value: xValue,
                                    width: 2,
                                    color: 'red',
                                    zIndex: 3,
                                    id: 'myPlotLineId'
                                });

                            }




                        }
                    },
                    events: {
                        mouseOut: function() {
                            view.graphics.removeAll(pointGraphic);
                        }
                    },
                    // events: {
                    //     click: function() {
                    //         console.log('hey')
                    //     }
                    // },

                }
            },

            // series: [],
            series: [{ name: 'Elevation', data: data, color: '#ddcbbb', negativeFillColor: '#99d0f3' }],
            // series: (function() {
            //         return points.forEach((el) => [el.x, el.y])

            //     })()
            // series: [{ name: 'Elevation', data: data2, color: '#FFFFFF', negativeFillColor: '#99d0f3' }],
            // res: `console.log(${data})`,

            // exporting: {
            //     buttons: {
            //         contextButton: {
            //             menuItems: null,
            //             onclick: function() {
            //                 save_chart($('#elevationgraph').highcharts(), 'chart');
            //             }
            //         }
            //     }
            // }

        });


        // console.log(chart.series)
        //    $('#save_btn').click(function() {
        //        save_chart($('#elevationgraph').highcharts(), 'chart');
        //    });


        // if (!dijit.byId("footer")._showing) {
        //     toggleChartHeight();
        // }

        // ShowPrint();

    }

    function graphSlideUp() {
        $(document).ready(function() {
            $('.chart').slideDown(1000)
            state.graph = 'Up'

        })
    }

    function graphSlidedown() {
        $(document).ready(function() {
            $('.chart').slideUp(1000)
        })
    }


    view.on("pointer-move", function(event) {
        let search = new ProcessBerm()
        search.findNearestGraphic(event)
    });


    class ProcessBerm {
        constructor() {
            this.item = []
        }
        createTransactQuery(list) {



            var pointUrl = `https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/${layerList[0].layerId}`;
            var tranqueryTask = new QueryTask({
                url: pointUrl
            });

            var tranquery = new Query();
            tranquery.returnGeometry = true;
            tranquery.outFields = ["*"];
            tranquery.where = `TRAN_ID='${list}'`;
            this.tranquery = tranquery;
            this.tranoutFields = tranquery.outFields
            this.tranqueryTask = tranqueryTask;
            return {
                tranquery: this.tranquery,
                tranqueryTask: this.tranqueryTask

            }


        }
        createQuery(list) {
            var pointUrl = "https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/4";
            var queryTask = new QueryTask({
                url: pointUrl
            });

            var query = new Query();
            query.returnGeometry = true;
            query.outFields = ["*"];
            query.where = `NAME='${list}'`;
            this.query = query;
            this.outFields = query.outFields
            this.queryTask = queryTask;
            return {
                query: this.query,
                queryTask: this.queryTask

            }

        }
        pointsQuery(TRAN_ID) {
            var pointUrl = `${state.transact_points}`;
            var ptqueryTask = new QueryTask({
                url: pointUrl
            });

            var ptquery = new Query();
            ptquery.returnGeometry = true;
            ptquery.outFields = ["*"];
            ptquery.where = `TRAN_ID='${TRAN_ID}'`;
            this.ptquery = ptquery;
            this.outFields = ptquery.outFields
            this.ptqueryTask = ptqueryTask;

            return {
                ptquery: this.ptquery,
                ptqueryTask: this.ptqueryTask

            }

        }

        findNearestGraphic(event) {
            return view.hitTest(event).then(function(response) {
                var graphic;

                if (response.results.length) {
                    graphic = response.results.filter(function(result) {
                        return (result.graphic.layer === layerList[0] || beachPoints);
                    })[0].graphic;
                }
                if (graphic) {
                    if (!activeGraphic || (activeGraphic.attributes.OBJECTID !== graphic.attributes.OBJECTID)) {
                        $('#viewDiv').css('cursor', 'pointer')
                    } else {
                        $('#viewDiv').css('cursor', 'default')
                    }
                } else {
                    $('#viewDiv').css('cursor', 'default')
                }
            });

        }
        addPolygonGraphics(results) {
            graphicsLayer = new GraphicsLayer();
            map.add(graphicsLayer);

            results.features.forEach(function(feature) {

                var g = new Graphic({
                    geometry: feature.geometry,
                    attributes: feature.attributes,
                    symbol: {
                        type: "simple-fill",
                        rings: feature.geometry.rings,
                        color: [227, 139, 79, 0.8],
                        style: "none",
                        outline: {
                            color: [0, 255, 255],
                            width: 6
                        }
                    },

                });
                graphicsLayer.add(g);
                view.goTo(g)
            });
        }
        addLineGraphics(results) {
            graphicsLayerLine = new GraphicsLayer();
            map.add(graphicsLayerLine);
            results.features.forEach(function(feature) {

                var gl = new Graphic({
                    geometry: feature.geometry,
                    attributes: feature.attributes,
                    symbol: {
                        type: "simple-line",
                        paths: feature.geometry.paths,
                        color: [203, 236, 15, 0.6],
                        width: 10,
                    },

                });
                graphicsLayerLine.add(gl);
                view.goTo(gl)
            });
        }

    }


    let t = document.querySelector('.nav').addEventListener('click', function(e) {
        let list = e.target.closest('.b-list')
        let down = e.target.closest('.b-down')
        let print = e.target.closest('#print')
        if (list) {
            var search = new ProcessBerm()
            var newquery = search.createQuery(list.innerHTML)
            SlideDownVolumeBtn()
            if (graphicsLayer) {
                graphicsLayer.removeAll();

            }

            if (graphicsLayerLine) {
                graphicsLayerLine.removeAll()
            }
            if (state.graph === 'Up') {
                graphSlidedown()
                state.graph = 'Down'
                container.innerHTML = "";

            }


            document.querySelector('.btn__calculator').classList.remove('btn__calculator-active')


            newquery.queryTask.execute(newquery.query).then(function(results) {

                search.addPolygonGraphics(results)

            });

        } else if (down) {

        } else if (print) {

            var printTask = new PrintTask({
                // printServiceUrl: "https://www.example.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
            });
            var template = new PrintTemplate({
                format: "pdf",
                exportOptions: {
                    dpi: 300
                },
                layout: "a4-portrait",
                layoutOptions: {
                    titleText: "Warren Wilson College Trees",
                    authorText: "Sam"
                }
            });

            var params = new PrintParameters({
                view: view,
                template: template
            });

            printTask.execute(params).then(printResult, printError);
            // console.log(window.location)

            // let chrt = document.getElementById('toggle-chart').classList.toggle('close-chart')

            // console.log(chrt)

        }


    })






    document.querySelector('.chart-head').addEventListener('click', function(e) {
        let close__btn = e.target.closest('.btn__close');
        let volume__calculator_btn = e.target.closest('.btn__calculator');
        let year__selection = e.target.closest('.btn__year');
        if (year__selection) {
            let y = document.querySelectorAll('.btn__year').forEach(function(el) {
                el.style.background = 'none';

            })
            document.querySelector(`.${year__selection.classList[1]}`).style.background = '#F05C5A';
            let Year = selected__year = year__selection.classList[1].split('-')[1]
            if (Year === '2014') {
                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }
                state.selected__year = Year

                state.transact_points = 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/0'
                drawLayers(selected_2014_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2015') {

                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }
                state.selected__year = Year,

                    state.transact_points = 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/6'
                drawLayers(selected_2015_Layers)
                active_transact(state.active_transact)
            } else if (Year === '2016') {
                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }
                state.selected__year = Year
                state.transact_points = 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/11'
                drawLayers(selected_2016_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2017') {

                layerList.forEach(function(el) {
                    map.remove(el)

                })
                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }
                state.selected__year = Year
                state.transact_points = 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/15'
                drawLayers(selected_2017_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2018') {
                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }
                state.selected__year = Year
                state.transact_points = 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/19'
                drawLayers(selected_2018_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2019') {
                layerList.forEach(function(el) {
                    map.remove(el)

                })
                state.selected__year = Year
                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }

                // state.selected__year = Year
                // state.transact_points='https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/19'
                // drawLayers(selected_2019_Layers)
                // active_transact(state.active_transact)




            }



        } else if (volume__calculator_btn) {
            volume__calculator_btn.classList.toggle('btn__calculator-active')
            toggleVolumeBtn()

        } else if (close__btn) {
            SlideDownVolumeBtn()
                // console.log(close__btn)
            graphSlidedown()
                // togglegraph()
            document.querySelector('.btn__calculator').classList.remove('btn__calculator-active')

        }


    })




});