$(function () {

    //
    $('#submit').on('click',function (){

        $location = $('#location').val();
        if($location){
            // calling getRiding function with location entered by user as parameter
            getRiding($location);
        }else {
            alert("Please enter your Address or Postal Code.");
        }
    });
    
    

    function getRiding($location) {

        /*
        getRiding function ->
        1) This function will get the values from the text field and convert them into geocode.
           this will be achieved by using Google's Geocode API.
            Example - https://maps.googleapis.com/maps/api/geocode/json?address=m5v1b1&key=AIzaSyD0FH0qHadaGu0z63zzfCd_i0Mgb1KCzgU
           From here we will get Latitude and Longitude.
           
        2) Using the Latitude and Longitude we will send a Ajax GET request to Open North's API and find the Riding.
            Example - https://represent.opennorth.ca/boundaries/?contains=43.7733946,-79.4940824
            
        */

        $location_url = encodeURI($location);
        $key = 'AIzaSyD0FH0qHadaGu0z63zzfCd_i0Mgb1KCzgU';
        $key_url = encodeURI($key);
        $geocode = '';
        
        // request to Google geocode API
        $.ajax({
            type: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+$location_url+'&key='+$key_url,
            success:function (GoogleData) {
                console.log('Google API data loaded successfully');
                
                $lat = GoogleData.results[0].geometry.location.lat;
                $lng = GoogleData.results[0].geometry.location.lng;
                
                $geocode = $lat + ',' + $lng;
                
                $geocode_url = encodeURI($geocode);
                
                
                // request to Open North API
                $.ajax({
                    type:'GET',
                    url:'http://represent.opennorth.ca/boundaries/?contains='+$geocode_url,
                    success:function (OpenNorthData) {

                        console.log('Open North API data loaded successfully');
                        
                        $riding_array=[];
                        $ctr = 0;
                        for ($j = 0; $j <OpenNorthData.objects.length ; $j++) {
                            
                            // Here we are only getting the ridings that are from Ontario i.e. no Federal ridings.
                            if (OpenNorthData.objects[$j].boundary_set_name =='Ontario electoral district') {

                                $riding_array[$ctr] = OpenNorthData.objects[$j].name;
                                $ctr++;
                                
                            }
                        }
                        $riding = $riding_array[0];
                        document.getElementById('riding').innerHTML=$riding;
                        
                    }
                })
                
            }
        })
        
    }

});