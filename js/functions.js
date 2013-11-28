
//------------------------------------------------------------------------------
// IDENTIFICATION MATERIEL
var idcourse;

function onDeviceReady() {
	var version = '1.0';
	var appdate = '2011-09-02 10:02';
	var debug = false;
	
	// Récupération de la plateforme d'éxécution
	var devicePlatform = device.platform; 	
	$('#infos .platform').html(devicePlatform);
	
	// Enregistrement de l'uuid dans la base Publicom
	var deviceID = device.uuid;
	//saveUuid(devicePlatform, deviceID); 
	
	// Gestion des boutons matériels
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    
    // En mode début, affichage d'infos complémentaires
    if(debug == true){
    	$('#app').slideDown('slow');
	    $('#app .platform').html(devicePlatform);
	    $('#app .uuid').html(deviceID);
	    $('#app .version').html(version);  
	    $('#app .appdate').html(appdate);   	
    }  
}

//------------------------------------------------------------------------------
// GESTION DES BOUTONS MATERIEL

// Bouton retour
function onBackKeyDown() {
    //history.back();
    changePage('#home');
}

// Bouton menu
function onMenuKeyDown() {
    changePage('#home');
}
    

//------------------------------------------------------------------------------
// ANIMATION TRANSITION

// Animation par défaut des changements de page
function changePage(page){
    $.mobile.changePage( page, {
        transition: "slide",
        reverse: false,
        changeHash: false
    });
}


//------------------------------------------------------------------------------
// FONCTIONS DE FORMULAIRES

// Vérification de n° de téléphone
function isPhoneNumber(str) {
    //var phone2 = /^(\+\d)*\s*(\(\d{3}\)\s*)*\d{3}(-{0,1}|\s{0,1})\d{2}(-{0,1}|\s{0,1})\d{2}$/; 
    var phone = new RegExp(/^0[6-7]([\.|\-|\s]*[0-9]{2}){4}$/);
    if (str.match(phone)) {
        return true;
    } else {
        return false;
    }
}

// Suppression des sauts de ligne de l'adresse
function deleteRC(string){
	var rc = new RegExp("(\r\n|\r|\n)", "g" );
	return string.replace(rc, ' ');
}

// Récupération de l'ensemble des données
function recupInfo(){
    var reservation = new Object();
	
    reservation['platform'] = $('#infos .platform').html();
    reservation['type'] = $('#infos .type').html();
    reservation['subscription'] = $('#infos .subscription').html();
    reservation['latitude'] = $('#infos .latitude').html();
    reservation['longitude'] = $('#infos .longitude').html();
    reservation['address_number'] = $('#infos .address_number').html();
    reservation['address_street'] = $('#infos .address_street').html();
    reservation['address_zip_code'] = $('#infos .address_zip_code').html();
    reservation['address_city'] = $('#infos .address_city').html();
    reservation['address_format'] = $('#infos .address_format').html();
    reservation['name'] = $('#infos .name').html();
    reservation['phone'] = $('#infos .phone').html();
    reservation['message'] = $('#infos .message').html();
    reservation['total_person'] = $('#infos .total_person').html();
    reservation['car'] = $('#infos .car').html();
    reservation['date'] = $('#infos .date').html();
    reservation['time'] = $('#infos .time').html();
    reservation['timestamp'] = $('#infos .timestamp').html();
    
    return reservation;
}

// Mise à jour des données de récapitulatif
function loadRecap(type){
    reservation = recupInfo();
    
    $('#' + type + '-recap-platform').html(reservation['platform']);
    if(reservation['subscription'] != ''){    	
    	$('#' + type + '-recap-subscription').html(' ('+reservation['subscription']+')');	
    }else{
    	$('#' + type + '-recap-subscription').html('');		
    }
    $('#' + type + '-recap-type').html(reservation['type']);
    $('#' + type + '-recap-latitude').html(reservation['latitude']);
    $('#' + type + '-recap-longitude').html(reservation['longitude']);
    $('#' + type + '-recap-name').html(reservation['name']);
    $('#' + type + '-recap-address_number').html(reservation['address_number']);
    $('#' + type + '-recap-address_street').html(reservation['address_street']);
    $('#' + type + '-recap-address_zip_code').html(reservation['address_zip_code']);
    $('#' + type + '-recap-address_city').html(reservation['address_city']);
    $('#' + type + '-recap-address_format').html(reservation['address_format']);
    $('#' + type + '-recap-phone').html(reservation['phone']);
    $('#' + type + '-recap-message').html(reservation['message']);
    $('#' + type + '-recap-total_person').html(reservation['total_person']);
    $('#' + type + '-recap-car').html(reservation['car']);
    $('#' + type + '-recap-date').html(reservation['date']);
    $('#' + type + '-recap-time').html(reservation['time']);
    $('#' + type + '-recap-timestamp').html(reservation['timestamp']);
}
    
// Récupère la valeur d'un champ
function getValue(id){
    // Valeur actuelle
    inputValue = $(id).val();
    
    // Valeur par défaut
    defaultValue = $(id).attr('data-default');
    
    if(inputValue != defaultValue){
        return inputValue;
    }else{
        return '';
    }
}

// <!-- PAGE : DEMANDE IMMEDIATE : Infos -->
// Fonction de contrôle du formulaire de renseignement de l'addresse immédiate
function checkImmediateInfos(reservation, errorMessage, page){
    reservation['subscription'] = getValue('#immediate-address-subscription');
    reservation['name'] = getValue('#immediate-address-name');
    reservation['phone'] = getValue('#immediate-address-phone');
    reservation['message'] = getValue('#immediate-address-message');
    reservation['total_person'] = $('#immediate-address-total_person').val();
    reservation['car'] = $('#immediate-address-car').val();
    
    if(reservation['name'] == '' || 
       reservation['phone'] == '' || 
       reservation['total_person'] == '' || 
       reservation['total_person'] == 0 || 
       reservation['car'] == '' 
    ){
        alert(errorMessage);
    }else if(!isPhoneNumber(reservation['phone'])){
        alert('Veuillez saisir un numéro de téléphone mobile valide (06).');
    }else{        
        // Mise à jour des données d'info
     	$('#infos .subscription').html(reservation['subscription']);
        $('#infos .name').html(reservation['name']);
        $('#infos .phone').html(reservation['phone']);
        $('#infos .message').html(reservation['message']);
        $('#infos .total_person').html(reservation['total_person']);
        $('#infos .car').html(reservation['car']);
        
        // Poursuite du parcours
        changePage(page);
        
        // Mise à jour des informations de récap
        loadRecap('immediate');
    }
}

// <!-- PAGE : RESERVATION : Infos -->
// Fonction de contrôle du formulaire de renseignement des infos en réservation
function checkReservationInfos(reservation, errorMessage, page){
  reservation['subscription'] = getValue('#reservation-address-subscription');
  reservation['name'] = getValue('#reservation-address-name');
  reservation['phone'] = getValue('#reservation-address-phone');
  reservation['message'] = getValue('#reservation-address-message');
  reservation['total_person'] = $('#reservation-address-total_person').val();
  reservation['car'] = $('#reservation-address-car').val();
  
  if(reservation['name'] == '' || 
     reservation['phone'] == '' || 
     reservation['total_person'] == '' || 
     reservation['total_person'] == 0 || 
     reservation['car'] == '' 
  ){
      alert(errorMessage);
  }else if(!isPhoneNumber(reservation['phone'])){
      alert('Veuillez saisir un numéro de téléphone mobile valide (06).');
  }else{
      // Mise à jour des données d'info
      $('#infos .subscription').html(reservation['subscription']);
      $('#infos .name').html(reservation['name']);
      $('#infos .phone').html(reservation['phone']);
      $('#infos .message').html(reservation['message']);
      $('#infos .total_person').html(reservation['total_person']);
      $('#infos .car').html(reservation['car']);
      
      // Poursuite du parcours
      changePage(page);
  }
}

// <!-- PAGE : RESERVATION : Times -->
// Fonction de contrôle du formulaire de renseignement de l'horaire
function checkReservationTime(reservation, errorMessage, page){
    reservation['date'] = $('#reservation-time-date').val();
    var hour = $('#reservation-time-hour').val()
    var minute = $('#reservation-time-minute').val();
    if(hour < 10){
    	hour = '0'+hour;
    }
    if(minute < 10){
    	minute = '0'+minute;
    }    
    reservation['time'] = hour+':'+minute
    
    if(reservation['date'] == '' || 
       reservation['time'] == ''
      ){
             alert(errorMessage);
      }else{
         // Mise à jour des données d'info
         $('#infos .date').html(reservation['date']);
         $('#infos .time').html(reservation['time']);         
         
         // Mise à jour des informations de récap
         loadRecap('reservation');

         // Poursuite du parcours
         changePage(page);
     }
}


//------------------------------------------------------------------------------
//ADDRESS FORMAT

function addressFormat(reservation){
 reservation['address_format'] = '';
 
 if(reservation['address_number'] != ''){
     reservation['address_format'] += reservation['address_number'];
 }
 if(reservation['address_street'] != ''){
     reservation['address_format'] += ' ' + reservation['address_street'];
 }
 if(reservation['address_zip_code'] != ''){
     reservation['address_format'] += ' ' + reservation['address_zip_code'];
 }
 if(reservation['address_city'] != ''){
     reservation['address_format'] += ' ' + reservation['address_city'];
 }
 
//Mise à jour des données d'info
 $('#infos .address_format').html(reservation['address_format']);
 
 return reservation['address_format'];
}


//------------------------------------------------------------------------------
//GEOLOCALISATION

function startGeolocalisationSearch(){
	alert('startGeolocalisationSearch');
	 navigator.geolocation.getCurrentPosition(GeolocalisationOnSuccess, GeolocalisationOnError);
}

//Renseigne la position GPS de l'internaute
function GeolocalisationOnSuccess(position) {
 if(position.coords.latitude == 0 && position.coords.longitude == 0){     
     // Masquage de l'annimation de recherche
	 $('.search-position').slideUp('slow');
     alert('Localisation impossible, merci de saisir votre addresse.');
     return false;
 }else{ 
     reservation['latitude'] = position.coords.latitude; 
     reservation['longitude'] = position.coords.longitude;
     
     //----
     $('#infos .latitude').html(reservation['latitude']);
     $('#infos .longitude').html(reservation['longitude']);
     //----

     var geocoder = new google.maps.Geocoder();
     var latlng = new google.maps.LatLng(reservation['latitude'], reservation['longitude']);
    
     if (geocoder) { 
         geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {             
                	reservation['address_number'] = '';
                    reservation['address_street'] = '';
                    reservation['address_zip_code'] = '';
                    reservation['address_city'] = '';
                    
                    // Récupération des informations de localisation
                    for(i = 0 ; i < results[0].address_components.length ; i++){
                    	typesGmap = results[0].address_components[i].types;
                    	if(inArray(typesGmap, 'street_number')){
                    		reservation['address_number'] = results[0].address_components[i].long_name;	
                    	}
                    	if(inArray(typesGmap, 'route')){
                    		reservation['address_street'] = results[0].address_components[i].long_name;	
                    	}
                    	if(inArray(typesGmap, 'locality')){
                    		reservation['address_city'] = results[0].address_components[i].long_name;	
                    	}
                    	if(inArray(typesGmap, 'postal_code')){
                    		reservation['address_zip_code'] = results[0].address_components[i].long_name;	
                    	}
                    }
                    
                    /*
                    reservation['address_number'] = results[0].address_components[0].long_name;
                    reservation['address_street'] = results[0].address_components[1].long_name;  
                    reservation['address_zip_code'] = results[0].address_components[6].long_name;  
                    reservation['address_city'] = results[0].address_components[2].long_name;                    
                    */
                   
                    // Formatage de l'addresse
                    reservation['address_format'] = addressFormat(reservation);
                    $('#immediate-address-address').val(reservation['address_format']);
                    
                    //----
                    $('#infos .address_number').html(reservation['address_number']);
                    $('#infos .address_street').html(reservation['address_street']);
                    $('#infos .address_zip_code').html(reservation['address_zip_code']);
                    $('#infos .address_city').html(reservation['address_city']);
                    $('#infos .address_format').html(reservation['address_format']);
                    //----     
                    
                    // Masquage de l'annimation de recherche
	 				$('.search-position').slideUp('slow');               
                }else{                
                    return false;
                }
            }else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                alert('Adresse introuvable.');        
                return false;
            }else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                alert('Quota de localisation d&eacute;pass&eacute;.');        
                return false;
            }else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
                alert('Demande de localisation refus&eacute;e.');        
                return false;
            }else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
                alert('Demande de localisation invalide.');        
                return false;
            }else {
               return false;
            }
         });
     }else{  
         return false;
     }  
     
     return true;
 }    
};

//Gestion des messages d'erreur en fonction des problèmes rencontrés lors de la géolocalisation
function GeolocalisationOnError(error) {
     switch(error.code){
         case 'PERMISSION_DENIED' :
             alert('Vous devez autoriser l\'application a acc&eacute;der aux informations de localisation.');
             break;
         case 'TIMEOUT' :
             alert('D&eacute;lais de localisation expir&eacute;, merci de saisir votre addresse.');
             break;
         case 'POSITION_UNAVAILABLE' :
             alert('Localisation impossible, merci de saisir votre addresse.');
             break;
         default :
             alert('Localisation impossible, merci de saisir votre addresse.');
             break;
     }    
     // Masquage de l'annimation de recherche
	 $('.search-position').slideUp('slow');  
}


// Envoi la demande au script PHP chargé de créer le fichier xml de résa
function sendResa(){
    // Récupération des dernières informations
    reservation = recupInfo();
    
	var myDate = new Date();
	idcourse = myDate.getTime();
    // Contruction de l'url des paramètres
	/*
    if(reservation['date'] == '' || reservation['time'] == '')
	{
		cmd = false;
	}
	else {
		cmd = true;
	}
	if (reservation['type'] == 'immediate')
	{
		cmd = false;
	}
	else {
		cmd = true;
	}	
	*/
    operator = reservation['subscription'];
    lat = reservation['latitude'];
    lng = reservation['longitude'];
    rdvpoint = reservation['address_format'];
	comments = '<ul>Application STM<li>Nom du client : ' + reservation['name'] + '</li><li>Paiement CB : Inconnu</li><li>Nombre de passagers : ' + reservation['total_person'] + '</li><li>Type de vehicule : ' + reservation['car'] + '</li><li>Autres infos : ' + reservation['message'] + '</li></ul>';
    cell = reservation['phone'];
    date = reservation['date'];
    when = reservation['time'];
    var url = '';
	/*
    for(var name in reservation){
        url = url + "&" + name + '=' + reservation[name];
    }
	*/
	// diary.php?taxi=' + name + '&tel=' + address + '&rdvpoint=' + rdvpoint + '&distance=' + distance + '&lat=' + rdvlat + '&lng=' + rdvlng + '&lat2=' + lat2 + '&lng2=' + lng2 + '&idcourse=' + idcourse + '&comments=' + comments + '&dest=' + dest + '&cell=' + cell + '&when=' + when + '&date=' + date + '&operator=' + operator + '&group=' + group + '&ack=0&db=1
	url = "taxi=0000&tel=0000000000&idcourse=" + idcourse + '&rdvpoint=' + rdvpoint + '&lat=' + lat + '&lng=' + lng + '&comments=' + comments + '&cell=' + cell + '&when=' + when + '&date=' + date + '&operator=' + operator + '&group=1&ack=0&db=1';
    //url = encodeURI(url);
	url = url.replace(/'/g, "&rsquo;");
	
    // Sends Request to TaxiMedia Server
	$.post("https://ssl14.ovh.net/~taxibleu/server/diary_app_stm.php", url, function(data) {
	});
    // Requête au serveur Publicom pour traitement PHP
	/*
    $.ajax({
        url: "http://clients.publicom.fr/stm/reservation_2012.php",
        type: "POST",
        data: url,
        error: function(){
          alert('Serveur indisponible, merci de nous contacter au 04 91 92 92 92');
        }
    });
	*/
}
function check_answer()
{
	//$.mobile.changePage( $("#urgency"), { transition: "slide"} );
	sec = setInterval( function () {
		$.post("https://ssl14.ovh.net/~taxibleu/server/status.php?idcourse=" + idcourse + "&check=1" , { }, function(data){ 
			if (data != 0)
			{
				stopCall();
				//$('#dblinks').append($('<input id="stop" type="hidden" value="1" />'));
				var box = alert(data);
				//$('#thanksResults').empty().append(data);
			}
		}); 
	}, 2000);
	return false;
}
function stopCall()
{
	//alert(idcourse);
	$.post("https://ssl14.ovh.net/~taxibleu/server/diary.php?idcourse=" + idcourse + "&ack=1&db=1&cab_wont=1&del=1", { }, function(data){
		//$.mobile.changePage( $("#home"), { transition: "slide"} );
	}).done(changePage('#home'));
	//$.sessionStorage.setItem('idcourseUrg', false);
	clearInterval(sec);
}


// Sauvegarde de l'uuid du téléphone dans la base Publicom
function saveUuid(devicePlatform, deviceID){
	// Requête au serveur Publicom pour traitement PHP
	/*
    $.ajax({
        url: "http://clients.publicom.fr/stm/uuid.php",
        type: "POST",
        data: "&uuid=" + deviceID + "&platform=" + devicePlatform,
        error: function(){
          alert('Serveur indisponible, merci de nous contacter au 04 91 92 92 92');
        }
    });
	*/
}

// Equivalent in_array() PHP
function inArray(array, p_val) {
    var l = array.length;
    for(var i = 0; i < l; i++) {
        if(array[i] == p_val) {
            return true;
        }
    }
    return false;
}

// Fonction d'ajout de jour à une date
function addDays(d, j){
 	return new Date(d.getTime() + (1000 * 60 * 60 * 24 * j));
}
	
// Formatage d'une date	
function formatDate(dw, d, m, y){		
	dateDays = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
	dateMonths = new Array("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre");
	
	return dateDays[dw] + " " + d + " " + dateMonths[m-1] + " " + y;	
}