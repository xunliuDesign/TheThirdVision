////////////////////////
//global variable
////////////////////////
var city = {
        name: "sh",
        center: [121.62301, 31.23801],
        zoom: 13,
        pitch: 0,
        bearing:0,
        style:'mapbox://styles/xunliu/ck3qh8wrl0ct21coyvqaidyjx'
};


////////////////////////
//initiate mapbox
////////////////////////
mapboxgl.accessToken = 'pk.eyJ1IjoieHVubGl1IiwiYSI6ImNrMXV5bzV2ZzA0aGUzaG16YWJybHllbjAifQ.11sHwcv-F_pZQpmW5PZxNw'; 
var map = new mapboxgl.Map({
    style: city.style, 
	container: 'map',
    center: city.center, 
    zoom: city.zoom, 
    pitch: city.pitch,
});

$("#legend-1").hide();
$("#legend-2").hide();
$("#legend-3").hide();
$("#legend-4").hide();

////////////////////////
// select city
//////////////////////// 
var cities = {
    'sh': {
        name: "sh",
        center: [121.62301, 31.23801],
        zoom: 13,
        pitch: 0,
        bearing:0,
        style:'mapbox://styles/xunliu/ck3qh8wrl0ct21coyvqaidyjx'
    },

    'nyc': {
        name: "nyc",
        center: [ -73.98074, 40.76591],
        zoom: 13,
        pitch: 0,
        bearing:0,
        style:'mapbox://styles/xunliu/ck1vcfnn185xl1cp781ozsola'

    },

    'sf': {
        name: "sf",
        center: [ -122.4194, 37.7749],
        zoom: 14,
        pitch: 0,
        bearing:0,
        style:'mapbox://styles/xunliu/ck1vcfnn185xl1cp781ozsola'

    },

    'bos': {
        name: "bos",
        center: [-71.06933, 42.36104],
        zoom: 14,
        pitch: 0,
        bearing:0,
        style:'mapbox://styles/xunliu/ck1vcfnn185xl1cp781ozsola'

    },
    'seattle': {
        name: "seattle",
        center: [-122.3321, 47.6062],
        zoom: 14,
        pitch: 0,
        bearing:0,
        style:'mapbox://styles/xunliu/ck1vcfnn185xl1cp781ozsola'
    },
    'london': {
        name: "london",
        center: [-0.1278, 51.5074],
        zoom: 14,
        pitch: 0,
        bearing:0,
        style:'mapbox://styles/xunliu/ck1vcfnn185xl1cp781ozsola'
    }
    };


$("#selectCity").change(function(){
        // var selectedCity = $("#selectCity").value;
        // $("#demo").text(selectedCity);    // why Jquery doesn't work??

        city = cities[document.getElementById("selectCity").value];

        map = new mapboxgl.Map({
                style: city.style, 
                container: 'map',
                center: city.center, 
                zoom: city.zoom, 
                pitch:city.pitch,
            });
        });


////////////////////////
// pop up
//////////////////////// 
map.on('click', function(e){
    var points = map.queryRenderedFeatures(e.point,{layer:["Score_Point"]});
    var popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: 'bottom',
        offset:[0,-10],
        className:'popupWindow'
    });
    popup.setLngLat(points[0].geometry.coordinates);
    popup.setHTML(
        '<h4> Score:'+
            points[0].properties.Score.toPrecision(3)
            +'<br>'+'-----------------------'+
        '</h4>'
        +
        '<p> Enclosure:'+ points[0].properties.Q2.toPrecision(3)+'<br>'+
        'Human Scale:'+ points[0].properties.Q3.toPrecision(3)+'<br>'+
        'Complexity:'+ points[0].properties.Q4.toPrecision(3)+'<br>'+
        'Comprehension Style:'+ points[0].properties.Q2.toPrecision(3)+'<br>'+
        '</p>'+
        "<a href='methods.html#highlight1'><i class='fa fa-question-circle' style='font-size:25px; color:grey'></i></a>"
        );
        popup.addTo(map);
    });

        function myPopup(idName) {
          var popup = document.getElementById(idName);
          popup.classList.toggle("show");
        }

//////////////////////
//3D Visualization
////////////////////// 

var layers1 = [
    ['Q2_Average','Enclosure'],
    ['Q3_Average','Human Scale'],
    ['Q4_Average','Complexity'],
    ['Q5_Average','Imageability'],
];

var layers2 = [
    ['SubwayStation','Subway Station'],
    ['CensusPop','Population'],
    ['PopDensity','Population Density']
];

    map.on('load', function () {
           
        for (i=0; i<layers1.length; i++) {
            $("#layers-control1").append("<a href='#' class=' button-default' id='" + layers1[i][0] + "'>" + layers1[i][1] + "</a>"); // see http://api.jquery.com/append/
        }
        for (i=0; i<layers2.length; i++) {
            $("#layers-control2").append("<a href='#' class=' button-default' id='" + layers2[i][0] + "'>" + layers2[i][1] + "</a>"); 
        }

        // show/hide layers when button is clicked
        $("#layers-control1>a").on('click', function(e) {
                map.flyTo({
                    center: city.center,
                    zoom: city.zoom-1.2,
                    bearing:45,
                    pitch: 45,
                    speed: 0.3,
                    curve: 1,
                    easing: function (t) { return t; }
                })

                setTimeout(function(){


                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none'); 
                    $(e.target).removeClass('active');
                    map.setLayoutProperty('Score_Average','visibility','visible');
                } 
                else {
                    for (i=0; i<layers1.length; i++) {
                    map.setLayoutProperty(layers1[i][0], 'visibility', 'none');
                    $('#'+layers1[i][0]).removeClass('active');
                     }
                    map.setLayoutProperty('Score_Average','visibility','none');

                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); 
                }

                     //change legend
            if(map.getLayoutProperty('Q2_Average','visibility')=='visible'){
                $("#legend-1").show();
                }else{
                $("#legend-1").hide();
                }
            if(map.getLayoutProperty('Q3_Average','visibility')=='visible'){
                $("#legend-2").show();
                }else{
                $("#legend-2").hide();
                }
             if(map.getLayoutProperty('Q4_Average','visibility')=='visible'){
                $("#legend-3").show();
                }else{
                $("#legend-3").hide();
                }
             if(map.getLayoutProperty('Q5_Average','visibility')=='visible'){
                $("#legend-4").show();
                }else{
                $("#legend-4").hide();
                }

                },1000)

            //map zoomout then zoom
              setTimeout(function(){
                  map.flyTo({
                        center: city.center,
                        zoom: city.zoom-0.7,
                        bearing:45,
                        pitch: 45,
                        speed: 0.1,
                        curve: 1,
                        easing: function (t) { return t; }
                    });
                },1000);
        });

        $("#layers-control2>a").on('click', function(e) {
                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility'); 
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none'); 
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); 
                }
        });

        $("#layers-control1").hide();
        $("#layers-control2").show();

        $("#mySwitch").on('change',function(){
            mySwitch=!mySwitch;
            if(mySwitch){
                map.setLayoutProperty('Score_Average','visibility','none');
                map.setLayoutProperty('Score_Point','visibility','visible');

                $("#layers-control2").show();
                $("#layers-control1").hide();
                    for (i=0; i<layers1.length; i++) {
                    map.setLayoutProperty(layers1[i][0], 'visibility', 'none');
                }

            map.flyTo({
                    center: city.center,
                    zoom: city.zoom,
                    bearing:0,
                    pitch: 0,
                    speed: 2,
                    curve: 1,
                    easing: function (t) { return t; }
                });
            } //end of if mySwitch


            else{
                map.setLayoutProperty('Score_Average','visibility','visible');
                map.setLayoutProperty('Score_Point','visibility','none');

                $("#layers-control1").show();
                $("#layers-control2").hide();
                    for (i=0; i<layers2.length; i++) {
                    map.setLayoutProperty(layers2[i][0], 'visibility', 'none');
                }


            map.flyTo({
                    center: city.center,
                    zoom: city.zoom-0.7,
                    bearing:45,
                    pitch: 45,
                    speed: 0.3,
                    curve: 1,
                    easing: function (t) { return t; }
                })

            }

        });

    });


////////////////////////
// modal
//////////////////////// 

//Rate Image
    $("#myBtn_rateImage").click(function(){
        $("#myModal_rateImage").show();
    });

    $(".close").click(function(){
        $("#myModal_rateImage").hide();
    });

    $(window).click(function(e){
        if (e.target == document.getElementById("myModal_rateImage")) {
        $("#myModal_rateImage").hide();
      }
    });

    // //get all image for rating
    // $all_image = glob("/img/rating/{.jpeg}",GLOB_BRACE);
    // foreach(array_rand($all_image,10) as $key) //display 10 image
    // {
    //     echo '<img src="'.$all_image[$key].'" />';
    // }


