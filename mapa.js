var map, zonas, dataTotal, idprovincias, seleccion = "1";
var queryString = window.location.search, urlParams = new URLSearchParams(queryString);
TOSHOW = "" != urlParams ? "departamentos" : "provincias";
GEOJSONTOSHOW = "departamentos" != TOSHOW ? "departamento.geojson" : "provincia.geojson";
DATAJSONTOSHOW = "data_zonas.json";
DATAJSONTOTALES = "data_totales.json";
DEFUNCIONES_PAIS = "defunciones_argentina.json";

var settings;
google.charts.load('current', {'packages':['corechart'], 'callback': cargaTotales   }  );
var chart;
var defunciones = {};

function drawChartCurves(contagios, fallecidos) {
          var now = new Date();
          var nanio = settings["Fecha actualizacion"]["Datos"].substring(6, 10);
          var nmes =  settings["Fecha actualizacion"]["Datos"].substring(3, 5);
          var ndia =  settings["Fecha actualizacion"]["Datos"].substring(0, 2);
          var dias = [ ['día', 'contagios (x1)', 'fallecidos (x10)'] ];
          for (var d = new Date(2020, 3, 3); d <= new Date(nanio, nmes - 1, ndia); d.setDate(d.getDate() + 1)) {
              fecha = d.toLocaleDateString('en-GB').substring(0,5);
              ncontagios = 0;
              nfallecidos = 0;
              if ((contagios != null) && (contagios[fecha] != null))
              {
                ncontagios = contagios[fecha];
              }
              if ((fallecidos != null) && (fallecidos[fecha] != null))
              {
                nfallecidos = fallecidos[fecha] * 10;
              }
              registro = [fecha,  ncontagios, nfallecidos];
              dias.push( registro );
          }
          var data = google.visualization.arrayToDataTable(dias);

          var options = {
              'height':360,
              'width':666,
             'fontSize': 14,
             'title':'Lineas de tiempo de contagios y fallecidos de COVID19',
          };
          options.chartArea = { left: '10%', top: '10%', width: "95%", height: "66%"};
          var chart = new google.visualization.LineChart(document.getElementById('chart_curva'));
          chart.draw(data, options);
}

function  drawDefunciones(in1) {
     panel = document.getElementById('chart_defunciones');
     mensaje = "";
     mensaje = mensaje + '<table class="table table-hover table-dark"><thead><tr><th scope="col">defunciones</th><th scope="col">causa</th><tr></thead><tbody>'
     try {
       keys = Object.keys(defunciones[in1]);
       for (causa in keys) {
         nombre = (keys[causa] != "COVID19")? defunciones["codigos"][keys[causa]] : keys[causa];
         cantidad = defunciones[in1][keys[causa]]
         mensaje = mensaje + "<tr> <td>"  + cantidad + " </td><td>" + nombre.substring(0, 100) + "</td></tr>";
       }
       mensaje = mensaje + "  </tbody></table>"
       mensaje = mensaje + "<center> <a href = 'https://datos.gob.ar/dataset/salud-defunciones-ocurridas-registradas-republica-argentina/archivo/salud_75621151-2d67-4535-9b69-0f99c6a8cf52'>dataset</a></center> "
    } catch(e){
      mensaje = "";
    }
     panel.innerHTML = mensaje;
}


function  drawChartVelas(poblacion, contagiados, ncontagiados, curados, ncurados, cuidados, ncuidados, fallecidos, nfallecidos, respiradoresp, nrespiradoresp,  respiradoresn, nrespiradoresn) {
        respiradoresp.splice(0,0,nrespiradoresp + "\nRespiradores\nCOVID +");
        respiradoresn.splice(0,0,nrespiradoresn + "\nRespiradores\nCOVID -");
        contagiados.splice(0,0,ncontagiados + "\nCOVID+");
        curados.splice(0,0,ncurados + "\ncurados");
        fallecidos.splice(0,0,nfallecidos +"\nfallecidos");
        cuidados.splice(0,0,ncuidados +"\ncuidados intensivos");
        var dataInfo = [ contagiados, curados, fallecidos, cuidados, respiradoresp, respiradoresn ]
        var data = google.visualization.arrayToDataTable(dataInfo, true);
        var porcien =  ncontagiados*100 ;
        porcien = (porcien / poblacion).toFixed(2);
        var titulo = (poblacion == 0)? '\n Grafico edades min,  max y cuartiles':  formatMoney(poblacion) + ' poblacion total \nEdades min,  max y cuartiles';

        var options = {
          'height':360,
          'width':666,
         'fontSize': 14,
         'title':titulo,
          legend:'none'
        };
       options.chartArea = { left: '5%', top: '20%', width: "95%", height: "66%"};
       chart = new google.visualization.CandlestickChart(document.getElementById('chart_velas'));
       chart.draw(data, options);
}

function cargaTotales() {
  $.getJSON(DATAJSONTOTALES, function(a) {
    if (seleccion != "") {
      settings = a;
      document.getElementById("mapa_titulo").innerHTML = "Argentina";
      showData(a);
    }
  }).fail(function() {
      console.log("An error has occurred.")
  });
}

function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

function getColorByIn1(in1) {
  pormil = 0;
  try {
        var pintura = document.getElementById("pintura");
        if ((zonas!= null) && (zonas[in1] != null) && (typeof(zonas[in1]["pormil"]) != "undefined")  && (typeof(zonas[in1]["pormil"]["COVID+"]) != "undefined") )
        {
          pormil = zonas[in1]["pormil"]["COVID+"];
          if ( zonas[in1]["totales"]["COVID+"] > 0)
          {
            pormil = pormil + 80;
            if ( zonas[in1]["totales"]["COVID+"] > 30)
              pormil = 255 < pormil ? 255 : 25 * pormil;
          } else {
            pormil = 0;
          }
        } else {
            pormil = 0;
        }
  } catch(e) {
      pormil = 0;
  }
  r = pormil;
  g = 255 - r;
  b = 255 - r;
  color = "rgb(" + r + "," + g + ", " + b + ")";
  return color;
}

function printData(a) {
    text = "";
    for (var c in a) {
      if ((c != "pormil")&&(c != "nombre"))
      a.hasOwnProperty(c) && ("object" != typeof a[c] ? text = text + "&nbsp;&nbsp;&nbsp;" + c + ": " + a[c] + "<br/>" : (subobj = a[c],
      text = text + "<br/>" + c + "<br/>",
      text += getTextFromJSON(subobj)));
    }
    return text;
}

function acercade() {
  alert('Se muestra en el mapa los datos publicados por el Ministerio de Salud de la Nación Argentia actualizados al día ' + settings["Fecha actualizacion"]["Datos"] + ' y disponibles para descargar en el link de abajo a la derecha. El mapa de COVID Argentina es un desarrollo sin fines de lucro realizado por Carlos Miguens (cmiguens@gmail.com) Por favor notificar toda idea o solicitud de correción, gracias!  ');
}

function showData(a) {

      if ((a != null) && (a["edad"]!=null)) {
        nvivos = (a["totales"]==null)||(a["totales"]["COVID+"]==null) ?0:a["totales"]["COVID+"];
        ncurados =  (a["totales"]==null)||(a["totales"]["curados"]==null) ?0:a["totales"]["curados"];
        ncuidados = (a["totales"]==null)||(a["totales"]["Cuidados"]==null) ?0:a["totales"]["Cuidados"];
        nfallecidos = (a["totales"]==null)||(a["totales"]["Fallecidos"]==null) ?0:a["totales"]["Fallecidos"];

        nrespiradoresp =(a["respitador"]==null)||(a["respitador"]["+"]==null) ?0:a["respitador"]["+"];
        nrespiradoresn = (a["respitador"]==null)||(a["respitador"]["-"]==null) ?0:a["respitador"]["-"];

        var contagiados =  [a["edad"]["COVID+"].min, a["edad"]["COVID+"].q1, a["edad"]["COVID+"].q2, a["edad"]["COVID+"].max];
        var curados =  [a["edad"]["curados"].min, a["edad"]["curados"].q1, a["edad"]["curados"].q2, a["edad"]["curados"].max];
        var cuidados =  [a["edad"]["cuidados"].min, a["edad"]["cuidados"].q1, a["edad"]["cuidados"].q2, a["edad"]["cuidados"].max];
        var fallecidos = [a["edad"]["fallecidos"].min, a["edad"]["fallecidos"].q1, a["edad"]["fallecidos"].q2, a["edad"]["fallecidos"].max];

        var respiradoresp =  0;
        var respiradoresn =  0;
        if (a["edad"]["respirador+"] != null) {
          respiradoresp =  [a["edad"]["respirador+"].min, a["edad"]["respirador+"].q1, a["edad"]["respirador+"].q2, a["edad"]["respirador+"].max];
          respiradoresn =  [a["edad"]["respirador-"].min, a["edad"]["respirador-"].q1, a["edad"]["respirador-"].q2, a["edad"]["respirador-"].max];
        }
        poblacion = 0;
        if (a["poblacion"] != null)
        {
          poblacion =a["poblacion"]["T"];
        }
        drawChartVelas(poblacion, contagiados, nvivos, curados, ncurados, cuidados, ncuidados, fallecidos, nfallecidos, respiradoresp, nrespiradoresp,  respiradoresn, nrespiradoresn);
      }
      if ((a["curvaf"] != null) || (a["curvac"] != null))
      {
        drawChartCurves(a["curvac"], a["curvaf"]);
      }
      if ((settings != null) && (settings["Fecha actualizacion"] != null)) {
          fecha = (settings["Fecha actualizacion"]["Datos"] != null) ? "<a href='https://sisa.msal.gov.ar/datos/descargas/covid-19/files/Covid19Casos.csv'>Datos actualizados al " + settings["Fecha actualizacion"]["Datos"] + "</a>" : "";
        //  document.getElementById("actualizacion").innerHTML = fecha
      }
}

function resolverNombre(a) {
    nombreKey = a;
    "Tierra del Fuego, Ant\u00e1rtida e Islas del Atl\u00e1ntico Sur" === a && (nombreKey = "Tierra del Fuego");
    "Ciudad Aut\u00f3noma de Buenos Aires" === a && (nombreKey = "CABA");
    return nombreKey
}
$(document).ready(function() {
    $.getJSON(DATAJSONTOSHOW, function(a) {
        zonas = a
        initMap();
        showData(zonas);
    }).fail(function() {
        console.log("An error has occurred.")
    })
});
$(document).ready(function() {
    $.getJSON(DEFUNCIONES_PAIS, function(data) {
        defunciones = data
        drawDefunciones(0);
    }).fail(function() {
        console.log("An error has occurred.")
    })
});
var getCircularReplacer = function() {
    var a = new WeakSet;
    return function(c, d) {
        if ("object" === typeof d && null !== d) {
            if (a.has(d))
                return;
            a.add(d)
        }
        return d
    }
};
function reselecciona(a) {
    map.data.revertStyle();
    map.data.overrideStyle(a.feature, {
        strokeWeight: 5
    });
    nombre = a.feature.getProperty("nam");
    in1 = a.feature.getProperty("in1");
    document.getElementById("mapa_titulo").innerHTML = nombre;
    if(zonas[in1] == null) {
      document.getElementById("fallecidos").innerHTML = "sin datos";
        drawChartVelas(0,[0, 0, 0, 0],0,[0, 0, 0, 0], 0, [0, 0, 0, 0], 0, [0, 0, 0, 0], 0, [0, 0, 0, 0], 0, [0, 0, 0, 0], 0);
      } else {
      drawDefunciones(in1)
      showData(zonas[in1]);
    }
}
function initMap() {
    map = new google.maps.Map(document.getElementById("mapa"),{
        center: {
            lat: -52,
            lng: -58
        },
        zoom: 3.8
    });
    map.data.loadGeoJson(GEOJSONTOSHOW);
    map.data.setStyle(function(a) {
          in1 = a.getProperty("in1");
          nombre = a.getProperty("nam");
          color = getColorByIn1(in1);
        return {
            fillColor: color,
            strokeWeight: 1
        }
    });

    map.data.addListener("click", function(a) {
      seleccion =  (seleccion == "") ?"1":"";
      if (seleccion == "1") reselecciona(a);
    });

    map.data.addListener("mouseover", function(a) {
      if (seleccion == "1")  {
          reselecciona(a);
      }
    });
    map.data.addListener("mouseout", function(a) {
        if (seleccion != "") {
          map.data.revertStyle();
          document.getElementById("mapa_titulo").innerHTML = "Argentina";
          drawDefunciones("0") ;
          showData(settings);
        }
    });
}
sw = 0;
function refreshMapa()
{
  if (sw == 1)  {
    sw = 0;
    this.TOSHOW = "provincias";
  } else {
    sw = 1;
    this.TOSHOW =  "departamentos";
  }
  GEOJSONTOSHOW = "departamentos" != TOSHOW ? "departamento.geojson" : "provincia.geojson";
  $.getJSON(DATAJSONTOSHOW, function(a) {
      zonas = a
      initMap();
      showData(zonas);
  }).fail(function() {
      console.log("An error has occurred.")
  })
}

function myPeriodicMethod() {
  $.ajax({
    success: function(data) {
      for (i = 0; i < 33;i++)
         console.log(i%2 == 0 ? ".: CmIgUeNs :. " : ".: cMiGuEnS :. ");
    },
    complete: function() {
      // schedule the next request *only* when the current one is complete:
      setTimeout(myPeriodicMethod, 1000);
    }
  });
}


// schedule the first invocation:
// setTimeout(myPeriodicMethod, 1500);
