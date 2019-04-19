ACC.contactus = {
    _autoload: [
        ["onlineQueryChange", $("#contactUsInformation").length > 0],
        ["provinceSelectionChange", $("#contactUsInformation").length > 0]
    ],
    onlineQueryChange : function () {
        $(document).ready(function() {
            $('input:radio[name=queryCategory]').change(function() {
                if (this.value === 'store-specific-query') {
                    $('#storeSpecificQuery').attr('style', 'display:block');
                    $('#onlineOrderNumber').attr('style', 'display:none');
                } else if (this.value === 'smart-shopper-or-general-query') {
                    $('#storeSpecificQuery').attr('style', 'display:none');
                    $('#onlineOrderNumber').attr('style', 'display:none');
                } else {
                    $('#storeSpecificQuery').attr('style', 'display:none');
                    $('#onlineOrderNumber').attr('style', 'display:block');
                }
            });
        });
    },

    provinceSelectionChange : function () {
        $(document).ready(function () {
            $('#province').change(function() {
                var selectedProvince = $(this).find(":selected").val();
                if (selectedProvince !== null && selectedProvince !== '') {
                    ACC.contactus.loadStoresForProvince(selectedProvince);
                    $('#warehouseCode').prop('disabled', false);
                } else {
                    $('#warehouseCode').prop('disabled', true);
                }

            });
        });
    },

    loadStoresForProvince : function (selectedProvince) {

        $.ajax({
            type: 'GET',
            url: ACC.config.encodedContextPath + '/contact-us/getstoresforprovince',
            data: {'provinceIsoCode': selectedProvince},
            success: function (data) {
                $('#warehouseCode option:gt(0)').remove();
                for (i = 0; i < data.length; i++) {
                    var key = data[i].key;
                    var value = data[i].value;
                    $('#warehouseCode').append('<option value="' + key + '">' + value + '</option>');
                }
            },
            error: function f() {
                alert('Error retrieving stores for province')
            }
        });
    }
};