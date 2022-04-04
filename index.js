let map, view;
let url_sed_superv = "";
let url_tramo_superv = "";
let url_uap_superv = "";
let where = "";
let where2 = "";
let layer_uap_codsed_superv = "";
let layer_sed_superv = "";
let layer_tramo_superv = "";
let layer_uap_superv = "";
let _globalidor = "",codsed = "", id_or="";
let layer_codsed  ="";

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

        _proxyurl = "https://gisem.osinergmin.gob.pe/ProxyUAP/proxy.ashx";
        _proxyurl = "";
        $(document).ready(function(){
            map = new Map({
                basemap: "osm"
            });
            view = new MapView({
                container: "map",
                map: map,
                center: [-74.049, -8.185],
                zoom: 5
            });
            let urlparams= window.location.search;
            _globalidor = urlparams.substring(1);
            id_or = _globalidor.split('=')[1];
            $("#div-departamento").text(getNombre(parseInt(id_or)));

            //*URL DE WEB SERVICES*/
            /*servicio protegio */
            //url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/0";
            /*comentar para desarrollo */
            /*urlUtils.addProxyRule({
                urlPrefix: "https://services5.arcgis.com/oAvs2fapEemUpOTy",
                proxyUrl: _proxyurl
            });*/
            
            //// URL DE WEB SERVICES
             /*servicio protegio */
            /*url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/2";
            url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/3";*/
            /**servicio abierto */
            url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/2";
            url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2/FeatureServer/3";
            where = "ID_OR = '" + id_or + "'";
            let layerSed = {
                index: 0,
                url : url_sed_superv,
                title: "SED"
            };
            let layerTramo = {
                index: 1,
                url : url_tramo_superv,
                title: "TRAMO"
            };
            let layerUAP = {
                index: 2,
                url : url_uap_superv,
                title: "UAP"
            };
            // DEFINICIÓN DE FEATURE LAYERS
            layer_sed_superv = createFeatureLayer(layerSed, where);
            layer_tramo_superv = createFeatureLayer(layerTramo, where);
            layer_uap_superv = createFeatureLayer(layerUAP, where);
            filterFeatureLayer(layer_sed_superv, layerSed.url);
            filterFeatureLayer(layer_tramo_superv, layerTramo.url);
            filterFeatureLayer(layer_uap_superv, layerUAP.url);
            map.add(layer_sed_superv);
            map.add(layer_tramo_superv);
            map.add(layer_uap_superv);
            llenarSelect(layer_sed_superv);
            $("#selectedCodSed").change(function(){
                clearLeyend();
                codsed  = $("#selectedCodSed").val();
                $("#codigoSed").html("Código de SED :" + codsed);
                filtro_codsed = " CODSED = '" + codsed + "'";
                filterFeatureCodSedLayer(layer_sed_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_tramo_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_uap_superv, filtro_codsed);
            });
            $("#item-png").click(function(){
                generateDownload({extension:".png", format:"png", title:"reporte_general_deficiencias"});
            });
            $("#item-jpg").click(function(){
                generateDownload({extension:".jpg", format:"jpg", title:"reporte_general_deficiencias"});
            });
            $("#item-pdf").click(function(){
                generateDownload({extension:".pdf", format:"PDF", title:"reporte_general_deficiencias"});
            });
            function llenarSelect(layer_sed_superv){
                const query = new Query();
                query.where = where;
                query.returnGeometry = false;
                query.outFields = ["*"];
                query.orderByFields = ["CODSED"];
                let _codseds = [];
                let htmlSelect ="<option value=''>Seleccione</option>";
                layer_sed_superv.queryFeatures(query).then(results => {
                    results.features.forEach(data=>{
                        if(_codseds.indexOf(data.attributes.CODSED)<0){
                            _codseds.push(data.attributes.CODSED)
                        };
                    });
                    _codseds.forEach(elemento=>{
                        htmlSelect += "<option value='"+elemento+"'>"+elemento+"</option>";
                    });
                    $("#selectedCodSed").html(htmlSelect);
                });
            }
            function createFeatureLayer(layer, where){
                let featureLayer = new FeatureLayer({
                    url: layer.url,
                    title: layer.title,
                    index: layer.index,
                    uurl:layer.url,
                    outFields: ["*"],
                    definitionExpression: where
                });
                return featureLayer;
            }
            function filterFeatureLayer(layer){
                const query = new Query();
                query.where = where;
                query.outSpatialReference = { wkid: 4326 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                layer.queryFeatures(query).then(results => {
                    // prints the array of features to the console
                    let values = {};
                    if (layer.index == 2) {
                        results.features.forEach(feature => {
                            let value = values[feature.attributes["ESTADODEFICIENCIA"]];
                            if (value)
                                values[feature.attributes["ESTADODEFICIENCIA"]] = values[feature.attributes["ESTADODEFICIENCIA"]]+1;
                            else 
                                values[feature.attributes["ESTADODEFICIENCIA"]] = 1;
                        });
                    }
                    quantityRecords = results.features.length;
                    quantityRecords = layer.index == 2 ? quantityRecords : 0;
                    createLegend(layer, quantityRecords, values);
                    if (results.features.length == 0) {
                        return;
                    }
                    if (layer.index == 0)
                        zoomToLayer(results);
                });
            }
            function filterFeatureCodSedLayer(layer, _where){
                const query = new Query();
                query.where = _where;
                query.outSpatialReference = { wkid: 4326 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                layer.queryFeatures(query).then(results => {
                    layer.definitionExpression = _where;
                    let values = {};
                    if (layer.index == 2) {
                        results.features.forEach(feature => {
                            let value = values[feature.attributes["ESTADODEFICIENCIA"]];
                            if (value)
                                values[feature.attributes["ESTADODEFICIENCIA"]] = values[feature.attributes["ESTADODEFICIENCIA"]]+1;
                            else 
                                values[feature.attributes["ESTADODEFICIENCIA"]] = 1;
                        });
                    }
                    quantityRecords = results.features.length;
                    quantityRecords = layer.index == 2 ? quantityRecords : 0;
                    createLegend(layer, quantityRecords, values);
                    if (results.features.length == 0) {
                        return;
                    }
                    if (layer.index == 0)
                        zoomToLayer(results, 18);
                });
            }
            function zoomToLayer(results, _zoom){
                _zoom = _zoom || 9;
                var point = results.features[0];
                view.goTo({
                    center: [point.geometry.x, point.geometry.y],
                    zoom: _zoom
                });
            }
            function createLegend(layer, quantity, values){
                _proxyurl = !_proxyurl.endsWith("?") ? _proxyurl : _proxyurl+"?";
                //_proxyurl = _proxyurl+"?";
                $.getJSON(_proxyurl+layer.uurl+"?f=json", data => {
                    let renderer = data.drawingInfo.renderer;
                    let $divLegend = $("#legend");
                    let $div = $divLegend.append("<div class='row mt-2'></div>");
                    $div = $div.find('>div:last');
                    let quantityText = quantity > 0 ? "("+quantity+")" : "";
                    $div.append("<span> "+ layer.title +" "+quantityText+" </span>");
                    if (renderer.type =="simple" && renderer.symbol.type != "esriSLS")
                        $div.append("<span><img class='image-legend' src=data:"+renderer.symbol.contentType+";base64,"+renderer.symbol.imageData+"></span>");
                    else if (renderer.type =="uniqueValue") {
                        if (renderer.defaultSymbol) {
                            let value = 0;
                            if (values[null])
                                value = values[null];
                            else
                                value = values[renderer.field1] || 0;
                            if (renderer.defaultSymbol.type == "esriPMS" ){
                                $div.append("<span><img class='image-legend' src=data:"+renderer.defaultSymbol.contentType+";base64,"+renderer.defaultSymbol.imageData+">"+renderer.defaultLabel+" ("+value+")</span>");
                            }
                            else if (renderer.defaultSymbol.type == "esriSMS" ){
                                //$div.append("<span><img class='image-legend' src="+_createMarkerLegend(renderer.defaultSymbol)+">"+renderer.defaultLabel+" ("+value+")</span>");
                                $div.append("<span>"+_createMarkerLegend(renderer.defaultSymbol)+" "+renderer.defaultLabel+" ("+value+")</span>");
                            }
                        }
                        renderer.uniqueValueInfos.forEach( data2 => {
                            let value = values[data2.value] || 0;
                            $div.append("<span><img class='image-legend' src=data:"+data2.symbol.contentType+";base64,"+data2.symbol.imageData+">"+data2.label+" ("+value+")</span>");
                        })
                    }
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
                        pdf.addImage(img, 'png', -10, 0, 310, height);
                        pdf.save(`${options.title}.pdf`);
                        options.container.remove();
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
                widthContainer = height + 600;
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
            function clearLeyend(){
                $("#legend").empty();
            }
            function _createStrokeLegend(symbol) {
                let canvas = document.createElement("canvas");
                canvas.width = symbol.width;
                canvas.height = symbol.height;
                let context = canvas.getContext("2d");
                context.beginPath();
                //context.fillStyle = `rgb(${rgb.join(',')})`;
                context.strokeStyle = `rgb(${symbol.color.join(',')})`;
                context.lineWidth = canvas.width;
                context.moveTo(0, 0);
                context.lineTo(symbol.width, 0);
                context.stroke();
                let data = canvas.toDataURL();
                canvas.remove();
                return data;
            }
            function _createMarkerLegend(symbol) {
                let canvas = document.createElement("canvas");
                canvas.width = symbol.width;
                canvas.height = symbol.height;
                let context = canvas.getContext("2d");
                context.fillStyle = `rgb(${symbol.color.join(',')})`;
                context.strokeStyle = `rgb(${symbol.outline.color.join(',')})`;
                context.lineWidth = symbol.outline.width * 2;
                context.beginPath();
                context.arc(canvas.width / 2, canvas.height / 2, symbol.size * 1, 0, Math.PI * 2, false);
                context.fill();
                context.stroke();
                let data = canvas.toDataURL();
                canvas.remove();
                //console.log(data);
                return canvas;
            }
        });
    });