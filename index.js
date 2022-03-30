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
            urlUtils.addProxyRule({
                urlPrefix: "https://services5.arcgis.com/oAvs2fapEemUpOTy",
                proxyUrl: _proxyurl
            });
            //// URL DE WEB SERVICES
            /*servicio protegio */
            url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/2";
            url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/3";
            /**servicio abierto */
            /*url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/2";
            url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/3";*/
            //cargarDataInit(url_sed_superv);
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
            $("#item-png").click(function(){
                generateDownload({extension:".png", format:"png", title:"ReporteGeneralDeficiencias"});
            });
            $("#item-jpg").click(function(){                
                generateDownload({extension:".jpg", format:"jpg", title:"ReporteGeneralDeficiencias"});
            });
            $("#item-pdf").click(function(){
                generateDownload({extension:".pdf", format:"PDF", title:"ReporteGeneralDeficiencias"});
            });
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
                    zoom: 18
                });
            }
            function createLegend(url_sed_superv, quantity){
                $.getJSON(_proxyurl+"?"+url_sed_superv+"?f=json", function( data ) {
                //$.getJSON(url_sed_superv+"?f=json", function( data ) {
                    let renderer = data.drawingInfo.renderer;
                    let $divLegend = $("#legend");
                    let $div = $divLegend.append("<div class='row mt-2'></div>");
                    $div = $div.find('>div:last');
                    $div.append("<span> "+ data.name +" ("+quantity+") </span>");
                    if (renderer.type =="simple" && renderer.symbol.type != "esriSLS")
                        $div.append("<span><img class='image-legend' src=data:"+renderer.symbol.contentType+";base64,"+renderer.symbol.imageData+"></span>");
                    else if (renderer.type =="uniqueValue")
                        renderer.uniqueValueInfos.forEach( data2 => {
                            console.log(data2);
                            $div.append("<span><img class='image-legend' src=data:"+data2.symbol.contentType+";base64,"+data2.symbol.imageData+">"+data2.value+"</span>");
                        })
                    else if (renderer.type =="simple" && renderer.symbol.type == "esriSLS")
                        $div.append("<span></span>");
                });
            }
            function generateDownload(options){
                let style = $('#map').attr("style");
                let _mapId = "xxxxxxxxxxxxx";
                let canvas = $('#map').find('canvas')[0];
                let image = canvas.toDataURL("image/jpeg", 1);
                let $canvas = $('#map').find('canvas');
                let $mapClone = $('#map').clone().insertBefore($('#map'));
                $canvas = $mapClone.find('canvas');
                let $image = $('<img class="img-fluid" />').insertBefore($canvas);
                $image.attr("src", image);
                this.setTimeout(() => {
                    let $container = $('body').find(`#${_mapId}`);
                    if ($container.length === 0)
                        $container = $(`<div id="${_mapId}"></div>`).appendTo($('body'));
                    $container.addClass("position-absolute");
                    $container.css({ opacity: 0.1 });
                    options.container = $container;
                    this.setTimeout(() => {
                        createMap($container, {map: image}).then(data => {
                            $('#map').css("cssText", style);
                            $mapClone.remove();
                            if (options.extension != ".pdf")
                                generateImage(options);
                            else 
                                generatePDF(options);
                        }).catch(error => {
                            $mapClone.remove();
                        });
                    }, 1000);
                }, 100);
            }
            function generatePDF(options){
                html2canvas(options.container.find('>div'), {
                    onrendered: function (canvas) {
                        var canvasImg = canvas.toDataURL("image/jpg");
                        let pdf = new jsPDF({
                            orientation: 'l'
                        });
                        let width = pdf.internal.pageSize.getWidth();
                        let height = pdf.internal.pageSize.getHeight();
                        var img = new Image();
                        img.src = canvasImg;
                        pdf.addImage(img, 'png', 0, 0, width, height);
                        pdf.save(`${options.title}.pdf`);
                        return true;
                    }
                });
            }
            function generateImage(options){
                html2canvas(options.container.find('>div'), {
                    onrendered: function (canvas) {
                        var canvasImg = canvas.toDataURL("image/"+options.format);
                        const a = document.createElement('a');
                        document.body.appendChild(a);
                        a.style.display = 'none';
                        a.href = canvasImg;
                        a.download = options.title+options.extension;
                        a.click();
                        document.body.removeChild(a);
                        options.container.remove();
                    }
                });
            }
            function createMap($container, parameters) {
                let paper = { width: 210, height: 297, enabled: true };
                let width = Math.round((paper.width / 25.4) * 96);
                let height = Math.round((paper.height / 25.4) * 96);
                let widthContainer = width;
                let heightContainer = height;
                widthContainer = height + 300;
                heightContainer = width + 100;
                let options = { title: 'Mapa', keywords: 'Mapa, Osinergmin', orientation: 0, paper: 'paperId', format: 'format' };
                $container.css({ width: widthContainer, height: heightContainer });
                $container.addClass("d-flex justify-content-center align-items-center");
                $container.empty();
                widthContainer = widthContainer - (10 * 2);
                heightContainer = heightContainer - (10 * 2);
                let $dom = $('<div class="position-relative row"></div>').appendTo($container);
                $dom.css({ width: widthContainer, height: heightContainer });
                let $div = $('<div class="div-legend-total"></div>').appendTo($dom);
                let $img = $('<img crossorigin="anonymous" class="img-fluid" />').appendTo($div);
                let $div2 = $('<div class="div-legend-parcial">'+ $('#legend').clone().html() +'</div>').appendTo($dom);
                $img.css({ width: $dom.outerWidth(true), height: $dom.outerHeight(true) });
                $img.attr("src", parameters.map);
                options.$container = $container;
                return Promise.resolve(options);
            }

            /*function cargarDataInit(_globalidor){
                console.log("init");
                let query = new QueryTask({url: url_sed_superv}); 
                let params  = new Query();
                params.returnGeometry = false;
                params.outFields = ["*"];
                params.where = `1=1`;
                params.returnDistinctValues = true;
                query.execute(params).then(function(response){
                    console.log(response.features);
                });
            }*/
        });
    });