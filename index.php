<?php
function getRandomStr()
 {
     $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
     $randstring = '';
     for ($i = 0; $i < 10; $i++) {
         $randstring = $characters[rand(0, strlen($characters))];
     }
     return $randstring;
 }
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <title>Mapa COVID Argentina</title>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-174571331-1"></script>
  <script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-174571331-1');
  </script>
  <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script
   src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSgsWTwfNItv9D4ajY6-KNVpbU0AkzM_E&libraries=&v=weekly&sda=<?php echo date('l jS \of F Y h:i:s A'); ?>"
   defer
 ></script>
  <link rel="stylesheet" type="text/css" href="style.css?<?= getRandomStr(); ?>" />
  <link rel="stylesheet" href="bootstrap.css" media="screen">
  <script src="jquery.min.js"></script>
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#"><h4>COVID19</h4></a>
     &nbsp;
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <div id = "map"  onclick="javascript:clickButton(this);"></div>
          &nbsp;&nbsp;
          <div id = "age" onclick="javascript:clickButton(this);"></div>
          &nbsp;&nbsp;
          <div id = "lines" onclick="javascript:clickButton(this);"></div>
          &nbsp;&nbsp;
          <div id = "comparative" onclick="javascript:clickButton(this);"></div>
      </div>
      <div style = "float:right;">
        <a href = "javascript:acercade();">
          <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
            <circle cx="8" cy="4.5" r="1"/>
          </svg>
        </a>
      </div>
    </nav>

<br/>

<main class="container-fluid">
    <div class="row">
        <div class="col">
            <!--map-->
            <div  id = "map_windows" class="card border-info mb-3" style="height: 50rem;">
                <div class="card-header"><div id = "mapa_titulo">[<a href="javascript:alert('hola');">+</a>]  &nbsp; Mapa</div></div>
                <div class="card-body p0" >
                    <div id = "mapa" style = "height: 100%;width: 100%;float:left;"></div>
                </div>
            </div>
            <!--map-->
        </div><!--./col-->
        <div class="col">
            <!--age_window-->
            <div id = "age_windows" class="card border-info mb-3" style="width: 44rem;height: 27rem;">
                <div class="card-header">Detalle por edades</div>
                <div class="card-body" id = "chart_velas"  style="width: 44rem;height: 27rem;">
                </div>
            </div>
            <!--age_window-->
        </div><!--./col-->
    </div><!--./row-->


    <div id = "lines_windows" style=" position: absolute;top:0px;visibility: hidden;">
    <div class="card border-info mb-3" style="width: 44rem;height: 27rem;">
        <div class="card-header">
            <div class="row">
                <div class="col-11">Líneas de tiempo (Contagios azul, muertes rojo)</div>
                <div class="col-1">
                    <span class="text-right"><a onclick="document.getElementById('lines_windows').style.visibility='hidden';" class="text-white">X</a></span>
                </div>
            </div>
        </div>
        <div class="card-body" id = "chart_curva"  style="width: 44rem;height: 27rem;"></div>
    </div>
    </div>

    <div  id="comparative_windows" style=" position: absolute;top:0px;visibility: hidden;">
        <div class="card border-info mb-3" style="width: 48rem;height: 55rem;">
        <div class="card-header">
            <div class="row">
                <div class="col">
                    COVID19 Vs. sumatoria total de causas defunciones año 2018
                </div>
                <div class="col-1">
                    <span class="text-right"><a onclick="document.getElementById('comparative_windows').style.visibility='hidden';" class="text-white">X</a></span>
                </div>
            </div>
        </div>
        <div class="card-body" id = "chart_defunciones"  style="width: 47.8rem;height: 52.5rem;left:1px;background-color:black;"></div>
        </div>
    </div>
    </div>
    <div  id = "fallecidos_windows" style="position: absolute;bottom:0px;right: 10;visibility: hidden;">
    <div class="card border-info mb-3" style="width: 18rem;height: 15rem;">
        <div class="card-header">COVID19 Vs. sumatoria total de causas defunciones año 2018</div>
        <div class="card-body" id = "fallecidos"  style="width: 16.5rem;height: 12rem;left:1px;background-color:black;"></div>
    </div>
    </div>
 </main>
    <footer class="text-center">
        <span class="text-white" id="fecha_actualizacion"></span>
    </footer>
    <script src="./mapa.js?<?= getRandomStr(); ?>"></script>
    <script src="./botonera.js?<?= getRandomStr(); ?>"></script>
</body>
</html>
