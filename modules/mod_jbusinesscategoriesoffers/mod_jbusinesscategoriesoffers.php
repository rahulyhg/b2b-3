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
require_once( dirname(__FILE__).'/helper.php' );
require_once JPATH_SITE.'/administrator/components/com_jbusinessdirectory/assets/defines.php'; 
require_once JPATH_SITE.'/administrator/components/com_jbusinessdirectory/assets/utils.php'; 

if(JBusinessUtil::isJoomla3()){
	JHtml::_('jquery.framework', true, true);
}else{
	if(!defined('J_JQUERY_LOADED')) {
		JHTML::_('script',  'components/com_jbusinessdirectory/assets/js/jquery.min.js');
		JHTML::_('script',  'components/com_jbusinessdirectory/assets/js/jquery-noconflict.js');
		define('J_JQUERY_LOADED', 1);
	}
}


JHtml::_('stylesheet', 'components/com_jbusinessdirectory/assets/css/categories.css');
JHtml::_('stylesheet', 'modules/mod_jbusinesscategoriesoffers/assets/style.css');

$language 		= JFactory::getLanguage(); 
$db = JFactory::getDBO();
$query = ' SELECT default_frontend_language FROM #__jbusinessdirectory_applicationsettings LIMIT 1';
$db->setQuery($query);
$list = $db->loadObjectList();

if( JRequest::getVar('_lang') =='' )
{
	if( $list[0]->default_frontend_language =='' )
		JRequest::setVar('_lang',$language->_lang );
	else
		JRequest::setVar('_lang',$list[0]->default_frontend_language );
}
$language_tag 	= JRequest::getVar( '_lang' );

$x = $language->load(
					'com_jbusinessdirectory' , 
					dirname(JPATH_ADMINISTRATOR.'/components/com_jbusinessdirectory/language') , 
					$language_tag, 
					true
				);

$helper = new modJBusinessCategoriesOffersHelper();
$categories =  $helper->getCategories();
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx'));

require( JModuleHelper::getLayoutPath( 'mod_jbusinesscategoriesoffers' ) );

?>