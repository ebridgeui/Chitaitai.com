ACC.silentorderpost = {

	spinner: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif' />"),

	bindUseDeliveryAddress: function ()
	{
		$('#useDeliveryAddress').on('change', function ()
		{
			if ($('#useDeliveryAddress').is(":checked"))
			{
				var options = {'countryIsoCode': $('#useDeliveryAddressData').data('countryisocode'), 'useDeliveryAddress': true};
				ACC.silentorderpost.enableAddressForm();
				ACC.silentorderpost.displayCreditCardAddressForm(options, ACC.silentorderpost.useDeliveryAddressSelected);
				ACC.silentorderpost.disableAddressForm();
			}
			else
			{
				ACC.silentorderpost.clearAddressForm();
				ACC.silentorderpost.enableAddressForm();
			}
		});

		if ($('#useDeliveryAddress').is(":checked"))
		{
			var options = {'countryIsoCode': $('#useDeliveryAddressData').data('countryisocode'), 'useDeliveryAddress': true};
			ACC.silentorderpost.enableAddressForm();
			ACC.silentorderpost.displayCreditCardAddressForm(options, ACC.silentorderpost.useDeliveryAddressSelected);
			ACC.silentorderpost.disableAddressForm();
		}
	},

	bindSubmitSilentOrderPostForm: function ()
	{
		$('.js-silentOrderPostForm-addNewCard').click(function (e)
		{
			e.preventDefault();
			if(!ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.common.showLoadingSpinner(".js-silentOrderPostForm-addNewCard");
                $(this).parents('form').attr('action', $(this).attr('formaction')).submit();
            } else {
				ACC.vouchercomponent.displayForgottenVouchersPopup();
			}

		});

		$('.js-silentOrderPostForm-payNow').click(function (e)
		{
            e.preventDefault();
            if(!ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.common.showLoadingSpinner(".js-silentOrderPostForm-payNow");
                $(this).attr('disabled', 'disabled');
                $(this).parents('form').attr('action', $(this).attr('formaction')).submit();
            } else {
            	ACC.vouchercomponent.displayForgottenVouchersPopup();
			}
		});

		$('.js-silentOrderPostForm-poaNow').click(function(e) {
			e.preventDefault();
            if(!ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.common.showLoadingSpinner(".js-silentOrderPostForm-poaNow");
                $(this).attr('disabled', 'disabled');
                ACC.cart.hasCustomerAccountPaymentRestrictionCallback(ACC.silentorderpost.checkHasCustomerAccountPaymentRestriction);
            } else {
                ACC.vouchercomponent.displayForgottenVouchersPopup();
			}
        });
	},

    /* Checks if customer has a AccountPaymentRestriction Voucher, if true renders popup else submits form for payment */
	checkHasCustomerAccountPaymentRestriction: function(result) {
	    if (result === true) {
	        ACC.common.hideLoadingSpinner(".js-silentOrderPostForm-poaNow");
	        $('.js-silentOrderPostForm-poaNow').removeAttr('disabled');
            ACC.payment.renderAccountPaymentRestrictionPopup();
	    } else {
            $('.js-silentOrderPostForm-poaNow').parents('form').submit();
	    }
	},

	bindCycleFocusEvent: function ()
	{
		$('#lastInTheForm').blur(function ()
		{
			$('#silentOrderPostForm [tabindex$="10"]').focus();
		})
	},

	isEmpty: function (obj)
	{
		if (typeof obj == 'undefined' || obj === null || obj === '') return true;
		return false;
	},

	disableAddressForm: function ()
	{
		$('input[id^="address\\."]').prop('disabled', true);
		$('select[id^="address\\."]').prop('disabled', true);
	},

	enableAddressForm: function ()
	{
		$('input[id^="address\\."]').prop('disabled', false);
		$('select[id^="address\\."]').prop('disabled', false);
	},

	clearAddressForm: function ()
	{
		$('input[id^="address\\."]').val("");
		$('select[id^="address\\."]').val("");
	},

	useDeliveryAddressSelected: function ()
	{
		if ($('#useDeliveryAddress').is(":checked"))
		{
			$('#address\\.country').val($('#useDeliveryAddressData').data('countryisocode'));
			ACC.silentorderpost.disableAddressForm();
		}
		else
		{
			ACC.silentorderpost.clearAddressForm();
			ACC.silentorderpost.enableAddressForm();
		}
	},
	
	

	bindCreditCardAddressForm: function ()
	{
		$('#billingCountrySelector :input').on("change", function ()
		{
			var countrySelection = $(this).val();
			var options = {
				'countryIsoCode': countrySelection,
				'useDeliveryAddress': false
			};
			ACC.silentorderpost.displayCreditCardAddressForm(options);
		})
	},

	displayCreditCardAddressForm: function (options, callback)
	{
		$.ajax({ 
			url: ACC.config.encodedContextPath + '/checkout/multi/sop/billingaddressform',
			async: true,
			data: options,
			dataType: "html",
			beforeSend: function ()
			{
				$('#billingAddressForm').html(ACC.silentorderpost.spinner);
			}
		}).done(function (data)
				{
					$("#billingAddressForm").html(data);
					if (typeof callback == 'function')
					{
						callback.call();
					}
				});
	}
}

$(document).ready(function ()
{
	with (ACC.silentorderpost)
	{
		bindUseDeliveryAddress()
		bindSubmitSilentOrderPostForm();
		bindCreditCardAddressForm();
	}

	// check the checkbox
	$("#useDeliveryAddress").click();
});
