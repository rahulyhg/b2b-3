<?php

/**
-------------------------------------------------------------------------
briefcasefactory - Briefcase Factory 4.0.8
-------------------------------------------------------------------------
 * @author thePHPfactory
 * @copyright Copyright (C) 2011 SKEPSIS Consult SRL. All Rights Reserved.
 * @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * Websites: http://www.thePHPfactory.com
 * Technical Support: Forum - http://www.thePHPfactory.com/forum/
-------------------------------------------------------------------------
*/

defined('_JEXEC') or die;

class BriefcaseFactoryFrontendViewShareUsers extends FactoryView
{
  protected
    $variables = array('form', 'users', 'pagination', 'search'),
    $html = array('behavior.multiselect', 'formbehavior.chosen/select', 'behavior.tooltip'),
    $css = array('modal'),
    $js = array('share')
  ;
}
