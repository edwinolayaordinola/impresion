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
                html2canvas($('#map'), {  
                    onrendered: function (canvas) {
                        var canvasImg = canvas.toDataURL("image/png");
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = canvasImg;
                        a.download = 'reporte.png';
                        document.body.appendChild(a);
                        a.click();
                    }
                });
            });
            $("#item-jpg").click(function(){
                html2canvas($('#map'), {
                    onrendered: function (canvas) {
                        var canvasImg = canvas.toDataURL("image/jpg");
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = canvasImg;
                        a.download = 'reporte.jpg';
                        document.body.appendChild(a);
                        a.click();
                    }
                });
            });
            $("#item-pdf").click(function(){
                alert("En implementación")
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
            filterFeatureLayer(layer_sed_superv, url_sed_superv, 1);
            filterFeatureLayer(layer_tramo_superv, url_tramo_superv);
            filterFeatureLayer(layer_uap_superv, url_uap_superv);
            map.add(layer_sed_superv);
            map.add(layer_tramo_superv);
            map.add(layer_uap_superv);
            function createFeatureLayer(url_sed_superv){
                let layer_sed_superv = new FeatureLayer({
                    url: url_sed_superv,
                    title: "SED",
                    outFields: ["*"],
                    definitionExpression: where
                });
                return layer_sed_superv;
            }
            function filterFeatureLayer(layer_sed_superv, url, index){
                const query = new Query();
                query.where = where;
                query.outSpatialReference = { wkid: 4326 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                layer_sed_superv.queryFeatures(query).then(results => {
                    // prints the array of features to the console
                    quantityRecords = results.features.length;
                    createLegend(url, quantityRecords);
                    if (results.features.length == 0) {
                        return;
                    }
                    if (index == 1)
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
            function createLegend(url_sed_superv, quantity){                
                $.getJSON(url_sed_superv+"?f=json", function( data ) {
                    let renderer = data.drawingInfo.renderer;
                    let $divLegend = $("#legend");
                    let $div = $divLegend.append("<div class='row mt-2'></div>");
                    $div = $div.find('>div:last');
                    $div.append("<span> "+ data.name +" ("+quantity+") </span>");
                    if (renderer.type =="simple" && renderer.symbol.type != "esriSLS")
                        $div.append("<span><img class='image-legend' src=data:"+renderer.symbol.contentType+";base64,"+renderer.symbol.imageData+"></span>");
                    else if (renderer.type =="uniqueValue")
                        renderer.uniqueValueInfos.forEach( data2 => {
                            $div.append("<span><img class='image-legend' src=data:"+data2.symbol.contentType+";base64,"+data2.symbol.imageData+"></span>");
                        })
                    else if (renderer.type =="simple" && renderer.symbol.type == "esriSLS")
                        $div.append("<span></span>");
                });
            }
            
        });
    });