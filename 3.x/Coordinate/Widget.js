define([
  'dojo/_base/declare',
  'dojo/dom',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidget',
  'dojo/_base/lang',
  'dojo/on',
],

  function (
    declare, dom,
    _WidgetsInTemplateMixin,
    BaseWidget,
    lang,
    on
  ) {

    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-svy21',

      postCreate: function () {
        this.inherited(arguments);
        this.own(on(this.map, "mouse-move", lang.hitch(this, this.onMouseMove)));
        console.log('postCreate');
      },

      startup: function () {
        this.inherited(arguments);
        console.log('startup');
      },

      onMouseMove: function (evt) {
        console.log("onMouseMove");

        attribution = `OneMap |`; 

        // create point on map at pointer
        point = evt.mapPoint;

        // no point will be generated when navigating underground (is this necessary?)
        if (point !== null) {

          // convert point map coords from 3857 to 3414 (SVY21) using OneMap API
          requestUrl = `https://developers.onemap.sg/commonapi/convert/3857to3414?Y=${point.y}&X=${point.x}`;

          fetch(requestUrl)

            .then(function (response) {
              return response.json();
            })

            .then(function (myJson) {

              // convert coordinates to 2 dp
              xValue = myJson.X;
              yValue = myJson.Y;
              xValue2dp = xValue.toFixed(2);
              yValue2dp = yValue.toFixed(2);

              // console.log(`sceneView coords - x: ${point.x} y: ${point.y}`);
              // console.log(`OneMap coords - x: ${xValue2dp} y: ${yValue2dp}`);

              // check if the coords is within Singapore extent
              if (xValue2dp > 919.05 && xValue2dp < 54338.72 && yValue2dp > 12576.34 && yValue2dp < 50172.05) {
                // display coords
                coordsSVY21 = `${attribution} EPSG 3414 (SVY21): ${xValue2dp}, ${yValue2dp}`;
                dom.byId("coordsValueSVY21").value = coordsSVY21;
              }
              else {
                // dom.byId("coordsValueSVY21").value = `${point.longitude.toFixed(5)}, ${point.latitude.toFixed(5)}`; // EPSG3857 lat lng
                dom.byId("coordsValueSVY21").value = `${attribution} EPSG 3414 (SVY21): Out of Range`; 
              }
            });
        }
      },

    });

    return clazz;
  });