let map, view;
let url_sed_superv = "";
let url_tramo_superv = "";
let url_uap_super = "";


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
            console.log(_globalidor);
            codsed = _globalidor.split('=')[1];
            console.log(codsed);
            //urlUtils.addProxyRule({
            //    urlPrefix: "https://services5.arcgis.com/oAvs2fapEemUpOTy",
            //    proxyUrl: _proxyurl
            //});    
            //// URL DE WEB SERVICES
            let quantityRecords=0;
            url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/arcgis/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/2";
            url_uap_super = "https://services5.arcgis.com/oAvs2fapEemUpOTy/arcgis/rest/services/BD_SupervUAP_agol_3/FeatureServer/3";
            // DEFINICIÓN DE FEATURE LAYERS 
            let where = "CODSED = '" + codsed + "'";

            let layer_sed_superv = createFeatureLayer(url_sed_superv);
            //let layer_tramo_superv = new FeatureLayer({
            //    url: url_tramo_superv,
            //    /*where: "1 = 1",*/
            //    title: "TRAMO",
            //    outFields: ["*"],
            //    visible:true,
            //    definitionExpression: "1=1"
            //});
            //let layer_uap_super = new FeatureLayer({
            //    url: url_uap_super,
            //    title: "UAP",
            //    outFields: ["*"],
            //    visible:true,
            //    definitionExpression: "1=1"
            //});
            filterFeatureLayer(layer_sed_superv);
            map.add(layer_sed_superv);
            //map.layers.add(layer_tramo_superv);
            //map.layers.add(layer_uap_super);
            createLegend(url_sed_superv);
            $("#descargar").click(function(){
                console.log("descargar mapa");
            });
            //cargarDataInit(_codsed);
            
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
        });

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

/*function mostrarDepartamento(glob){
    console.log(glob.split('=')[1]);
    $('#div-departamento').text("MOQUEGUA");
}*/

