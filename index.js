let map, view;
let url_sed_superv = "";
let url_tramo_superv = "";
let url_uap_superv = "";


require([
    "esri/core/urlUtils",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/layers/FeatureLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/layers/ImageryLayer",
    "esri/Ground"
    ], (
        urlUtils,
        Map, 
        MapView, 
        BasemapToggle,
        FeatureLayer,
        QueryTask,
        Query,
        ImageryLayer,
        Ground
        ) => {

        _globalidor = '';
        let codsed = '';
        _proxyurl = "https://gisem.osinergmin.gob.pe/ProxyUAP/proxy.ashx";
        $(document).ready(function(){

            $("#item-png").click(function(){
                console.log("png");
            });
            $("#item-jpg").click(function(){
                console.log("jpg");
            });
            $("#item-pdf").click(function(){
                console.log("pdf");
            });
            map = new Map({
                basemap: "hybrid"
            });            
            view = new MapView({
                container: "map",
                map: map,
                center: [-74.049, -8.185],
                zoom: 5
            });
            let urlparams= window.location.search;
            _globalidor = urlparams.substring(1);
            codsed = _globalidor.split('=')[1];
            /*urlUtils.addProxyRule({
                urlPrefix: "https://services5.arcgis.com/oAvs2fapEemUpOTy",
                proxyUrl: _proxyurl
            });*/
            //// URL DE WEB SERVICES
            let quantityRecords=0;
            /*servicio protegio */
            /*url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/2";
            url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/arcgis/rest/services/BD_SupervUAP_agol_3/FeatureServer/3";*/
            /**servicio abierto */
            url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/2";
            url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/3";
            
            // DEFINICIÓN DE FEATURE LAYERS 
            let where = "CODSED = '" + codsed + "'";

            let layer_sed_superv = createFeatureLayer(url_sed_superv);
            let layer_tramo_superv = createFeatureLayer(url_tramo_superv);
            let layer_uap_superv = createFeatureLayer(url_uap_superv);
            filterFeatureLayer(layer_sed_superv);
            filterFeatureTramoLayer(layer_tramo_superv);
            filterFeatureLayer(layer_uap_superv);
            map.add(layer_sed_superv);
            map.add(layer_tramo_superv);
            map.add(layer_uap_superv);
            createLegend(url_sed_superv);
            createLegendTramo(url_tramo_superv);
            //cargarDataInit(url_uap_superv);
            function createFeatureLayer(url_sed_superv){
                let layer_sed_superv = new FeatureLayer({
                    url: url_sed_superv,
                    title: "SED",
                    outFields: ["*"],
                    definitionExpression: where
                });
                return layer_sed_superv;
            }
            function filterFeatureLayer(layer_sed_superv){
                const query = new Query();
                query.where = where;
                query.outSpatialReference = { wkid: 4326 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                layer_sed_superv.queryFeatures(query).then(results => {
                    // prints the array of features to the console
                    quantityRecords = results.features.length;
                    if (results.features.length == 0) {
                        return;
                    }
                    zoomToLayer(results);
                });
            }

            function filterFeatureTramoLayer(layer_sed_superv){
                const query = new Query();
                query.where = where;
                query.outSpatialReference = { wkid: 4326 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                layer_sed_superv.queryFeatures(query).then(results => {
                    // prints the array of features to the console
                    quantityRecords = results.features.length;
                    console.log("quantityRecords : " + quantityRecords + " , " + layer_sed_superv.url);
                    if (results.features.length == 0) {
                        return;
                    }
                });
            }

            function zoomToLayer(results){
                var point = results.features[0];
                view.goTo({
                    center: [point.geometry.x, point.geometry.y],
                    zoom: 12
                });
            }
            function createLegend(url_sed_superv){
                let $div = $("#legend");
                $.getJSON(url_sed_superv+"?f=json", function( data ) {
                    console.log(data);
                    $div.append("<span> "+quantityRecords+"</span>");
                    data.drawingInfo.renderer.uniqueValueInfos.forEach( data => {
                        $div.append("<img src=data:"+data.symbol.contentType+";base64,"+data.symbol.imageData+">");
                    })
                });
            }
            function createLegendTramo(url_tramo_superv){
                let $div = $("#legend");
                $.getJSON(url_tramo_superv+"?f=json", function( data ) {
                    console.log(data);
                    $div.append("<span> "+quantityRecords+"</span>");
                    /*data.drawingInfo.renderer.uniqueValueInfos.forEach( data => {
                        $div.append("<img src=data:"+data.symbol.contentType+";base64,"+data.symbol.imageData+">");
                    })*/
                });
            }

            function cargarDataInit(_globalidor){
                let query = new QueryTask({url: url_sed_superv}); 
                let params  = new Query();
                params.returnGeometry = false;
                params.outFields = ["*"];
                params.where = `1=1`;
                params.returnDistinctValues = true;
                query.execute(params).then(function(response){
                    console.log(response.features);
                });
            }

        });
    });