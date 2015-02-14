<?php
/**
* @copyright	Copyright (C) 2009 - 2012 Ready Bytes Software Labs Pvt. Ltd. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* @package		RB Framework
* @subpackage	Frontend
* @contact 		shyam@readybytes.in
*/
if(defined('_JEXEC')===false) die('Restricted access' );

// ******************************************************************************
// A reversible password encryption routine by:
// Copyright 2003-2009 by A J Marston <http://www.tonymarston.net>
// Distributed under the GNU General Public Licence
// Modification: May 2007, M. Kolar <http://mkolar.org>:
// No need for repeating the first character of scramble strings at the end;
// instead using the exact inverse function transforming $num2 to $num1.
// Modification: Jan 2009, A J Marston <http://www.tonymarston.net>:
// Use mb_substr() if it is available (for multibyte characters).
// ******************************************************************************

class Rb_Encryptor{

    var $scramble1 = '';     // 1st string of ASCII characters
    var $scramble2 = '';     // 2nd string of ASCII characters

    var $errors;        // array of error messages
    var $adj;           // 1st adjustment value (optional)
    var $mod;           // 2nd adjustment value (optional)

    var $key;
    var $sourcelen;
    // ****************************************************************************
    // class constructor
    // ****************************************************************************
    function __construct($key)
    {
        $this->errors = array();

        // Each of these two strings must contain the same characters, but in a different order.
        // Use only printable characters from the ASCII table.
        // Do not use single quote, double quote or backslash as these have special meanings in PHP.
        // Each character can only appear once in each string.
        $this->scramble1 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $this->scramble2 = 'UKAH652LMOQFBDIEG03JT17N4C89XPVWRSYZ';
		$this->key		 = $key;
		$this->sourcelen = 12;
		
        if (strlen($this->scramble1) <> strlen($this->scramble2)) {
            Rb_Error::assert(false, JText::_('PLG_SYSTEM_RBSL_ERROR_ENCRYPTOR_SCRAMBLE'), Rb_Error::ERROR);
        } // if

        $this->adj = 1.75;  // this value is added to the rolling fudgefactors
        $this->mod = 3;     // if divisible by this the adjustment is made negative

    } // constructor

    // ****************************************************************************
    function decrypt ($source)
    // decrypt string into its original form
    {
        $this->errors = array();

        // convert $key into a sequence of numbers
        $fudgefactor = $this->_convertKey();
        if ($this->errors) return;

        if (empty($source)) {
            $this->errors[] = 'No value has been supplied for decryption';
            return;
        } // if

        $target = null;
        $factor2 = 0;

        for ($i = 0; $i < strlen($source); $i++) {
            // extract a (multibyte) character from $source
            if (function_exists('mb_substr')) {
                $char2 = mb_substr($source, $i, 1);
            } else {
                $char2 = substr($source, $i, 1);
            } // if

            // identify its position in $scramble2
            $num2 = strpos($this->scramble2, $char2);
            if ($num2 === false) {
                $this->errors[] = "Source string contains an invalid character ($char2)";
                return;
            } // if

            // get an adjustment value using $fudgefactor
            $adj     = $this->_applyFudgeFactor($fudgefactor);

            $factor1 = $factor2 + $adj;                 // accumulate in $factor1
            $num1    = $num2 - round($factor1);         // generate offset for $scramble1
            $num1    = $this->_checkRange($num1);       // check range
            $factor2 = $factor1 + $num2;                // accumulate in $factor2

            // extract (multibyte) character from $scramble1
            if (function_exists('mb_substr')) {
                $char1 = mb_substr($this->scramble1, $num1, 1);
            } else {
                $char1 = substr($this->scramble1, $num1, 1);
            } // if

            // append to $target string
            $target .= $char1;

            //echo "char1=$char1, num1=$num1, adj= $adj, factor1= $factor1, num2=$num2, char2=$char2, factor2= $factor2<br />\n";

        } // for

        return rtrim($target);

    } // decrypt

    // ****************************************************************************
    function encrypt ($source)
    // encrypt string into a garbled form
    {
        $this->errors = array();

        // convert $key into a sequence of numbers
        $fudgefactor = $this->_convertKey();
        if ($this->errors) return;

        if (empty($source)) {
            $this->errors[] = 'No value has been supplied for encryption';
            return;
        } // if

        // pad $source with spaces up to $sourcelen
        $source = str_pad($source, $this->sourcelen, 0, STR_PAD_LEFT);

        $target = null;
        $factor2 = 0;

        for ($i = 0; $i < strlen($source); $i++) {
            // extract a (multibyte) character from $source
            if (function_exists('mb_substr')) {
                $char1 = mb_substr($source, $i, 1);
            } else {
                $char1 = substr($source, $i, 1);
            } // if

            // identify its position in $scramble1
            $num1 = strpos($this->scramble1, $char1);
            if ($num1 === false) {
                $this->errors[] = "Source string contains an invalid character ($char1)";
                return;
            } // if

            // get an adjustment value using $fudgefactor
            $adj     = $this->_applyFudgeFactor($fudgefactor);

            $factor1 = $factor2 + $adj;             // accumulate in $factor1
            $num2    = round($factor1) + $num1;     // generate offset for $scramble2
            $num2    = $this->_checkRange($num2);   // check range
            $factor2 = $factor1 + $num2;            // accumulate in $factor2

            // extract (multibyte) character from $scramble2
            if (function_exists('mb_substr')) {
                $char2 = mb_substr($this->scramble2, $num2, 1);
            } else {
                $char2 = substr($this->scramble2, $num2, 1);
            } // if

            // append to $target string
            $target .= $char2;

            //echo "char1=$char1, num1=$num1, adj= $adj, factor1= $factor1, num2=$num2, char2=$char2, factor2= $factor2<br />\n";

        } // for

        return $target;

    } // encrypt

    // ****************************************************************************
    function getAdjustment ()
    // return the adjustment value
    {
        return $this->adj;

    } // setAdjustment

    // ****************************************************************************
    function getModulus ()
    // return the modulus value
    {
        return $this->mod;

    } // setModulus

    // ****************************************************************************
    function setAdjustment ($adj)
    // set the adjustment value
    {
        $this->adj = (float)$adj;

    } // setAdjustment

    // ****************************************************************************
    function setModulus ($mod)
    // set the modulus value
    {
        $this->mod = (int)abs($mod);    // must be a positive whole number

    } // setModulus

    // ****************************************************************************
    // private methods
    // ****************************************************************************
    function _applyFudgeFactor (&$fudgefactor)
    // return an adjustment value  based on the contents of $fudgefactor
    // NOTE: $fudgefactor is passed by reference so that it can be modified
    {
        $fudge = array_shift($fudgefactor);     // extract 1st number from array
        $fudge = $fudge + $this->adj;           // add in adjustment value
        $fudgefactor[] = $fudge;                // put it back at end of array

        if (!empty($this->mod)) {               // if modifier has been supplied
            if ($fudge % $this->mod == 0) {     // if it is divisible by modifier
                $fudge = $fudge * -1;           // make it negative
            } // if
        } // if

        return $fudge;

    } // _applyFudgeFactor

    // ****************************************************************************
    function _checkRange ($num)
    // check that $num points to an entry in $this->scramble1
    {
        $num = round($num);         // round up to nearest whole number

        $limit = strlen($this->scramble1);

        while ($num >= $limit) {
            $num = $num - $limit;   // value too high, so reduce it
        } // while
        while ($num < 0) {
            $num = $num + $limit;   // value too low, so increase it
        } // while

        return $num;

    } // _checkRange

    // ****************************************************************************
    function _convertKey ()
    // convert $key into an array of numbers
    {
        if (empty($this->key)) {
            $this->errors[] = 'No value has been supplied for the encryption key';
            return;
        } // if

        $array[] = strlen($this->key);    // first entry in array is length of $key

        $tot = 0;
        for ($i = 0; $i < strlen($this->key); $i++) {
            // extract a (multibyte) character from $key
            if (function_exists('mb_substr')) {
                $char = mb_substr($this->key, $i, 1);
            } else {
                $char = substr($this->key, $i, 1);
            } // if

            // identify its position in $scramble1
            $num = strpos($this->scramble1, $char);
            if ($num === false) {
                $this->errors[] = "Key contains an invalid character ($char)";
                return;
            } // if

            $array[] = $num;        // store in output array
            $tot = $tot + $num;     // accumulate total for later
        } // for

        $array[] = $tot;            // insert total as last entry in array

        return $array;

    } // _convertKey

// ****************************************************************************
} // end encryption_class
// ****************************************************************************
