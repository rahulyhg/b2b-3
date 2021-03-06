/**
* @copyright	Copyright (C) 2009 - 2013 Ready Bytes Software Labs Pvt. Ltd. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* @package		PayPlans
* @subpackage	Javascript
* @contact 		payplans@readybytes.in
*/

// define payplans, if not defined.
if (typeof(payplans)=='undefined'){
	var payplans = {};
	payplans.$ = payplans.jQuery = xi.jQuery;
	payplans.ajax	= xi.ajax;
}

(function($){
// START : 	
// Scoping code for easy and non-conflicting access to $.
// Should be first line, write code below this line.

	
/*--------------------------------------------------------------
  URL related to works
   	url.modal 		: open a url in modal window
   	url.redirect 	: redirect current window to new url
   	url.fetch		: fetch the url and replace to given node 
--------------------------------------------------------------*/
payplans.url = {
  	modal: function( theurl, options){
	if( typeof options=== "undefined" ){
		var ajaxCall = {'url':theurl, 'data': {}, 'iframe': false};
	}
	
//			if(iframe == null) iframe = false;
//            var ajaxCall = { 'url': theurl, 'data': {}, 'iframe': iframe };
	else
        var ajaxCall = {'url':theurl, 'data':options.data, 'iframe':options.iframe};

		var intentionalClose = false;

		if(  typeof options !== "undefined" && options.intentionalClose == true){
			intentionalClose = true;
		}

        xi.ui.dialog.create(ajaxCall, '', null,null, intentionalClose);
    },
    
    redirect:function(url){
            document.location.href=url;
    },
    
    fetch : function( theurl ){
        payplans.ajax.call(theurl+"&tmpl=component&domObject=payplans&domProperty=replaceWith");
    },
    
    refer : function(){
        $('#payplansPowerdBy').click(function(){
                    var href = $(this).attr('href')
                                  +'?utm_source='+xi_url_base
                                  +'&utm_medium=link&utm_campaign=linkback';
                    $(this).attr('href', href);
                    return true;
            }
        );
    },
    
    submitParentForm: function(action){
        xi.jQuery('input#'+action).parents('form').submit();
    }
};

// 1.4 Backward compatibility
xi.url ={};
xi.url.openInModal	= payplans.url.modal;
xi.url.redirect	  	= payplans.url.redirect;
xi.fetchpage		= payplans.url.fetch;
xi.linkback			= payplans.url.refer
xi.submitAjaxForm   = payplans.url.submitParentForm;
/*--------------------------------------------------------------
  payplans.time
  	- addOffset :
  	- toDate	:
  	- toMysql	:
--------------------------------------------------------------*/
payplans.time = {
	
	addOffset : function(){
		$('.payplans-xidatetime').each(function(){
			if(this.value == ''){
				return;
			}
			var ppDateTime = payplans.time.toDate(this.value);
            ppDateTime.setMinutes(ppDateTime.getMinutes() + (xi_time_offset_minutes));
            this.value = payplans.time.toMysql(ppDateTime);       
        });
    },
    
    removeOffset : function(){
		$('.payplans-xidatetime').each(function(){
			if(this.value == ''){
				return;
			}
			var ppDateTime = payplans.time.toDate(this.value);
			ppDateTime.setMinutes(ppDateTime.getMinutes() - (xi_time_offset_minutes));
			this.value = payplans.time.toMysql(ppDateTime);     
        });
    },

    toDate : function (timestamp) {
		//	function parses mysql datetime string and returns javascript Date object
		//	input has to be in this format: 2007-06-05 15:26:02
    	timestamp = timestamp.replace(/:/gi, " ");
    	timestamp = timestamp.replace(/-/gi, " ");
    	timestamp = timestamp.replace(/ +(?= )/g, "");
    	var parts=timestamp.split(" ");

		if(parts[3] == undefined){
		    parts[3] = '00';
		}
		if(parts[4] == undefined){
		    parts[4] = '00';
		}
		if(parts[5] == undefined){
		    parts[5] = '00';
		}
		
		return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
    },

	toMysql: function (dateObject) {
		//function parses javascript Date object and returns mysql datetime string 
		//input has to be in this format: javascript date object
		var strDate = dateObject.getFullYear()+'-';
		strDate += (parseInt(dateObject.getMonth()) < 9) ? '0'+parseInt(dateObject.getMonth()+1)+'-' : parseInt(dateObject.getMonth()+1)+'-';
		strDate += (parseInt(dateObject.getDate()) < 10) ? '0'+dateObject.getDate()+' ' : dateObject.getDate()+' ';
		
		strDate += (parseInt(dateObject.getHours()) < 10) ? '0'+dateObject.getHours()+':' : dateObject.getHours()+':';
		strDate += (parseInt(dateObject.getMinutes()) < 10) ? '0'+dateObject.getMinutes()+':' : dateObject.getMinutes()+':';
		strDate += (parseInt(dateObject.getSeconds()) < 10) ? '0'+dateObject.getSeconds() : dateObject.getSeconds();
		
		return strDate;
	}
};

//1.4 Backward compatibility
xi.addTimeOffset = payplans.time.addOffset;
xi.payplansDateToMysqlTimeStamp	= payplans.time.toMysql;
xi.payplansMysqlTimeStampToDate	= payplans.time.toDate;


/*--------------------------------------------------------------
  payplans.ui
  	fixHeights : fix few 
--------------------------------------------------------------*/
payplans.ui = {
    // Plugin to make variable height divs equal heights 
    // Call function with div Class and ID using full identification 
    // like # for id and for class. 
	// eg. fixHeights('#display-plan','DIV.payplans-plan')
	sameHeight : function(parent,child) {
		var tallest = 0;
		$(child).each(function(){
		    thisHeight = $(this).height();
		    if(thisHeight > tallest) {
			    tallest = thisHeight;
			}
		});
	
		// Check for IE 9 
		if ($.browser.version = '9.0' && $.browser.msie){
			return true;
		}
		
		if(tallest > 0){
			$(parent).find(child).css({'height': tallest+'px'});
		}
	
		return true;
	},
	
	// Now we are using bootstrap tooltip
	//	tooltip : function(){
//		// Deprecated : maintain old tips, should be removed in 3.1 
//	    $('.payplans .hasTip').tooltip(); 
//	},

	form :{
		value : function(elem){
		    //select box
		    if($(elem).is('select')){
	            var value = '';
	            $(elem).children('option:selected').each(function(){
                    if(value !=''){ value+= ', ';}
                    value +=  $(this).text();
	            });
	            return value;
		    }
		    
		    //radio 
		    if($(elem).is(':radio')){
	            // Joomla have different style of params, so it will not work
	            	if(xi_vars['version']['jfamily'] == '16'){
		    			return $(elem).next('label:first').html();
		    		}
					//for j35
		    		else{
		    			return $(elem).parent('label:first').text();
		    		}
		    }
		    //XITODO : checkboxes
		    //other
		    return $(elem).val().replace(/<(?:.|\s)*?>/g, "");
		}
	}
}

//1.4 Backward compatibility
xi.plan ={};
xi.plan.fixHeights  = payplans.ui.sameHeight;
//xi.addTooltip 		= payplans.ui.tooltip;

xi.form ={};
xi.form.makeReadble	= payplans.ui.form.value;


/*--------------------------------------------------------------
  payplans.ui.form.readable
	  setup : setup the given form to readble 
	 _setup : protected function to prepare the form
	  read  : make form readable
	  edit  : make form editable
--------------------------------------------------------------*/
payplans.ui.form.readable  = {
    _setup : function(form){
		var inputdiv='div.'+form+'-param-value';
        
		//remove all readable cached data
		$('#'+form +' div.readable-wrapper').remove();
                
		$('#'+form+' input:text, input:checked, textarea, select').each(function(){
            //do we already have a editable wrapper, then do not add it
            var paramWrapper = $(this).closest(inputdiv);//  + ' > div.editable');
            var inputWrapper = $('div.editable',paramWrapper);
            
            //create readable value before we update 
            var readable = '<div class="readable readable-wrapper">'+ payplans.ui.form.value(this)+'</div>';
            
	    	//add this class to make input box smaller 
	    	$(this).addClass('input-medium');

            //dont add editable if it have editable class already
            if($(inputWrapper).length <= 0){
                    $(paramWrapper).wrapInner('<div class="editable editable-wrapper">');
            }
            
            // add readable class
            $(paramWrapper).append(readable);                                               
        });
                
        //hide input element                            
		payplans.ui.form.readable.read(form);
	},

    
    edit:function(form){
        $('#'+form+' .readable').hide();
        $('#'+form+' .editable').show();
        
        $('#'+form).removeClass('readable-form');
        $('#'+form).addClass('editable-form');
            
    },
    
    read:function(form){
        $('#'+form+' .readable').show();
        $('#'+form+' .editable').hide();
        
        $('#'+form).addClass('readable-form');
        $('#'+form).removeClass('editable-form');
    },
    
    setup:function(formid){                    
        var hoverClass='pp-mouse-hover';
        payplans.ui.form.readable._setup(formid);
        
        // on Click convert to editable
        $('#'+formid+' .readable').dblclick(function(){
        	payplans.ui.form.readable.edit(formid);
        });
        
        //add it on live 
        $('#'+formid+' .readable').hover(
    		function(){$(this).addClass(hoverClass);},
    		function(){$(this).removeClass(hoverClass);}
        );
    }
};

//1.4 Backward compatibility
xi.form.handleForm	= payplans.ui.form.readable.setup;
xi.form.prepare 	= payplans.ui.form.readable._setup;
xi.form.editable	= payplans.ui.form.readable.edit;
xi.form.readable	= payplans.ui.form.readable.read;


/*--------------------------------------------------------------
  payplans.validate
--------------------------------------------------------------*/
payplans.validate = {
	email : function(fieldId){
        $field = $('#'+fieldId);
        
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        var address = $field.val();
	    if(reg.test(address) == false) {
	        $field.addClass('invalid');
	        return false;
	    }
	    
	    $field.removeClass('invalid');
	    return true;
	},

	notempty : function(fieldId){
		$field = $('#'+fieldId);
    
		var subject = $field.val();
	    if(subject.replace(/\s/g,"") == "") {
	        $field.addClass('invalid');
	        return false;
	    }
	
	    $field.removeClass('invalid');
	    return true;
	}
};	

//1.4 Backward compatibility
xi.support={email:{}};
xi.support.email.validateemail 	= payplans.validate.email;
xi.support.email.validatesubject= payplans.validate.notempty;
xi.support.email.validatebody 	= payplans.validate.notempty;


/*--------------------------------------------------------------
  payplans.order
  	- 
--------------------------------------------------------------*/
payplans.discount = {
        apply: function(orderId){
	
				$('#pp-discount-spinner').addClass('loading');
                var discountCode = $('#app_discount_code_id').val();
                var url = "index.php?option=com_payplans&view=order&task=trigger&event=onPayplansDiscountRequest&id="+orderId;
    			var args   = {'event_args':[orderId,discountCode]};

                //remove the error message
                payplans.discount.error('');
                payplans.ajax.go(url, args);
        },
        
        error: function(message){
                $('#app-discount-apply-error').html('&nbsp;'+message);
                if(message !== ''){
                        $('#app-discount-apply-error').addClass('invalid');
                }else{
                        $('#app-discount-apply-error').removeClass('invalid');
                }
        }
};

//1.4 Backward compatibility
xi.order ={};
xi.order.discount={};
xi.order.discount.apply 		= payplans.discount.apply;
xi.order.discount.displayError 	= payplans.discount.error;

/*--------------------------------------------------------------
  payplans.invoice
	- print :   
--------------------------------------------------------------*/
payplans.invoice = {
		
    print : function(elem) {
       $("#printInvoice").hide();
       var headContent = document.getElementsByTagName('head')[0].innerHTML;
       var html = $(elem).html();
       var invoiceWindow = window.open('', 'Invoice', "status=0,toolbar=0,width=750,height=400");
       invoiceWindow.document.write('<html><head>');
       invoiceWindow.document.write(headContent);
       invoiceWindow.document.write("<\/head><body style='background:#fff !impotant;'>");
       invoiceWindow.document.write('<div id=\"payplans\">' + html + '<\/div>');
       invoiceWindow.document.write('<\/body><\/html>');
       invoiceWindow.document.close();
       invoiceWindow.print();
       
       $("#printInvoice").show();
       return false;
    },
	mailInvoiceLink :function(){
    	$('#pp-admin-invoice-sendlink').contents().find('html').find('form').submit();
    	$('#button-send-invoice').hide();
    	//$('#pp-admin-invoice-sendlink').parent().parent().contents().find("span:contains('Send Mail')").closest('button').hide();
      }
};

//1.4 Backward compatibility
xi.invoice = {};
xi.invoice.print = payplans.invoice.print;


/*--------------------------------------------------------------
payplans.email
	- send 		:  
--------------------------------------------------------------*/
payplans.support = {
	sendemail : function(){
        if(payplans.validate.notempty('email-form-subject') == false
                || payplans.validate.notempty('email-form-from') == false
                || payplans.validate.notempty('email-form-body') == false){
                return false;
        }
           
        var url = 'index.php?option=com_payplans&view=support&task=sendemail';
        
        var args   = {'event_args':[ $('#email-form-subject').val(), $('#email-form-from').val(), $('#email-form-body').val()]};

        payplans.ajax.go(url, args);
    }
};


//1.4 Backward compatibility
xi.support.email = payplans.support.sendemail;


/*--------------------------------------------------------------
wallet recharging
--------------------------------------------------------------*/
payplans.wallet = {
        recharge: function(userId){
                var amount = $('#wallet_recharge_amount').val();
                 if(!amount || amount==0 || isNaN(amount)){
                	$('.recharge-amount-error').show();
                	$("#wallet_recharge_amount").focus();
                	return false;
                }
                
                var url = '';

                if(xi_url_base.indexOf('administrator') == -1){
	            	var appId  = $('#payment_method_id').val();
                    $('#onproceed').attr('disabled','disabled');
	                url = "index.php?option=com_payplans&view=wallet&task=recharge&recharge_amount="+amount+"&payment_method="+appId;
                   
                	payplans.ajax.go(url, amount, payplans.wallet.redirectToPay);
                	return false;
                }
                
                $('#onproceed').attr('disabled','disabled');
            	url = "index.php?option=com_payplans&view=wallet&task=recharge&recharge_amount="+amount+"&user_id="+userId;
            	payplans.ajax.go(url, amount);
        },
        
        redirectToPay: function(data){
        	var paymentKey;
        	for(var i=0; i < data.length; i++){
    			var cmd 		= data[i][0];
    			var id			= data[i][1];
    			var property 	= data[i][2];
    			var data1 		= data[i][3];
    			
    			if(cmd == "payment_key"){
    				paymentKey = id;
    				break;
    			}
        	}

        	var url = "index.php?option=com_payplans&view=payment&task=pay&payment_key="+paymentKey;
			url = xi.route.url(url);
        	location.href= url;
        },
        
        debit: function(userId){
        	 var amount = $('#wallet_recharge_amount').val();
             if(!amount || amount==0 || isNaN(amount)){
            	$('.recharge-amount-error').show();
            	$("#wallet_recharge_amount").focus();
            	return false;
            }
            
            var url = '';
        	
            $('#onproceed').attr('disabled','disabled');
            $('#onproceeddebit').attr('disabled','disabled');
        	url = "index.php?option=com_payplans&view=wallet&task=debit&recharge_amount="+amount+"&user_id="+userId;
        	payplans.ajax.go(url, amount);
        	
        }
};

/*--------------------------------------------------------------
 Login
--------------------------------------------------------------*/
payplans.user = {
		
		//open a popup for login
		openLoginPopup: function(returnUrl){
			url = 'index.php?option=com_payplans&view=user&task=showloginpopup&returnUrl='+returnUrl;
			payplans.url.modal(url);
		},
                 
        // open a popup for login+subscribe module
		openAuthenticatePopup: function(returnUrl, message){
			url = 'index.php?option=com_payplans&view=user&task=userAuthenticationPopup&returnUrl='+returnUrl+'&message='+message;
	        payplans.url.modal(url);
		},
		
		//login through username/password
		login: function(returnUrl){
			var username = $('.payplansLoginUsername').val();
			var password = $('.payplansLoginPassword').val();
			var url      = "index.php?option=com_payplans&view=user&task=login";
			var args     = { 'event_args' : {'returnUrl' : returnUrl, 'username' : username, 'password' : password } };
			payplans.ajax.go(url, args);
		}
};

payplans.site = {		
		onclickYes: function(url, element){		
                    $('#button-clickonyes').attr('disabled','disabled');
	                payplans.ajax.go(url);
        }
};

/*--------------------------------------------------------------
  on Document ready 
--------------------------------------------------------------*/
payplans.jQuery(document).ready(function(){

	// enable ui-buttons
    $('.payplans .pp-button').each(function(){
        var attr = {};
        
        var icon = $(this).attr('icon');
        if(typeof(icon) !== 'undefined'){
        	attr.icons = {primary:icon};
        }
        
        $(this).button(attr);
    });
    
	/*
	 * for radio button in j25
	 */
    if(xi_vars['version']['jfamily'] == '16'){
    	
	    /*
	     * set the bind the click event on the lables
	     */
	    $("div.btn-group > label.btn, label:not(.active)").click(function() {
	        var label = $(this);
	        var input = label.prev();
	
	        if (!input.prop('checked')) {
	            label.closest('.btn-group').find("label").removeClass('active btn-success btn-danger btn-primary');
	            if(input.val()== '') {
	                    label.addClass('active btn-primary');
	             } 
	            else if(input.val()==0) {
	                    label.addClass('active btn-danger');
	            } 
	            else {
	            	 label.addClass('active btn-success');
	            }
	            input.prop('checked', true);
	        }
	     });
	
	    /*
	     * set the button classes 
	     */
	    $('.payplans .btn-group').each(function(){
                  
	         $('.btn-group label').addClass(' btn ');   
		     
	         $(".btn-group input").each(function() {
	        
	        	 if ($(this).is(':checked')) {
	        		 
					if ($(this).val()== '') {
						$(this).next().addClass('active btn-primary');
			        } 
					else if ($(this).val()==0) {
						$(this).next().addClass('active btn-danger');
			        } 
					else {
						$(this).next().addClass('active btn-success');
			        }
	        	 }
			});  	
	    });
    }
    
    //disable readonly inputs
    $('#payplans .readonly').attr("disabled", true);
    
    // setup link back
    payplans.url.refer();
    
    //setup offset for date-time fields
    payplans.time.addOffset();
    
 	
 	// setup validval
	$('.payplans form').find("input,textarea,select").not(':hidden').jqBootstrapValidation();
 	
    // setup tooltip
    //payplans.ui.tooltip();  
    
    // setup timeago
    // for translation we need to put here
    $.timeago.settings.strings={
	     prefixAgo: null,
	     prefixFromNow: null,
	     suffixAgo: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_SUFFIX_AGO', 'ago'),
	     suffixFromNow: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_SUFFIX_FROM_NOW', 'from now'),
	     seconds: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_SECONDS', 'less than a minute'),
	     minute: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_MINUTE', 'about a minute'),
	     minutes: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_MINUTES', '%d minutes'),
	     hour: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_HOUR', 'about an hour'),
	     hours: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_HOURS', 'about %d hours'),
	     day: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_DAY', 'a day'),
	     days: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_DAYS', '%d days'),
	     month: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_MONTH', 'about a month'),
	     months: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_MONTHS', '%d months'),
	     year: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_YEAR', 'about a year'),
	     years: Joomla.JText._('COM_PAYPLANS_JS_TIMEAGO_YEARS', '%d years'),
	     numbers: [] 
    };
    $(".payplans .timeago").timeago();

	//needed some fix to show radio button properly in front-end
    // Turn radios into btn-group
	$('.radio.btn-group label').addClass('btn');
	$(".btn-group label:not(.active)").click(function()
	{
		var label = $(this);
		var input = $('#' + label.attr('for'));

		if (!input.prop('checked')) {
			label.closest('.btn-group').find("label").removeClass('active btn-success btn-danger btn-primary');
			if (input.val() == '') {
				label.addClass('active btn-primary');
			} else if (input.val() == 0) {
				label.addClass('active btn-danger');
			} else {
				label.addClass('active btn-success');
			}
			input.prop('checked', true);
		}
	});
	$(".btn-group input[checked=checked]").each(function()
	{
		if ($(this).val() == '') {
			$("label[for=" + $(this).attr('id') + "]").addClass('active btn-primary');
		} else if ($(this).val() == 0) {
			$("label[for=" + $(this).attr('id') + "]").addClass('active btn-danger');
		} else {
			$("label[for=" + $(this).attr('id') + "]").addClass('active btn-success');
		}
	});
    
});


// ENDING :
// Scoping code for easy and non-conflicting access to $.
// Should be last line, write code above this line.
})(payplans.jQuery);

