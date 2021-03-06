<?php

/**
* @Copyright Ready Bytes Software Labs Pvt. Ltd. (C) 2010- author-Team Joomlaxi
* @license GNU/GPL http://www.gnu.org/copyleft/gpl.html
**/

defined('_JEXEC') or die();

jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');

class XiptLoader
{
     //here we will try to register all MC and libs and helpers
     public static function addAutoLoadFolder($folder, $type, $prefix='Xipt') 
     {
     	foreach(JFolder::files($folder,'.php$') as $file ) {
     		$className      = JString::ucfirst($prefix).
     						  JString::ucfirst($type).
                              JString::ucfirst(JFile::stripExt($file));

            JLoader::register($className, $folder.DS.$file);
           }
        }
        
      public static function addAutoLoadFile($class,$file) {
        if(JFile::getExt($file)==='php')
        	JLoader::register($class, $file);
      }
        
	public static function addAutoLoadViews($baseFolders, $format, $prefix='Xipt') 
	{ 
		foreach(JFolder::folders($baseFolders) as $folder ) {
			//e.g. XiController + Product
			$className 	= JString::ucfirst($prefix)
						. JString::ucfirst('View')
						. JString::ucfirst($folder);
		
			$fileName	= JString::strtolower("view.$format.php");
			JLoader::register($className, $baseFolders.DS.$folder.DS.$fileName);
		}
	}

    public static function addAutoLoadACLRules($baseFolders) 
    {
    	foreach(JFolder::folders($baseFolders) as $folder ) {
			$className 	= $folder;
			$fileName	= JString::strtolower("$folder.php");
			JLoader::register($className, $baseFolders.DS.$folder.DS.$fileName);
		}
	}
}
