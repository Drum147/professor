jQuery(document).ready(function() {

	var cardOffset;
	var cardTop;

	jQuery("#customize-preview").show("fast", function(){

		cardOffset = jQuery("#customize-preview").offset();
		cardTop = jQuery("#customize-preview").css( "top" );
	});

	jQuery(document).scroll(function() {

		if( cardTop == jQuery("#customize-preview").css( "top" ) ) {

			cardOffset = jQuery("#customize-preview").offset();
		}

		if( ( cardOffset.top - 90 ) < jQuery(this).scrollTop() ) {

			var top = jQuery(this).scrollTop() - cardOffset.top + 90 + parseInt( cardTop, 10 );

			jQuery("#customize-preview").css( "top", top + "px" );

		} else {

			jQuery("#customize-preview").css( "top", "" );
		}
	});

	jQuery("#customize-tab-toogle").click(function(e){
		e.preventDefault();
		jQuery("#customize-tab-toogle").parent().hide();
		jQuery("#customize-tab").slideToggle("slow");
	});

	jQuery("#range-style-indenting-vertical").range({
		min: 0,
		max: 300,
		start: jQuery("#display-style-indenting-vertical").text(),
		onChange: function(value) {
			jQuery("#display-style-indenting-vertical").html( value );
			jQuery("[name=style_indenting_vertical]").val( value );
		}
	});
	jQuery("#range-style-indenting-horizontal").range({
		min: 0,
		max: 300,
		start: jQuery("#display-style-indenting-horizontal").text(),
		onChange: function(value) {
			jQuery("#display-style-indenting-horizontal").html( value );
			jQuery("[name=style_indenting_horizontal]").val( value );
		}
	});
	
	//

	conveythisSettings.effect(function(){
		jQuery('#customize-view-button').transition('pulse');
	});
	conveythisSettings.view();

	jQuery('.ui.dropdown').dropdown({
		onChange: function() {
			conveythisSettings.view();
		}
	});

	jQuery('.conveythis-reset').on('click', function(e) {
		e.preventDefault();
		jQuery(this).parent().parent().find('.ui.dropdown').dropdown('clear');
	});
	
	jQuery('.conveythis-delete-page').on('click', function(e) {
		e.preventDefault();
		jQuery(this).parent().remove();
	});
	
	jQuery('#add_blockpage').on('click', function(e) {
		e.preventDefault();
		
		let blockpage = '<div class="blockpage">'+
							'<input type="url" name="blockpages[]" class="form-control" placeholder="https://example.com" style="width: 515px;"> '+
							'<button class="conveythis-delete-page">X</button>'+
						'</div>';
		jQuery("#blockpages_wrapper").append(blockpage);
		
	});
	
	function showPositionType(type){

		if(type == 'custom'){
			jQuery('#position-fixed').fadeOut();
			jQuery('#position-custom').fadeIn();
		}else{
			jQuery('#position-custom').fadeOut();
			jQuery('#position-fixed').fadeIn();
		}
	}

	jQuery('input[name=style_position_type]').change(function(){
		// console.log(this.value);
		showPositionType(this.value);
	});
	
	function getUserPlan(){
		
		try{
			let apiKey = jQuery("#conveythis_api_key").val(); 
			
			if(apiKey){
				jQuery.ajax({
					url: "https://api.conveythis.com/25/admin/account/plan/api-key/"+apiKey+"/", 
					success: function(result){
						
						if(result.data && result.data.languages){
							const maxLanguages = result.data.languages;
							
							jQuery('.dropdown-target-languages').dropdown({
								maxSelections: maxLanguages,
								message: {
									maxSelections: 'Need more languages? <a href="/dashboard/pricing" target="_blank">Upgrade your plan</a>.'
								},
								onChange: function() {
									conveythisSettings.view();
								}
							});
							
							let tempLanguages = jQuery('.dropdown-target-languages').dropdown('get value');
							if(tempLanguages){
								try{
									let tempLanguagesArray = tempLanguages.split(",");
									if(tempLanguagesArray.length > maxLanguages){									
										let allowedLanguages = [];
										for(let i = 0; i < maxLanguages; i++)
											allowedLanguages.push(tempLanguagesArray[i]);
										let allowedLanguagesStr = allowedLanguages.join(",");
										jQuery('.dropdown-target-languages').dropdown('set value', allowedLanguagesStr);
										
										setTimeout(function(){
											jQuery('.dropdown-target-languages').dropdown('set selected', allowedLanguagesStr);
										},200);
									}
								}catch(e){}
							}
							
						}else{
							setTimeout(function(){
								getUserPlan();
							},2500);
						}
					}
				});
			}else{
				setTimeout(function(){
					getUserPlan();
				},2500);
			}
		}catch(e){}
	}
	
	setTimeout(function(){
		getUserPlan();
	},1000);

});