var map, view, graphicsLayer, activeGraphic, graphicsLayerLine, layer_1, layer_2, layer_3, layerList, legend, state, active_transact
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
    // "esri/geometry/geometryEngine"
], function(Map, MapView, FeatureLayer, GraphicsLayer, Graphic, QueryTask, Query, BasemapToggle, Legend) {

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


    state = []

    var beachPoints = new FeatureLayer({
        url: `https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/5`,
        outFields: '*'
    });
    map.add(beachPoints);

    // 'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/6'


    let selected_2014_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/1', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/3', //gaps
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/2', //transact

    ]

    let selected_2015_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/7', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/9', //gaps
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/8', //transact

    ]

    let selected_2016_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/12', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/14', //gaps
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/13', //transact

    ]

    let selected_2017_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/16', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/18', //gaps
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/17', //transact

    ]

    let selected_2018_Layers = [
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/20', //overLcontig
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/22', //gaps
        'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/21', //transact
    ]

    // let selected_2019_Layers = [
    //     'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/7',//overLcontig
    //     'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/9',//gaps
    //     'https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/8',//transact

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

                    return result.graphic.layer === beachPoints || result.graphic.layer === layerList[2];
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
                    graphSlideUp()
                    state.active_transact = list

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


        newtranquery.tranqueryTask.execute(newtranquery.tranquery).then(function(results) {

            search.addLineGraphics(results)

        });
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



            var pointUrl = `https://giswebtest.dhec.sc.gov/arcgis/rest/services/environment/BERM16A/MapServer/${layerList[2].layerId}`;
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

        findNearestGraphic(event) {
            return view.hitTest(event).then(function(response) {
                var graphic;

                if (response.results.length) {
                    graphic = response.results.filter(function(result) {
                        return (result.graphic.layer === layerList[2] || beachPoints);
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
                        color: [200, 231, 20, 0.5],
                        width: 12,





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

            if (graphicsLayer || graphicsLayerLine) {
                graphicsLayer.removeAll();
                graphicsLayerLine.removeAll()
            }




            newquery.queryTask.execute(newquery.query).then(function(results) {

                search.addPolygonGraphics(results)

            });

        } else if (down) {

        } else if (print) {

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

                drawLayers(selected_2014_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2015') {

                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }

                drawLayers(selected_2015_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2016') {
                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }

                drawLayers(selected_2016_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2017') {

                layerList.forEach(function(el) {
                    map.remove(el)

                })
                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }

                drawLayers(selected_2017_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2018') {
                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }

                drawLayers(selected_2018_Layers)
                active_transact(state.active_transact)

            } else if (Year === '2019') {
                layerList.forEach(function(el) {
                    map.remove(el)

                })

                if (graphicsLayerLine) {
                    graphicsLayerLine.removeAll()
                }

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