$(document).ready(function() {   
    // Attente de l'initialisation du mobile
    document.addEventListener("deviceready", onDeviceReady, false); 
    
    // Configuration du calendrier jQuery
    jQuery.extend(jQuery.mobile.datebox.prototype.options, {
        'dateFormat': 'DD/MM/YYYY',
        'headerFormat': 'DD/MM/YYYY',
        'daysOfWeek' : ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        'daysOfWeekShort' : ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],        
        'monthsOfYear' : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],        
        'monthsOfYearShort' : ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
        'durationLabel' : ['Jours', 'heures', 'Minutes', 'Secondes'],
        'durationDays' : ['Jour', 'Jours'],
        'setDateButtonLabel': 'Valider cette date',
        'setDurationButtonLabel': 'Valider cette durée',
        'setTimeButtonLabel': 'Valider cet horaire',
        'calTodayButtonLabel': 'Aujourd\'hui',
        'titleDateDialogLabel': 'Choisir une date',
        'titleTimeDialogLabel': 'Choisir un horaire',
        // Theming via jQueryMobile
        'pickPageTheme': 'a' // Style de la page
    });
    
    nowDate = new Date();	
	for(i = 0; i <= 5; i++){
		calcDate = addDays(nowDate, i);	
		
		getDay = calcDate.getDate();
		getDayOfWeek = calcDate.getDay();
		getMonth = calcDate.getMonth()+1;
		getYear = calcDate.getYear();
		
		if(getYear < 2000){
			getYear = 1900 + getYear;
		}
		
		vDay = getDay;
		if(vDay < 10){
			vDay = '0' + vDay;	
		}
		vMonth = getMonth;
		if(vMonth < 10){
			vMonth = '0' + vMonth;	
		}
		
		$('#reservation-time-date').append('<option value="' + vDay + '/' + vMonth + '/' + getYear + '">' + formatDate(getDayOfWeek, getDay, getMonth, getYear) + '</option>');
	}
    
    // Efface automatiquement le contenu d'un input s'il s'agit de la valeur par defaut
    $('.input-clean').focusin(function() { 
        // Valeur actuelle
        inputValue = $(this).val();
        
        // Valeur par défaut
        defaultValue = $(this).attr('data-default');
        
        if(inputValue == defaultValue){
            $(this).val('');
        }
    });
    
    // Replace automatiquement la valeur par défaut si le champ est vide
    $('.input-clean').focusout(function() { 
        // Valeur actuelle
        inputValue = $(this).val();
        
        // Valeur par défaut
        defaultValue = $(this).attr('data-default');
        
        if(inputValue == ''){
            $(this).val(defaultValue);
        }
    });

        
    // Tableau contenant les informations de la demande de réservation en cours
    var reservation = new Object();
    reservation['platform'] = '';
    reservation['type'] = ''; // `immediate` / `reservation`
    reservation['subscription'] = ''; 
    reservation['latitude'] = 0; 
    reservation['longitude'] = 0;  
    reservation['address_number'] = '';
    reservation['address_street'] = ''; 
    reservation['address_zip_code'] = '';
    reservation['address_city'] = ''; 
    reservation['address_format'] = ''; 
    reservation['name'] = '';  
    reservation['phone'] = '';  
    reservation['message'] = '';  
    reservation['total_person'] = '';  
    reservation['car'] = ''; 
    reservation['date'] = ''; 
    reservation['time'] = ''; 
    reservation['timestamp'] = '';
    
    
    //------------------------------------------------------------------------------
    // ETAPE 1 : HOME
    //------------------------------------------------------------------------------
    
    // Buttons : immediate || reservation
    $('#immediate').click(function() {      
        reservation['type'] = 'immediate';
        $('#infos .type').html(reservation['type']);
    });    
    $('#reservation').click(function() { 
        reservation['type'] = 'reservation';
        $('#infos .type').html(reservation['type']);
    });
    
    
    //------------------------------------------------------------------------------
    // ETAPE 2 : IMMEDIATE - Adresse
    //------------------------------------------------------------------------------
    
    // Button : Geolocalisation
    $('#immediate-button-geolocalisation').click(function() {  
    	// Affichage de l'annimation de recherche
    	$('.search-position').slideDown('slow');
		
		//document.addEventListener("deviceready", startGeolocalisationSearch, false);
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(GeolocalisationOnSuccess, GeolocalisationOnError);
        }else{
            alert('Impossible de vous localiser.');
            // Affichage de l'annimation de recherche
    		$('.search-position').slideUp('slow');
        }      
    });
    
    // Button : Validation adresse
    $('#immediate-address-validation').click(function() {
        if($('#immediate-address-address').val() == ''){
            alert('Merci de saisir une adresse.');
        }else{
            var geocoder = new google.maps.Geocoder();            
            if (geocoder) {       
            	// Suppression des sauts de ligne
            	var address = deleteRC($('#immediate-address-address').val());
                geocoder.geocode({ 'address': address}, function (results, status) {
                   if (status == google.maps.GeocoderStatus.OK) {    
                       reservation = recupInfo();
                       
                       reservation['latitude'] = results[0].geometry.location.lat(); 
                       reservation['longitude'] = results[0].geometry.location.lng();
                       
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
                       
                       //----
                       $('#infos .latitude').html(reservation['latitude']);
                       $('#infos .longitude').html(reservation['longitude']);
                       $('#infos .address_number').html(reservation['address_number']);
                       $('#infos .address_street').html(reservation['address_street']);
                       $('#infos .address_zip_code').html(reservation['address_zip_code']);
                       $('#infos .address_city').html(reservation['address_city']);
                       $('#infos .address_format').html(reservation['address_format']);
                       //----
                       
                       changePage('#immediate-infos');    
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
                       alert('Service de localisation indisponible.');  
                      return false;
                   }
                });
            }else{
                return false;
            }
        }        
    });    
    
    
    //------------------------------------------------------------------------------
    // ETAPE 3 : IMMEDIATE - Infos
    //------------------------------------------------------------------------------
    
    // Button : Validation infos
    $('#immediate-infos-validation').click(function() { 
        // Mise à jour des informations de récap
        loadRecap('immediate');
        
        // Test de la validité du formulaire
        checkImmediateInfos(reservation, "Merci de renseigner l'ensemble des informations.", "#immediate-recap"); 
    });
    
    
    //------------------------------------------------------------------------------
    // ETAPE 4 : IMMEDIATE - Récap
    //------------------------------------------------------------------------------
    
    // Button : Validation infos
    $('#immediate-recap-confirm').click(function() { 
        // Envoi de la réservation
        sendResa();
        // Déplacement sur la page de remerciements
        changePage('#thanks');
    });
    
    
    //------------------------------------------------------------------------------
    // ETAPE 2 : RESERVATION - Adresse
    //------------------------------------------------------------------------------
    
    // Button : Validation adresse
    $('#reservation-address-validation').click(function() { 
        var address = getValue('#reservation-address-address');
        if(address == ''){
            alert("Merci de renseigner une adresse.");
        }else{
            var geocoder = new google.maps.Geocoder();            
            if (geocoder) {   
            	// Suppression des sauts de ligne
            	address = deleteRC(address);
            	 
                geocoder.geocode({ 'address': address}, function (results, status) { 
                   if (status == google.maps.GeocoderStatus.OK) { 
                       reservation = recupInfo();
                       
                       reservation['latitude'] = ''; 
                       reservation['longitude'] = '';
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
	                   reservation['latitude'] = results[0].geometry.location.lat(); 
                       reservation['longitude'] = results[0].geometry.location.lng();
                       
                       /*
                       reservation['latitude'] = results[0].geometry.location.lat(); 
                       reservation['longitude'] = results[0].geometry.location.lng();
                       reservation['address_number'] = results[0].address_components[0].long_name;
                       reservation['address_street'] = results[0].address_components[1].long_name;  
                       reservation['address_zip_code'] = results[0].address_components[6].long_name;  
                       reservation['address_city'] = results[0].address_components[2].long_name;
                       */
                      
                       // Formatage de l'addresse
                       reservation['address_format'] = addressFormat(reservation);
                       
                       //----
                       $('#infos .latitude').html(reservation['latitude']);
                       $('#infos .longitude').html(reservation['longitude']);
                       $('#infos .address_number').html(reservation['address_number']);
                       $('#infos .address_street').html(reservation['address_street']);
                       $('#infos .address_zip_code').html(reservation['address_zip_code']);
                       $('#infos .address_city').html(reservation['address_city']);
                       $('#infos .address_format').html(reservation['address_format']);
                       //----
                       
                       changePage('#reservation-infos');    
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
                       alert('Service de localisation indisponible.');  
                      return false;
                   }
                });
            }else{
                return false;
            }
        }
    }); 
    
    //------------------------------------------------------------------------------
    // ETAPE 3 : RESERVATION - Infos
    //------------------------------------------------------------------------------
    
    // Button : Validation infos
    $('#reservation-infos-validation').click(function() { 
        checkReservationInfos(reservation, "Merci de renseigner l'ensemble des informations.", "#reservation-time"); 
    });
    
    //------------------------------------------------------------------------------
    // ETAPE 4 : RESERVATION - Time
    //------------------------------------------------------------------------------
    
    // Button : Validation time
    $('#reservation-time-validation').click(function() {
        // Test de la validité du formulaire
        checkReservationTime(reservation, "Merci de renseigner l'ensemble des informations.", "#reservation-recap"); 
    })
    
    //------------------------------------------------------------------------------
    // ETAPE 4 : RESERVATION - Récap
    //------------------------------------------------------------------------------
    
    // Button : Validation infos
    $('#reservation-recap-confirm').click(function() { 
        // Envoi de la réservation
        sendResa();
        // Déplacement sur la page de remerciements
        changePage('#thanks');
    });
    
        
});