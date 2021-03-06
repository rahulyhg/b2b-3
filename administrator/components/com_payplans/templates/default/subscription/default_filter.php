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
<?php $attr = array(); ?>
<div class="container-fluid well">
	<div class="row-fluid">

		 <div class="span2 hidden-phone">
		 <?php if(!empty($subscriptionStats)): ?>
	         <label><?php echo XiText::_('COM_PAYPLANS_TOTAL_SUBSCRIPTIONS')?></label>
				<!-- Bar for color codings-->
				<div class="progress">
					<?php // Available Subscription status
				  		  $ppStatus = array(PayplansStatus::SUBSCRIPTION_ACTIVE, PayplansStatus::SUBSCRIPTION_HOLD, PayplansStatus::SUBSCRIPTION_EXPIRED, PayplansStatus::NONE);							  	
				  		  
				  		  // Process Subscription stats according to status
				  		  foreach($ppStatus as $status) : ?>
				  		  						
							  <div class="bar <?php echo isset($subscriptionStats['class'][$status]) 	? $subscriptionStats['class'][$status] : '';?>"
							  	   title="<?php echo isset($subscriptionStats['message'][$status]) 		? $subscriptionStats['count'][$status]." ".$subscriptionStats['message'][$status] : '';?>"
							  	   style="width: <?php echo isset($subscriptionStats['width'][$status]) ? $subscriptionStats['width'][$status] : '';?>%;">
							  	   		
				  	   			<bold><?php echo isset($subscriptionStats['count'][$status]) ? $subscriptionStats['count'][$status] : "";?></bold>
							  </div>
						<?php endforeach;?>
				</div>
			<?php endif;?>
		</div>
	
		<div class="span10">

			<div class="span1 visible-desktop"></div>
			<div class="span11">
				<div style="min-width: 170px;" class="span2 hidden-tablet hidden-phone">
					<label><?php echo XiText::_('COM_PAYPLANS_SUBSCRIPTION_GRID_EXPIRATION_DATE');?></label>
					<div>
						<?php $attr['style'] = "width:89px;"; ?>
						<?php echo PayplansHtml::_('range.filter', 'expiration_date', 'subscription', $filters, 'date', 'filter_payplans', $attr);?>
					</div>
				</div>

				<div style="min-width: 170px;" class="span2 hidden-phone">
					<label><?php echo XiText::_('COM_PAYPLANS_SUBSCRIPTION_GRID_SUBSCRIPTION_DATE');?></label>
					<div><?php echo PayplansHtml::_('range.filter', 'subscription_date', 'subscription', $filters, 'date', 'filter_payplans', $attr);?></div>
				</div>

				<div style="min-width: 90px;" class="span2 hidden-tablet">
					<label><?php echo XiText::_('COM_PAYPLANS_USER_GRID_FILTER_USERNAME');?></label>
					<div>
						<?php $attr['style'] ='class="pp-filter-width"';?>
						<?php echo PayplansHtml::_('text.filter', 'cross_users_username', 'subscription', $filters, 'filter_payplans', $attr);?>
					</div>
				</div>

				<div class="hidden-phone"> &nbsp;</div>
				<?php $attr['style'] ='class="pp-filter-width pp-filter-gap-top"';?>
				<div style="min-width: 100px;" class="span2">
					<?php echo PayplansHtml::_('plans.filter', 'plan_id', 'subscription', $filters, 'filter_payplans', $attr);?>
				</div>

				<div style="min-width: 100px;" class="span2">
					<?php echo PayplansHtml::_('status.filter', 'status', 'subscription', $filters, 'subscription', 'filter_payplans', $attr);?>
				</div>

				<div style="min-width: 85px;" class="span1">
					<div><input type="submit" name="filter_submit" class="btn btn-primary pp-filter-width pp-filter-gap-top" value="<?php echo XiText::_('COM_PAYPLANS_FILTERS_GO');?>" /></div>
					<div><input type="reset"  name="filter_reset"  class="btn pp-filter-width pp-filter-gap-top" value="<?php echo XiText::_('COM_PAYPLANS_FILTERS_RESET');?>" onclick="payplansAdmin.resetFilters(this.form);" /></div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php 
