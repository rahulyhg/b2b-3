<?php
/*------------------------------------------------------------------------
# JBusinessDirectory
# author CMSJunkie
# copyright Copyright (C) 2012 cmsjunkie.com. All Rights Reserved.
# @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
# Websites: http://www.cmsjunkie.com
# Technical Support:  Forum - http://www.cmsjunkie.com/forum/j-businessdirectory/?p=1
-------------------------------------------------------------------------*/

defined( '_JEXEC' ) or die( 'Restricted access' );


// Include the syndicate functions only once
require_once JPATH_SITE.'/administrator/components/com_jbusinessdirectory/assets/defines.php'; 
require_once JPATH_SITE.'/administrator/components/com_jbusinessdirectory/assets/utils.php'; 
require_once( dirname(__FILE__).DS.'helper.php' );

if(JBusinessUtil::isJoomla3()){
	JHtml::_('jquery.framework', true, true);
}else{
	if(!defined('J_JQUERY_LOADED')) {
		JHTML::_('script',  'components/com_jbusinessdirectory/assets/js/jquery.min.js');
		JHTML::_('script',  'components/com_jbusinessdirectory/assets/js/jquery-noconflict.js');
		define('J_JQUERY_LOADED', 1);
	}
}

$helper = new modJBusinessOfferHelper();
$offer =  $helper->getOffer();
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx'));
require( JModuleHelper::getLayoutPath( 'mod_jbusinessoffer' ) );

?>