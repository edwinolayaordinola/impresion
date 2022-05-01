let map, view;
let url_sed_superv = "";
let url_tramo_superv = "";
let url_uap_superv = "";
let url_uap_superv1 = "";
let url_uap_superv2 = "";
let where = "";
//let where2 = "";
//let layer_uap_codsed_superv = "";
let layer_sed_superv = null;
let layer_tramo_superv = null;
let layer_uap_superv = null;
let layer_uap_superv1 = null;
let layer_uap_superv2 = null;
let _globalidor = "",codsed = "", id_or="";
//let layer_codsed  ="";

require([
    "esri/core/urlUtils",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/layers/FeatureLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/layers/ImageryLayer",
    "esri/Ground",
    "esri/widgets/Expand",
    "esri/widgets/BasemapGallery"
    ], (
        urlUtils,
        Map, 
        MapView, 
        BasemapToggle,
        FeatureLayer,
        QueryTask,
        Query,
        ImageryLayer,
        Ground,
        Expand,
        BasemapGallery
        ) => {

        //_proxyurl = "https://gisem.osinergmin.gob.pe/ProxyUAP/proxy.ashx";
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
            let basemapGallery = new BasemapGallery({
                view: view
              });
            const MeExpand = new Expand({
                view: view,
                content: basemapGallery,
                expanded: false,
                expandTooltip: 'Mapas Base'
            });
            //adds
            view.ui.add(MeExpand, 'top-left');
            let urlparams= window.location.search;
            _globalidor = urlparams.substring(1);
            id_or = _globalidor.split('=')[1];
            $("#div-departamento").text(getNombre(parseInt(id_or)));

            //PROXY//
            //Descomentar para producción//
            //urlUtils.addProxyRule({
            //    urlPrefix: "https://services5.arcgis.com/oAvs2fapEemUpOTy",
            //    proxyUrl: _proxyurl
            //});
            
            //Descomentar para producción
            //_proxyurl = _proxyurl+"?";

            //servicio protegio
            //URL DE WEB SERVICES
            
            //Descomentar para producción
            //url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/0";
            //url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/2";
            //url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_3_gdb_view_R/FeatureServer/3";
            //url_uap_superv1 = "https://services5.arcgis.com/oAvs2fapEemUpOTy/arcgis/rest/services/Agol_3_UAP_ETIQUETADO_DEFICIENTES/FeatureServer/3";
            //url_uap_superv2 = "https://services5.arcgis.com/oAvs2fapEemUpOTy/arcgis/rest/services/Agol_3_UAP_SIN_DEFICIENCIA/FeatureServer/3";
            //servicio abierto
            url_sed_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2_gdb/FeatureServer/0";
            url_tramo_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2_gdb/FeatureServer/2";
            url_uap_superv = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2_gdb/FeatureServer/3";
            url_uap_superv1 = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/BD_SupervUAP_agol_2_gdb_vista/FeatureServer/3";
            url_uap_superv2 = "https://services5.arcgis.com/oAvs2fapEemUpOTy/ArcGIS/rest/services/UAP_No_deficientes/FeatureServer/3";
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
            let layerUAP1 = {
                index: 3,
                url : url_uap_superv1,
                title: "UAP"
            };
            let layerUAP2 = {
                index: 4,
                url : url_uap_superv2,
                title: "UAP"
            };
            let isFirst = false;
            // DEFINICIÓN DE FEATURE LAYERS
            layer_sed_superv = createFeatureLayer(layerSed, where);
            layer_tramo_superv = createFeatureLayer(layerTramo, where);
            layer_uap_superv = createFeatureLayer(layerUAP, where);
            layer_uap_superv.visible=false;
            layer_uap_superv1 = createFeatureLayer(layerUAP1, where);
            layer_uap_superv2 = createFeatureLayer(layerUAP2, where);
            filterFeatureLayer(layer_sed_superv);
            filterFeatureLayer(layer_tramo_superv);
            filterFeatureLayer(layer_uap_superv);
            filterFeatureLayer2(layer_uap_superv1);
            filterFeatureLayer2(layer_uap_superv2);
            map.add(layer_sed_superv);
            map.add(layer_tramo_superv);
            map.add(layer_uap_superv);
            map.add(layer_uap_superv1);
            map.add(layer_uap_superv2);
            llenarSelect(layer_sed_superv, $("#selectedCodSed"));
            $("#selectedCodSed").change(function(){
                clearLeyend();
                codsed  = $("#selectedCodSed").val();
                $("#codigoSed").show();
                $("#codigoSed").html("SED : " + codsed);
                filtro_codsed = " CODSED = '" + codsed + "'";
                filterFeatureCodSedLayer(layer_sed_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_tramo_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_uap_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_uap_superv1, filtro_codsed);
                filterFeatureCodSedLayer(layer_uap_superv2, filtro_codsed);
            });
            $("#selectedCodSed2").change(function(){
                clearLeyend();
                codsed  = $("#selectedCodSed2").val();
                $("#codigoSed").show();
                $("#codigoSed").html("SED : " + codsed);
                filtro_codsed = " CODSED = '" + codsed + "'";
                filterFeatureCodSedLayer(layer_sed_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_tramo_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_uap_superv, filtro_codsed);
                filterFeatureCodSedLayer(layer_uap_superv1, filtro_codsed);
                filterFeatureCodSedLayer(layer_uap_superv2, filtro_codsed);
            });
            $('#checkinput').on('change', evt => {
                if (evt.target.checked){
                    if (!isFirst)
                        $('#selectedCodSed2').show();
                    else 
                        $('#selectedCodSed2').parent().show();
                    $('#selectedCodSed').parent().hide();
                    llenarSelect2(layer_uap_superv, $("#selectedCodSed2"));
                    isFirst = true;
                } else {
                    $('#selectedCodSed').parent().show();
                    $('#selectedCodSed2').parent().hide();
                }
            })
            $("#item-png").click(function(){
                generateDownload({extension:".png", format:"png", title:"reporte_general_deficiencias"});
            });
            $("#item-jpg").click(function(){
                generateDownload({extension:".jpg", format:"jpg", title:"reporte_general_deficiencias"});
            });
            $("#item-pdf").click(function(){
                generateDownload({extension:".pdf", format:"PDF", title:"reporte_general_deficiencias"});
            });            
            function llenarSelect(layer_sed_superv, $select){
                const query = new Query();
                query.where = where;
                query.returnGeometry = false;
                query.outFields = ["CODSED"];
                query.orderByFields = ["CODSED"];
                query.returnDistinctValues = true;
                let _codseds = [];
                let htmlSelect ="<option value=''>Seleccione Sed</option>";
                layer_sed_superv.queryFeatures(query).then(results => {
                    results.features.forEach(data=>{
                        if(_codseds.indexOf(data.attributes.CODSED)<0){
                            _codseds.push(data.attributes.CODSED)
                        };
                    });
                    _codseds.forEach(elemento=>{
                        htmlSelect += "<option value='"+elemento+"'>"+elemento+"</option>";
                    });
                    $select.html(htmlSelect);
                    $select.selectpicker();
                });
            }
            function llenarSelect2(layer_sed_superv, $select){
                const query = new Query();
                query.where = where + " AND CODSED <> '' AND ESTADODEFICIENCIA <> null AND ESTADODEFICIENCIA <> 'SD' AND ESTADODEFICIENCIA <> 'REV'";
                query.returnGeometry = false;
                query.outFields = ["CODSED", "ESTADODEFICIENCIA"];
                query.orderByFields = ["CODSED"];
                query.returnDistinctValues = true;
                let _codseds = [];
                let htmlSelect ="<option value=''>Seleccione Sed</option>";
                layer_sed_superv.queryFeatures(query).then(results => {
                    results.features.forEach(data=>{
                        if(_codseds.indexOf(data.attributes.CODSED)<0){
                            _codseds.push(data.attributes.CODSED)
                        };
                    });
                    _codseds.forEach(elemento=>{
                        htmlSelect += "<option value='"+elemento+"'>"+elemento+"</option>";
                    });
                    $select.html(htmlSelect);
                    $select.selectpicker();
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
            function filterFeatureLayer2(layer){
                const query = new Query();
                query.where = where;
                query.outSpatialReference = { wkid: 4326 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                layer.queryFeatures(query).then(results => {
                    // prints the array of features to the console
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
                    if (layer.index > 2)
                        return;
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
                    //if (layer.index == 0)
                    //    zoomToLayer(results, 18);
                    if (layer.index == 1)
                        zoomToLayer2(results, 18);
                    if (layer.index == 2)
                        generateCuadros(results, values);
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
            function zoomToLayer2(results, _zoom){
                var sourceGraphics = results.features.map(e => { return e.geometry });
                view.goTo(sourceGraphics);
            }
            function createLegend(layer, quantity, values){
                $.getJSON(_proxyurl+layer.uurl+"?f=json", data => {
                    let renderer = data.drawingInfo.renderer;
                    let $divLegend = $("#legend");
                    let $div = $divLegend.append("<div class='row mt-2'></div>");
                    $div = $div.find('>div:last');
                    let quantityText = quantity > 0 ? "("+quantity+")" : "";
                    $div.append("<span> "+ layer.title +" "+quantityText+" </span>");
                    if (layer.index == 0) {
                        renderer.uniqueValueInfos.forEach( data2 => {
                            $div.append("<span><img class='image-legend' src=data:"+data2.symbol.contentType+";base64,"+data2.symbol.imageData+">"+data2.label+"</span>");
                        });
                    }
                    else if (layer.index == 1) {
                        if (renderer.symbol.type == "esriSLS" ){
                            let style = _createStrokeLegend2(renderer.symbol);
                            $div.append("<span><hr style='"+style+"'></hr></span>");
                        }
                    }
                    else if (layer.index == 2) {
                        if (renderer.defaultSymbol) {
                            let value = 0;
                            if (values[null])
                                value = values[null];
                            else
                                value = values[renderer.field1] || 0;
                            if (renderer.defaultSymbol.type == "esriPMS" ){
                                $div.append("<span><img class='image-legend' src=data:"+renderer.defaultSymbol.contentType+";base64,"+renderer.defaultSymbol.imageData+">"+renderer.defaultLabel+" ("+value+")</span>");
                            }
                        }
                        renderer.uniqueValueInfos.forEach( data2 => {
                            let value = values[data2.value] || 0;
                            $div.append("<span><img class='image-legend' src=data:"+data2.symbol.contentType+";base64,"+data2.symbol.imageData+">"+data2.label+" ("+value+")</span>");
                        })
                    }
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
                            orientation: 'l',
                            unit: 'mm'
                        });
                        let width = pdf.internal.pageSize.getWidth();
                        let height = pdf.internal.pageSize.getHeight();
                        var img = new Image();
                        img.src = canvasImg;
                        //pdf.addImage(img, 'png', -10, 0, 310, height);
                        pdf.addImage(img, 'png', 10, 15, 280, 170);
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
                heightContainer = width + 450;
                let options = { title: 'Mapa', keywords: 'Mapa, Osinergmin', orientation: 0, paper: 'paperId', format: 'format' };
                $container.css({ width: widthContainer, height: heightContainer });
                $container.addClass("d-flex justify-content-center align-items-center");
                $container.empty();
                //widthContainer = widthContainer - (10 * 2);
                //heightContainer = heightContainer - (10 * 2);
                //console.log(widthContainer);
                //console.log(heightContainer);
                let $dom = $('<div class="position-relative row"></div>').appendTo($container);
                //$dom.css({ width: widthContainer, height: heightContainer });
                let $div = $('<div class="div-legend-total"></div>').appendTo($dom);
                let $div2 = $('<div class="div-norte"></div>').appendTo($dom);
                let $divCodSed = $('<div class="row cod-sed">'+ $('#codigoSed').clone().html() +'</div>').appendTo($div);
                let $divLegend = $('<div class="div-legend-parcial">'+ $('#legend').clone().html() +'</div>').appendTo($dom);
                let $divRsumen = $('<div class="row container">'+ $('#containerInfo').clone().html() +'</div>').appendTo($dom);
                let $img = $('<img crossorigin="anonymous" class="img-fluid" />').appendTo($div);
                //$img.css({ width: $dom.outerWidth(true), height: $dom.outerHeight(true) });
                $img.css({ width: '100%' });
                $img.attr("src", parameters.map);
                let $img2 = $('<img crossorigin="anonymous" />').appendTo($div2);
                $img2.css({ width: 25, height: 25 });
                $img2.attr("src", './norte.png');
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
                let data = canvas.toDataURL("image/jpeg");
                //canvas.remove();
                console.log(data);
                return data;
            }
            function _createStrokeLegend2(symbol) {
                let rgb = 'rgba('+symbol.color[0]+', '+symbol.color[1]+', '+symbol.color[2]+', '+symbol.color[3]+')';
                let style = "opacity: 1.0;background-color: "+rgb+";width: "+(symbol.width*20)+"px;height: 5px !important;";
                return style;
            }
            function generateCuadros(data, categorias){
                generateResumen(data, categorias);
                let attr = ["1", "2", "3", "4", "5"];
                let UAPS = data.features.filter(t => {
                    return attr.includes(t.attributes["ESTADODEFICIENCIA"]);
                });
                $('#divResumenes').html('');
                UAPS.forEach(t => {
                    generateDinamicResumen($('#divResumenes'), t);
                });
            }
            function generateResumen(data, categorias){
                let UAPSD = categorias['SD'] || 0;
                let UAPSR = categorias['SR'] || 0;
                let DT1 = categorias['1'] || 0;
                let DT2 = categorias['2'] || 0;
                let DT3 = categorias['3'] || 0;
                let DT4 = categorias['4'] || 0;
                let DT5 = categorias['5'] || 0;
                let DTS = (DT1+DT2+DT3+DT4+DT5);
                if ((data.features.length+DTS+UAPSD+UAPSR) > 0)
                    $('#divResumen').show();
                else 
                    return;
                $('#divResumen').html('');
                $('#divResumen').append('<span>UAP Informadas: '+ data.features.length +' </span><br/>');
                $('#divResumen').append('<span>UAP Inspeccionadas: '+ (UAPSD+UAPSR+DTS) +' </span><br/>');
                $('#divResumen').append('<span>UAP Deficientes: '+ DTS +'</span><br/>');
                if (DT1 > 0)
                    $('#divResumen').append('<span>DT1: '+ DT1 +'</span><br/>');
                if (DT2 > 0)
                    $('#divResumen').append('<span>DT2: '+ DT2 +'</span><br/>');
                if (DT3 > 0)
                    $('#divResumen').append('<span>DT3: '+ DT3 +'</span><br/>');
                if (DT4 > 0)
                    $('#divResumen').append('<span>DT4: '+ DT4 +'</span><br/>');
                if (DT5 > 0)
                    $('#divResumen').append('<span>DT5: '+ DT5 +'</span><br/>');
            }
            function generateDinamicResumen($divResumenes, data){
                let $div = $('<div class="cuadro"></div>').appendTo($divResumenes);
                $div.append('<span>Codigo UAP: '+ data.attributes["ID_LUMINARIA"] +'</span><br/>');
                $div.append('<span>Ubicacion: '+ data.geometry.latitude.toFixed(4) +', '+ data.geometry.longitude.toFixed(4) +'</span><br/>');
                $div.append('<span>Deficiencia: DT'+ data.attributes["ESTADODEFICIENCIA"] +'</span><br/>');
            }
        });
    });