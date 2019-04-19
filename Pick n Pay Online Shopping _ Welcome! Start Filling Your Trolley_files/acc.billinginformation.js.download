/**
 * Created by MichaelJacobs on 2017/07/10.
 */
ACC.billinginformation = {
    _autoload: [
        ["identificationTypeChange", $("#billingInformation").length > 0],
        ["internationalAddressChange", $("#billingInformation").length > 0],
        ["bindBillingSideCheckoutAction", $("#billingInformation").length > 0]
    ],
    identificationTypeChange : function () {
            /*$("input[type='radio'][name='idType']").change(function () {*/
            $('input:radio[name=idType]').change(function() {
                if (this.value === 'ID Number') {
                    $('#billingIdLabel').text("ID Number");
                    $('#billingAddressPassportInfo').attr('style', 'display:none');
                    $('#billingAddressIdentificationNumber').attr('style', 'display:block');
                    $('#dateOfBirth').removeAttr('placeholder').removeAttr('pattern').removeAttr('title');
                }
                else if (this.value === 'Passport Number') {
                    $('#billingIdLabel').text("Passport Number");
                    $('#billingAddressPassportInfo').attr('style', 'display:block');
                    $('#billingAddressIdentificationNumber').attr('style', 'display:block');
                    $('#dateOfBirth').prop('placeholder','dd/MM/yyyy')
                        .prop('pattern','^(0[1-9]|1[0-9]|2[0-9]|3[0-1])+\/(0[1-9]|1[0-2])+\/([0-9]{4})+$').prop('title','dd/MM/yyyy');
                }
            });
    },
    internationalAddressChange : function () {
        $("input[type='radio'][name='internationalAddress']").change(function() {
            $('#billingAddressProvince').attr('style', this.value == 'false' ? 'display:block' : 'display:none');
            $('#billingAddressCountry').attr('style', this.value == 'false' ? 'display:none' : 'display:block');
        });
    }
};
