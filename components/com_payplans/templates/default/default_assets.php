<?php
/**
* @copyright	Copyright (C) 2009 - 2011 Ready Bytes Software Labs Pvt. Ltd. All rights reserved.
* @license		http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
* @package		PayPlans
* @subpackage	Frontend
* @contact 		shyam@readybytes.in
* website		http://www.jpayplans.com
* Technical Support : Forum -	http://www.jpayplans.com/support/support-forum.html
*/
if(defined('_JEXEC')===false) die();?>

<?php
//common css 
PayplansHtml::stylesheet(PAYPLANS_PATH_MEDIA.'/css/payplans.css');
if(XiFactory::getConfig()->rtl_support){
	PayplansHtml::stylesheet(PAYPLANS_PATH_MEDIA.'/css/rtl.css');
}

// template specific css
PayplansHtml::stylesheet(dirname(__FILE__).'/_media/css/site.css');

PayplansHtml::script(dirname(__FILE__).'/_media/js/site.js');