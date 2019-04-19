ACC.shoppinglist = {
		
		_autoload: [
			"enableCopySelectedButton",
			"collapseSectionOnLoad",
			"clickCheckBoxForCopyButton",
			"tooltipEnable",
			"customSelectBox",
			"cust_select",
			"shoppinglistItemExtras"
		],
		
		tooltipEnable : function(){
			 $('[data-toggle="tooltip"]').tooltip({
				  container: 'body',
				  trigger: 'hover'
				});
			 $('[data-tooltip="tooltip"]').tooltip({
				  container: 'body',
				  trigger: 'hover'
			    });
		},
		
		cust_select : function(){
			$('select.custom_select').selectric({
				disableOnMobile: false,
				nativeOnMobile: false,
				onOpen: function() {
						$(".selectric-scroll").niceScroll({
							cursorwidth: "8px",
							cursorcolor: "#cccccc",
							railpadding: {
						      top: 5,
						      right: 3,
						      left: 0,
						      bottom: 5
						    },
						autohidemode: false,
					}).show();
					$('.selectric-scroll').getNiceScroll().resize();
				},
			});
		},

		shoppinglistItemExtras : function(){
			$('.sl-item-extras').click(function(item){
				var itemExtras =  $(item.target).closest('.sl-item-extras').find('.sl-item-extras-content');

				if(itemExtras.css('display') == 'none' || itemExtras.css('display') == ''){
					itemExtras.css('display', 'block');
				}
				else{
					itemExtras.css('display', 'none');
				}

			});
		},
				
	 	enableCopySelectedButton:function(){
	 		$('.copy-sl').prop('disabled',true);
	 		$('.sl-btn-disable').prop('disabled',true);
	 	},
	 	
		customSelectBox:function(){
			//var bodyTag = document.getElementsByClassName("select-div")[0];
			//bodyTag.className = bodyTag.className.replace("noJS", "hasJS");
			$("select.custom").each(function() {					
				var sb = new SelectBox({
					selectbox: $(this),
					height: 150
				});
			});
		},
		
		closeOverlay : function(){
                $('.overlay-sl').removeClass('overlay-sl-show-animation');
                $('.overlay-sl').addClass('overlay-sl-hide-animation');
				$('#colorbox').css("left","100%");
				$('#colorbox').removeClass('addlist_popup');
				// $('.overlay-sl').css("display","none");

		},

    	showDeletePopUp : function(event){
            event.preventDefault();
            $('.overlay-dl-1').css("display","block");
		},
    	hideDeletePopUp : function(event){
            event.preventDefault();
			$('.overlay-dl-1').css("display","none");
		},
			  
		createShoppingList : function() {
			var shoppingListName = $('#shoppingListName').val();
			var createShoppingListUrl = '/shopping-list/create';
			if(shoppingListName == ""){
				$('#shoppingListName').attr('placeholder','Please Add a List Name').addClass('input_error');
				$('.create_slbtn').attr('disabled',false);
			}
			else{
			$.ajax({
				type : "GET",
				url : ACC.config.encodedContextPath + createShoppingListUrl,
				data : {
					'shoppingListName' : shoppingListName,
				},
				contentType : "application/json; charset=utf-8",
				dataType : 'json',
				success : function(data) {
					console.log("The new shopping list has been created");
					location.reload();
				},
				error : function(data) {
					console.log(data);
				}
			});
			}
		},
		
		sortShoppingList : function() {
			var sortShoppingList = $('#sortShoppingList').val();
			var sortShoppingListUrl = '/shopping-list/sortshoppinglist';
			$.ajax({
				type : "GET",
				url : ACC.config.encodedContextPath + sortShoppingListUrl,
				data : {
					'sortType' : sortShoppingList
				},
				contentType : "application/json; charset=utf-8",
				success : function(data) {
					$('.shoppinglists-list').html(data);
				},
				error : function(data) {
					console.log('got error'+ data);
				}
			});
		},

		createNoteItem : function() {
			var noteItemText = $('.add-note-item').val();
			var slCode = $('.slCode').val();
			var createShoppingListUrl = '/shopping-list/createNoteItem';
			if(noteItemText == ""){
				 $('.vld-text').css("display","block");
			}
			else{
			$.ajax({
				type : "POST",
				url : ACC.config.encodedContextPath + createShoppingListUrl,
				data : {
					'noteItemText' : noteItemText,'slCode' : slCode },
				contentType : "application/json; charset=utf-8",
				success : function(data) {
					console.log("The new shopping list has been created");
					window.location = ACC.config.encodedContextPath + '/shopping-list/shopping-list-details/' + slCode;
				},
				error : function(data) {
					console.log(data);
				}
			});
			}
		},

		editName : function(th) {
			var shoppingListItem = $(th).closest('.shoppinglists-itemList-item').find('.edit-slName');
			$(th).closest('.shoppinglists-itemList-item').find('.update').show();
			$(th).closest('.shoppinglists-itemList-item').find('.edit').hide();
			$(shoppingListItem).find('.list-name-style').attr('contenteditable', 'true').focus();
			var shoppingListItemName = $(shoppingListItem).find('a').text();
		},

		editSlName : function(th) {
			var newNameForShoppingList = $(th).closest('.shoppinglists-itemList-item').find('.edit-slName a').text();
			var shoppingListNamePrev = $(th).closest('.shoppinglists-itemList-item').find('.edit-slName').attr('data-slName');
			if(newNameForShoppingList == "")
			{
				$(th).closest('.shoppinglists-itemList-item').find('.edit-slName a').text(shoppingListNamePrev);
				newNameForShoppingList=shoppingListNamePrev;
			}
			var slCode = $(th).closest('.shoppinglists-itemList-item').find('.edit-slName').attr('data-slCode');
			var shoppingListNameChangeUrl = '/shopping-list/edit-slName';
			$
					.ajax({
						type : 'POST',
						url : ACC.config.encodedContextPath	+ shoppingListNameChangeUrl,
						data : {'slCode': slCode,'shoppingListNamePrev' : shoppingListNamePrev,'newNameForShoppingList': newNameForShoppingList},
						dataType : 'json',
						success : function(data) {
							console.log("The shopping list name has been edited");
							$(th).closest('.shoppinglists-itemList-item').find('.edit-slName a').removeAttr('contenteditable');
							$(th).closest('.shoppinglists-itemList-item').find('.edit-slName').attr('data-slName',data);
							$(th).closest('.shoppinglists-itemList-item').find('.update').hide();
							$(th).closest('.shoppinglists-itemList-item').find('.edit').show();
						},
						error : function(data) {
							console.log(data);
						}
					});
		},
		
		editBannerName : function(th){
			var shoppingListItem =  $(th).closest('.pnpShoppingListDetailBanner').find('.edit-slName');
			$(th).closest('.pnpShoppingListDetailBanner').find('.update').show();
			$(th).closest('.pnpShoppingListDetailBanner').find('.edit').hide();
			$(shoppingListItem).find('.editTextName').attr('contenteditable', 'true').focus();
			var shoppingListItemName = $(shoppingListItem).find('a').text();
		},
		
		editBannerSlName : function(th) {
			var newNameForShoppingList = $(th).closest('.pnpShoppingListDetailBanner').find('.edit-slName a').text();
			var shoppingListNamePrev = $(th).closest('.pnpShoppingListDetailBanner').find('.edit-slName').attr('data-slName');
			if(newNameForShoppingList == "")
			{
				$(th).closest('.pnpShoppingListDetailBanner').find('.edit-slName a').text(shoppingListNamePrev);
				newNameForShoppingList=shoppingListNamePrev;
			}
			var slCode = $(th).closest('.pnpShoppingListDetailBanner').find('.edit-slName').attr('data-slCode');
			var shoppingListNameChangeUrl = '/shopping-list/edit-slName';
			$
					.ajax({
						type : 'POST',
						url : ACC.config.encodedContextPath	+ shoppingListNameChangeUrl,
						data : {'slCode': slCode,'shoppingListNamePrev' : shoppingListNamePrev,'newNameForShoppingList': newNameForShoppingList},
						dataType : 'json',
						success : function(data) {
							console.log("The shopping list name has been edited");
							$(th).closest('.pnpShoppingListDetailBanner').find('.edit-slName a').removeAttr('contenteditable');
							$(th).closest('.pnpShoppingListDetailBanner').find('.edit-slName').attr('data-slName',data);
							$(th).closest('.pnpShoppingListDetailBanner').find('.update').hide();
							$(th).closest('.pnpShoppingListDetailBanner').find('.edit').show();
						},
						error : function(data) {
							console.log(data);
						}
					});
		},
		
		editNoteName : function(th) {
			var noteItem = $(th).closest('.shoppinglists-itemList-item').find('.noteItemName');
			$(th).closest('.shoppinglists-itemList-item').find('.updateName').show();
	//		$(th).closest('.shoppinglists-itemList-item').find('.edit').hide();
			$(noteItem).attr('contenteditable', 'true').focus();
		},


		editNoteNameUpdate : function(th) {
			var prevNameNoteItem =  $(th).closest('.shoppinglists-itemList-item').find('.noteItemName').attr('data-noteItem-name');
			var newNameNoteItem=$(th).closest('.shoppinglists-itemList-item').find('.noteItemName').text();
			var slCode = $(th).closest('.shoppinglists-itemList-item').find('.noteItemName').attr('data-slCode');
			var noteCode = $(th).closest('.shoppinglists-itemList-item').find('.noteItemName').attr('data-noteCode');
			var noteItemNameChangeUrl = '/shopping-list/edit-noteItemName';
			$.ajax({
						type : 'POST',
						url : ACC.config.encodedContextPath	+ noteItemNameChangeUrl,
						data : {'newNameForNoteItem' : newNameNoteItem,'noteItemNamePrev': prevNameNoteItem,'noteItemCode':noteCode,'slCode': slCode},
						dataType : 'json',
						success : function(data) {
							console.log("The Note Item  name has been edited");
							$(th).closest('.shoppinglists-itemList-item').find('.noteItemName').removeAttr('contenteditable');
							$(th).closest('.shoppinglists-itemList-item').find('.noteItemName').html(data);
							$(th).closest('.shoppinglists-itemList-item').find('.updateName').hide();
							$(th).closest('.shoppinglists-itemList-item').find('.edit').show();
						},
						error : function(data) {
							console.log(data);
						}
					});
		},
		
	updateNoteItemQuantity : function(th) {
			var quantity=$(th).val();
			var x=document.getElementById("shoppingNoteQuantityError" + $(th).attr("data-notecode"));
			if(quantity == 0 || quantity == "")
			{
			        x.style.display = 'block';
			        $(th).val($(th).attr('data-NoteQuantity'));
			        return ;
			}
			x.style.display = 'none';
			var slCode = $(th).closest('.shoppinglists-itemList-item').find('.noteItemName').attr('data-slCode');
			var noteCode = $(th).closest('.shoppinglists-itemList-item').find('.noteItemName').attr('data-noteCode');
			var noteItemNameChangeUrl = '/shopping-list/'+ slCode +'/update-noteItemQuantity';
			$.ajax({
						type : 'POST',
						url : ACC.config.encodedContextPath	+ noteItemNameChangeUrl,
						data : {'noteItemCode':noteCode,'noteQuantity':quantity},
						dataType : 'json',
						success : function(data) {
							$(th).attr('data-NoteQuantity',data);
							console.log("The Note Item  quantity has been edited");
						},
						error : function(data) {
							console.log(data);
						}
					});
		},
		
	updateProductQuantity : function(th) {
			var quantity=$(th).val();
			var productCode=$(th).attr('data-product-code');
			var x=document.getElementById("shoppingProductQuantityError"+productCode);
			if(quantity == 0 || quantity == "") {
                x.style.display = 'block';
                $(th).val($(th).attr('data-Quantity'));
                return;
            }
			var slCode = $(th).attr('data-slCode');
			var noteItemNameChangeUrl = '/shopping-list/update-productItemQuantity';
			$.ajax({
						type : 'POST',
						url : ACC.config.encodedContextPath	+ noteItemNameChangeUrl,
						data : {'productCode':productCode,'slCode': slCode,'productQuantity':quantity},
						success : function(data) {
							var shoppingListItemDiv = "#shoppingListRow_" + productCode;
                            var isShoppingListItemSelected = $(shoppingListItemDiv+ " .shoppingListEntryCheckBox").is(":checked");
                            $(shoppingListItemDiv).html(data);
                            $(shoppingListItemDiv + " .shoppingListEntryCheckBox").prop('checked', isShoppingListItemSelected);
                            ACC.shoppinglist.refreshShoppingListTotal(slCode);
						},
						error : function(data) {
							console.log(data);
						}
					});
		},

    removeShoppingListEntry: function(th){
            var productCode = $(th).attr("data-product-code");
            var shoppingListCode = $(th).attr("data-shopping-list-code");
            $.ajax({
                url: ACC.config.contextPath + "/shopping-list/" + shoppingListCode +"/removeShoppingListEntry",
                cache: false,
                type: 'POST',
                data:{"productCode": productCode},
                success: function (data) {
                	if(data.success == true){
                        var shoppingListItemDiv = "#shoppingListRow_" + productCode;
                        $(shoppingListItemDiv).remove();
                        ACC.shoppinglist.removeCategoryHeadingIfNecessary();
                        ACC.shoppinglist.refreshShoppingListTotal(shoppingListCode);
					}else{
                		console.log("Failed to delete product");
					}
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var error = "Failed to delete shopping list item";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                    });

                },
                complete: function () {
                }
            });
    },

	removeCategoryHeadingIfNecessary: function(){
    	/*dynamically remove a category header when there is no shopping items in
			it because it has been manually removed by the user*/
        $('#productList .listPageHeader-short').each(function(){
            var categoryCode = $(this).find('.pnp-cart-accordion').attr('data-category');
            if($(this).find(".shoppinglists-itemList-item").length == 0){
                $("#category-heading_"+categoryCode).remove();
            }
        });
	},

    refreshShoppingListTotal: function(shoppingListCode){
            $.ajax({
                url: ACC.config.contextPath + "/shopping-list/"+ shoppingListCode + "/total",
                cache: false,
                type: 'GET',
                success: function (data) {
                   $(".pnpTotalLabel").html(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var error = "Failed to refresh totals";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                    });
                },
                complete: function () {

                }
            });
		},

	addProductToShoppingListPopup: function(th){
	    	var quantityField = $('input[name=qty]').val();

	        var quantity = 1;
	        if (quantityField != undefined) {
	            quantity = quantityField;
	        }
            $('#cboxContent').css("background-color","#FFF");
	        var productCode = null;
	    	if($('.page-productDetails').length > 0){
	    		productCode = $('input[name=productCodePost]').val();
	    	}
	    	else if(th != undefined && th != null){
		        	productCode = $(th).closest('.productCarouselItem').find('.addToCartButtonContainer').attr('data-pdt-code');
	    	}
	    	
			if(productCode == undefined){
				productCode = "";
			}
			var addProductToListaPopUpUrl = '/shopping-list/add-product-to-list-popup';
				$.ajax({
					type : "GET",
					url : ACC.config.encodedContextPath + addProductToListaPopUpUrl,
					data : {
						'productCode' : productCode,
						'quantity' : quantity
					},
					contentType : "application/json; charset=utf-8",
					success : function(data) {
						var html = $($.parseHTML(data));
	                    var layout = $('.layout-type').attr('data-bind-type');
	                    if(layout == 'modal'){
				            $.colorbox({
					             html : html,
					             width : '96%',
					             maxWidth : 700,
					             scrolling : false,
								onCleanup: function() {
					             	$('#colorbox').removeClass('addlist_popup');
									$('#colorbox').css("left","100%");
								}
					           });

				            $('#colorbox').addClass('addlist_popup');
							$('#cboxClose').on('click', function(){
								$('#colorbox').removeClass('addlist_popup');
								$('#colorbox').css("left","100%");
							});

				            ACC.shoppinglist.cust_select();

	                       }
                       else{
                            $(th).closest('.ProductCarouselAddToCart-CarouselAddToShoppingListAction').find('.overlay-sl').show();
                            $(th).next('.overlay-sl').html(html);
                            ACC.shoppinglist.cust_select();
                            $(th).closest('.ProductCarouselAddToCart-CarouselAddToShoppingListAction').find('.overlay-sl').removeClass('overlay-sl-hide-animation');
                            $(th).closest('.ProductCarouselAddToCart-CarouselAddToShoppingListAction').find('.overlay-sl').addClass('overlay-sl-show-animation');
                            $('.mod-text-or-overlay').css("display","block");
                            $('.mod-text-or').attr('data-content','');
                       }},
					error : function(data) {
						var html = $('.login-modal').css("display","block");
						$.colorbox({
							html : html,
                            width : '96%',
                            maxWidth : 800,
                            scrolling : false,
	 	  		    		onClosed : function(){
	 	  		    			location.reload();
	 	  		    		}
	  		    	  	});
					}
				});
	    	 },

		copyToShoppingListPopup :function(th){
			var slCode = $(th).closest('.copy-sl').attr('data-slCode');
			var copySLUrl = '/shopping-list/'+ slCode +'/copy-list-popup';
	    		 $.ajax({
	 				type : "GET",
	 				url : ACC.config.encodedContextPath + copySLUrl,
	 				contentType : "application/json; charset=utf-8",
	 				success : function(data) {
	 					var html = $($.parseHTML(data));
	 					$.colorbox({
	 	  		    		  html : html,
	 	  		    		  width : '96%',
	 	  		    		  maxWidth : 700,
	 	  		    		  scrolling : false
	 	  		    	  });
	 					ACC.shoppinglist.cust_select();
	 				},
	 				error : function(data) {
	 					console.log('got error'+ data);
	 				}
	 			
	    		 });
	    	 },
	    	 
	    	 copyListToExistingList :function(th){
	 			var slCode = $("#shoppingList").val();
				var currentSlCode = $('.current-sl-code').val();
				var copyExistingSLUrl = '/shopping-list/'+ slCode +'/copy-to-list';
		    		 $.ajax({
		 				type : "GET",
		 				url : ACC.config.encodedContextPath + copyExistingSLUrl,
		 				data : {
		 					'existingListCode': currentSlCode,
		 					'createNewListCheck': false
		 				},
		 				contentType : "application/json; charset=utf-8",
		 				success : function(data) {
		 					var html = $($.parseHTML(data));
							$.colorbox({
			  		    		  html : html,
			  		    		  width : '96%',
			  		    		  maxWidth : 700
			  		    	  });
		 				},
		 				error : function(data) {
		 					console.log('got error'+ data);
		 				}
		 			
		    		 });
		    	 },
	    	 
	    	 copyListToNewList : function(th){
	 			var slCode = $(".new-list-name").val();
				var currentSlCode = $('.current-sl-code').val();
				var copyNewSLUrl = '/shopping-list/'+ slCode +'/copy-to-list';
				if(slCode == ""){
					 $('.vld-cp').css("display","block");
				}
				else{
		    		 $.ajax({
		 				type : "GET",
		 				url : ACC.config.encodedContextPath + copyNewSLUrl,
		 				data : {
		 					'existingListCode': currentSlCode,
		 					'createNewListCheck': true
		 				},
		 				contentType : "application/json; charset=utf-8",
		 				success : function(data) {
		 					var html = $($.parseHTML(data));
							$.colorbox({
			  		    		  html : html,
			  		    		  width : '96%',
			  		    		  maxWidth : 700
			  		    	  });
		 				},
		 				error : function(data) {
		 					console.log('got error'+ data);
		 				}
		 			
		    		 });
					}
		    	 },
	    	    	 
	    	 removeShoppingList : function(th) {
	 		 	var slCode = $(th).closest('.shoppinglists-itemList-item').find('.delete-sl').attr('data-slCode');
	 			var removeshoppingListUrl = '/shopping-list/'+ slCode + '/removeShoppingList';
	 			var modalId= '#myOverlay' + slCode;
	 			$(modalId).hide();
	 			$.ajax({
	 				type : "GET",
	 				url : ACC.config.encodedContextPath + removeshoppingListUrl,
	 				contentType : "application/json; charset=utf-8",
	 				success : function(data) {
	 					$(th).closest('.shoppinglists-itemList-item').find('.overlay-dl-2').show();
	 					},
	 				error : function(data) {
	 					console.log('got error'+ data);
	 				}
	 			});
	 		},

	 		deleteShoppingList : function(th) {
	 		 	var slCode = $(th).closest('.pnp-sld-add-to-list').find('.delete-sl').attr('data-slCode');
	 		 	var removeshoppingListUrl = '/shopping-list/'+ slCode + '/removeShoppingList';
	 			var modalId= '#myOverlaySD' + slCode;
	 			$(modalId).hide();
	 			$.ajax({
	 				type : "GET",
	 				url : ACC.config.encodedContextPath + removeshoppingListUrl,
	 				contentType : "application/json; charset=utf-8",
	 				success : function(data) {
	 					$(th).closest('.pnp-sld-add-to-list').find('.overlay-dl-2').show();
	 					console.log('checking');
	 					},
	 				error : function(data) {
	 					console.log('got error'+ data);
	 				}
	 			});
	 		},
	 		
	 		listPage : function (){
	 			window.location = ACC.config.encodedContextPath + '/shopping-list';
	 		},
	 		
			addProductToExistingSL : function(th) {
				var slCode = $("#shoppingList").val();
				var productCode = $(th).attr('data-productCode');
				var quantity = $('.quantity').val();
				var requestUrl = '/shopping-list/'+ slCode +'/add-product-to-list';
				var pageName = $('.page-check').attr('data-pg');
				$.ajax({
					type : "GET",
					url : ACC.config.encodedContextPath + requestUrl,
					data : {
						'productCode' : productCode,
						'quantity' : quantity,
						'createNewListCheck': false
					},
					contentType : "application/json; charset=utf-8",
					success : function(data) {
						var html = $($.parseHTML(data));
						if(pageName == "plp"){
							$(".mod-content").html(html);
						}else if(pageName == "pdp"){
							$.colorbox({
								html : html,
								width : 700,
								scrolling : false
							});
							ACC.shoppinglist.cust_select();
						}
					},
					error : function(data) {
						console.log(data);
					}
				});
			},
		 	  		 
			addProductToNewSL : function() {
				$('.create_slbtn').attr('disabled','disabled');
				var slCode = $("#shoppingListName").val();
				var listError=$("#list-Error").val();
				var productCode = $('.productCode').val();
				var quantity = $('.quantity').val();
				var requestUrl = '/shopping-list/'+ slCode +'/add-product-to-list';
				var pageName = $('.page-check').attr('data-pg');
				if(slCode == ""){
					$('.new-list-name').attr('placeholder',listError).addClass('input_error');
					$('.create_slbtn').attr('disabled',false);
				}
				else{
				$.ajax({
					type : "GET",
					url : ACC.config.encodedContextPath + requestUrl,
					data : {
						'productCode' : productCode,
						'quantity' : quantity,
						'createNewListCheck': true
					},
					contentType : "application/json; charset=utf-8",
					success : function(data) {
						var html = $($.parseHTML(data));
						if(pageName == "plp"){
							$(".mod-content").html(html);
						}else if(pageName == "pdp"){
							$.colorbox({
								html : html,
								width : 700,
								scrolling : false
							});
							ACC.shoppinglist.cust_select();
						}
					},
					error : function(data) {
						console.log(data);
					}
				});
				}
			},
		  		 
	  	    addToTrolleyShoppingList : function(th) {
	  			var slCode = $(th).closest('.sl-item-action').find('.sl-addtotrolley').attr('data-slCode');
	  			var addToTrolleyShoppingList = '/shopping-list/'+ slCode +'/addToTrolley';
	  			$.ajax({
	  				type : "POST",
	  				url : ACC.config.encodedContextPath + addToTrolleyShoppingList,
	  				datatype:'json',
					beforeSend: function(){
	  					ACC.common.showLoadingSpinner("#addtotrolley_"+slCode);
					},
	  				success : function(data) {
	  					emptyHTML = false;
	  					var jsonResponseData = JSON.parse(data);
	  					var uniqueProductCount = jsonResponseData.uniqueProductsAdded;
	  					if(jsonResponseData.cartValidationPopUpHtml == ""){
	  						emptyHTML = true;
	  					}
	  					else{
	  						var html = jsonResponseData.cartValidationPopUpHtml;
	  					}
	  					if(uniqueProductCount > 0 && emptyHTML){
	  						$('.productAddedToTrolleyPopUp').find('.productCount').html(uniqueProductCount);
		  					var totalminitrollycount=Number($("#myTrolleyCount").html()) + Number(uniqueProductCount);
		  					$("#myTrolleyCount").html(totalminitrollycount);
		  					$('.productAddedToTrolleyPopUp').show();
			  		    	  $.colorbox({
			  		    		  href : '.productAddedToTrolleyPopUp',
			  		    		  inline : true,
			  		    		  width : '96%',
			  		    		  maxWidth : 700,
			  		    		  onClosed : function(){
			  		    			$('.productAddedToTrolleyPopUp').hide();
			  		    		  }
			  		    	  });
	  						}else{
	  							ACC.shoppinglist.showProductPopUp(html, true);
	  						}
	  				},
	  				error : function(data) {
	  					console.log(data);
	  				},
					complete: function(){
                        ACC.common.hideLoadingSpinner("#addtotrolley_"+slCode);
					}
	  			});
	  		},

	  		addToTrolleyShoppingListFromDetails : function(th) {
	  			var slCode = $(th).closest('.slCode-details').find('.sl-addtotrolley').attr('data-slCode');
	  			var addToTrolleyShoppingList = '/shopping-list/'+ slCode +'/addToTrolleyDetails';
	  			
	  			var productsToAdd = new Array();
	  			$('.shoppinglists-itemList .shoppinglists-itemList-item .chk').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		if($(this).attr('data-visible')){
	  		    		productsToAdd.push($(this).attr('data-product-code'));
	  		    		}
	  		    	}
	  		    });
	  			$.ajax({
	  				type : "POST",
	  				url : ACC.config.encodedContextPath + addToTrolleyShoppingList,
	  				data : {
	  					'productsToAdd':productsToAdd
	  				},
	 				datatype:'json',
					beforeSend: function(){
                        $("#addtotrolley").attr('disabled', 'disabled');
	  					ACC.common.showLoadingSpinner("#slCode-details-btncontainer-add");
					},
	  				success : function(data) {
	  					var jsonResponseData = JSON.parse(data);
	  					var uniqueProductCount = jsonResponseData.uniqueProductsAdded;
	  					emptyHTML = false;
	  					if(jsonResponseData.cartValidationPopUpHtml == ""){
	  						emptyHTML = true;
	  					}
	  					else{
	  						var html = jsonResponseData.cartValidationPopUpHtml;
	  					}
	  					if(uniqueProductCount > 0 && emptyHTML){
                            $('.productAddedToTrolleyPopUp').find('.productCount').html(uniqueProductCount);
                            var html = $('.productAddedToTrolleyPopUp').html();
	  						var totalminitrollycount=($("#miniCartItemsCount").val());
		  					$("#myTrolleyCount").html(totalminitrollycount);
		  					$.colorbox({		
		 	  		    		  html : html,
		 	  		    		  width : '96%',
		 	  		    		  maxWidth : 700,
								  height: '125',
		 	  		    		  onClosed : function(){
		 	  		    			$('.shoppinglists-itemList > li').each(function(){
		 	  			  		    	if($(this).find('.overlay-req').length > 0){
		 	  			  		    		$(this).find('.overlay').css("display", "block");
		 	  			  		    	}
		 	  			  		    });
			  		    		  }
		  						});	
		  					}else{
		  						ACC.shoppinglist.showProductPopUp(html, true);
		  					}
	  				},
	  				error : function(data) {
	  					console.log(data);
	  				},
					complete: function () {
                        $("#addtotrolley").removeAttr("disabled");
						ACC.common.hideLoadingSpinner("#slCode-details-btncontainer-add");
                    }
	  			});
	  		},
	  		
	  		addOrCopyItemsToList : function (th) {
	  			var selectedAction = $(th).attr('data-option');
	  			var slCode = $(th).attr('data-slCode');
	  			var url = '/shopping-list/'+ slCode +'/add-copy-items-popup';
	  			var origin = $(th).attr('data-origin');
	  			if(slCode == null){
	  				slCode = "";
	  			}
				$('#colorbox').removeClass('filteredByColorBox');
				$('#colorbox').addClass('addlist_popup');
	  			$.ajax({
	  				type : "POST",
	  				url : ACC.config.encodedContextPath + url,
	  				data : {
	  					'selectedAction' : selectedAction
	  				},
					beforeSend: function(){
					   if (origin == "orderPage") {
                          ACC.common.showLoadingSpinner(".add-to-my-list");
                       } else {
                          if (origin == "favouritesPage") {
                             ACC.common.showLoadingSpinner(".fav-add-to-my-list")
                              $('#colorbox').removeClass('overlay-sl-hide-animation');
                          } else {
                             ACC.common.showLoadingSpinner(".js-save-to-shopping-list");
                          }
                       }
					},
	  				success : function(data) {
	 					var html = $($.parseHTML(data));
	 					$.colorbox({
	 	  		    		  html : html,
	 	  		    		  width : '100%',
	 	  		    		  maxWidth : 700,
	 	  		    		  scrolling : false,
                            onCleanup : function() {
                                ACC.shoppinglist.hideActiveSpinner();
								$('#colorbox').css("left","100%");
                                $('#colorbox').removeClass('addlist_popup');
                            }

	 	  		    	  });
                        ACC.shoppinglist.cust_select();
	  				},

	  				error : function(data) {
	  					console.log(data);
	  				},
					complete: function () {
					   if (origin == "orderPage") {
                          ACC.common.showLoadingSpinner(".add-to-my-list");
                       } else {
                          if (origin == "favouritesPage") {
                             ACC.common.showLoadingSpinner(".fav-add-to-my-list")
                          } else {
                             ACC.common.showLoadingSpinner(".js-save-to-shopping-list");
                          }
                       }
                    }
	  			});
	  		},
	  		addFavouritesToExistingList : function(th) {
                //var searchString = ACC.shoppinglist.getSearchString(window.location.href);
                var slCode = $('#shoppingList').val();
                var products = ACC.common.getSelectedProducts();
                //ACC.shoppinglist.getFavouriteProducts(searchString, slCode);
                ACC.shoppinglist.addFavouritesProductsToExistingList(products, slCode);
	  		},
	  		
	  		addSelectedToExistingList : function(th){		
	  			var slCode = $('#shoppingList').val();
	  			var addCopyUrl = '/shopping-list/'+ slCode +'/add-copy-items';		
	  			var productsList = new Array();
                var productsQuantity = new Array();
                $('.p-list > li').each(function(){
	  		    	if($(this).find('.chk').is(':checked')){
	  		    		productsList.push($(this).find('.data-prod').val());
                        productsQuantity.push($(this).find(".data-qty")[0].value);
	  		    	}
	  		    });
	  			if (productsList === undefined || productsList.length == 0) {		
	  				productsList= [''];		
	   			}		
	  			if (productsQuantity === undefined || productsQuantity.length == 0) {		
	  				productsQuantity= [''];		
	   			}		

	  			$.ajax({		
	  				type : "POST",
	  				url : ACC.config.encodedContextPath + addCopyUrl,		
	  				data : {		
	  					'productsList' : productsList,'productsQuantity':productsQuantity
	  				},		
	  				success : function(data) {		
	  					var html = $($.parseHTML(data));		
	 					$.colorbox({		
	 	  		    		  html : html,
	 	  		    		  width : '100%',
	 	  		    		  maxWidth : 700
	 	  		    	  });		
	  				},		
	  				error : function(data) {		
	  					console.log(data);		
	  				}		
	  			});		
	  		},
	  		
	  		addSelectedToNewList : function(th){
	  			var slCode = $('.new-list-name').val();
	  			var addCopyUrl = '/shopping-list/'+ slCode +'/add-copy-items';
	  			var productsList = new Array();
                var productsQuantity = new Array();
                $('.p-list > li').each(function(){
                    if($(this).find('.chk').is(':checked')){
                        productsList.push($(this).find('.data-prod').val());
                        productsQuantity.push($(this).find(".data-qty")[0].value);
                    }
                });
	  			if (productsList === undefined || productsList.length == 0) {
	  				productsList= [''];
	   			}
	  			if (productsQuantity === undefined || productsQuantity.length == 0) {
	  				productsQuantity= [''];
	   			}
	  			if(slCode == ""){
	  				$('.vld-pp').css("display","block");
	  			}
	  			else{
	  			$.ajax({
	  				type : "POST",
	  				url : ACC.config.encodedContextPath + addCopyUrl,
	  				data : {
	  					'productsList' : productsList,'productsQuantity':productsQuantity
	  				},
	  				success : function(data) {
	  					var html = $($.parseHTML(data));
	 					$.colorbox({
	 	  		    		  html : html,
	 	  		    		  width : '96%',
	 	  		    		  maxWidth : 700
	 	  		    	  });
	  				},
	  				error : function(data) {
	  					console.log(data);
	  				}
	  			});
	  			}
	  		},

	  		addFavouritesToNewList : function(th){
                //var searchString = ACC.shoppinglist.getSearchString(window.location.href);
                var slCode = $('.new-list-name').val();
                var products = ACC.common.getSelectedProducts();
                //ACC.shoppinglist.getFavouriteProducts(searchString, slCode);
                ACC.shoppinglist.addFavouritesProductsToExistingList(products, slCode);
	  		},
	  		
	  		multipleActionsToNewList : function (th){
	  			var slCode = $('.new-list-name').val();
	  			var addCopyUrl = '/shopping-list/'+ slCode + '/add-copy-items';
	  			
	  			var productsList = new Array();
	  			$('.shoppinglists-itemList-item .chk').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		productsList.push($(this).attr('data-product-code'));
	  		    	}
	  		    });
	  			var productsQuantity = new Array();
	  			$('.shoppinglists-itemList-item .chk').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		productsQuantity.push($(this).attr('data-qty'));
	  		    	}
	  		    });
	  			var noteItemsList = new Array();
	  			$('.shoppinglists-itemList-item .chk-N').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		noteItemsList.push($(this).attr('data-noteItem-name'));
	  		    	}
	  		    });
	  			var noteItemsQuantity = new Array();
	  			$('.shoppinglists-itemList-item .chk-N').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		noteItemsQuantity.push($(this).attr('data-qty'));
	  		    	}
	  		    });
	  			
	  			if (productsList === undefined || productsList.length == 0) {
	  				productsList= [''];
	   			}
	  			if (productsQuantity === undefined || productsQuantity.length == 0) {
	  				productsQuantity= [''];
	   			}
	  			if (noteItemsList === undefined || noteItemsList.length == 0) {
	  			   noteItemsList= [''];
	  			}
	  			if (noteItemsQuantity === undefined || noteItemsQuantity.length == 0) {
	  				noteItemsQuantity = [''];
	   			}
	  			if(slCode == ""){
	  				$('.vld-cp').css("display","block");
	  			}
	  			else{
		  			$.ajax({
		  				type : "GET",
		  				url : ACC.config.encodedContextPath + addCopyUrl,
		  				data : {
		  					'productsList' : productsList,'productsQuantity':productsQuantity,'noteItemsList' : noteItemsList,'noteItemsQuantity':noteItemsQuantity,
		  				},
		  				success : function(data) {
		  					var html = $($.parseHTML(data));
		 					$.colorbox({
		 	  		    		  html : html,
		 	  		    		  width : '96%',
		 	  		    		  maxWidth : 700
		 	  		    	  });
		  				},
		  				error : function(data) {
		  					console.log(data);
		  				}
		  			});
	  			}
	  		},
	  		
	  		multipleActionsToExistingList : function (th){
	  			var slCode = $("#shoppingList").val();
	  			var addCopyUrl = '/shopping-list/'+ slCode +'/add-copy-items';
	  			var productsList = new Array();
	  			$('.shoppinglists-itemList-item .chk').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		productsList.push($(this).attr('data-product-code'));
	  		    	}
	  		    });
	  			var productsQuantity = new Array();
	  			$('.shoppinglists-itemList-item .chk').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		productsQuantity.push($(this).attr('data-qty'));
	  		    	}
	  		    });
	  			var noteItemsList = new Array();
	  			$('.shoppinglists-itemList-item .chk-N').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		noteItemsList.push($(this).attr('data-noteItem-name'));
	  		    	}
	  		    });
	  			var noteItemsQuantity = new Array();
	  			$('.shoppinglists-itemList-item .chk-N').each(function(){
	  		    	if($(this).is(':checked')){
	  		    		noteItemsQuantity.push($(this).attr('data-qty'));
	  		    	}
	  		    });
	  			
	  			if (productsList === undefined || productsList.length == 0) {
	  				productsList= [''];
	   			}
	  			if (productsQuantity === undefined || productsQuantity.length == 0) {
	  				productsQuantity= [''];
	   			}
	  			if (noteItemsList === undefined || noteItemsList.length == 0) {
	  			   noteItemsList= [''];
	  			}
	  			if (noteItemsQuantity === undefined || noteItemsQuantity.length == 0) {
	  				noteItemsQuantity = [''];
	   			}
	  			
	  			$.ajax({
	  				type : "GET",
	  				url : ACC.config.encodedContextPath + addCopyUrl,
	  				data : {
	  					'productsList' : productsList,'productsQuantity':productsQuantity,'noteItemsList' : noteItemsList,'noteItemsQuantity':noteItemsQuantity,
	  				},
	  				success : function(data) {
	  					var html = $($.parseHTML(data));
	 					$.colorbox({
	 	  		    		  html : html,
	 	  		    		  width : '96%',
	 	  		    		  maxWidth : 700
	 	  		    	  });
	  				},
	  				error : function(data) {
	  					console.log(data);
	  				}
	  			});
	  		},
	  		
	  		selectAllCheckBox:function(th,event){
	  			event.preventDefault();
	  			event.stopPropagation();
	  			var currentBtnStatus = $(th).attr('data-select-all');
	  			if(currentBtnStatus == "0"){
		  		    $('.shoppinglists-itemList .shoppinglists-itemList-item').each(function(){
		  		    	$(this).find('input[type="checkbox"]').prop('checked','checked');
		  		    });

		  		    $(th).attr('data-select-all', '1').text('DESELECT ALL').addClass('select-all-blue');
                    $('.copy-sl').prop('disabled',false);
		  		    $('.sl-addtotrolley').prop('disabled',false);

                    $('.add-to-my-list').removeClass('dsb-list-btn');
                    $('.add-to-trl').removeClass('dsb-list-btn');
		  		    $('.js-remove-selected-items').prop('disabled', false);
		  		    ACC.cartitem.enableSelectItemActionButtons(true);
	  			}
	  			else{
	  				$('.shoppinglists-itemList .shoppinglists-itemList-item').each(function(){
		  		    	$(this).find('input[type="checkbox"]').prop('checked','');
		  		    });
	  				$(th).attr('data-select-all', '0').text('SELECT ALL').removeClass('select-all-blue');
                    $('.js-remove-selected-items').prop('disabled', true);
                    $('.add-to-my-list').addClass('dsb-list-btn');
                    $('.add-to-trl').addClass('dsb-list-btn');
	  				$('.copy-sl').prop('disabled',true);
	  				$('.sl-btn-disable').prop('disabled',true);
	  				var privousTotal=parseFloat($("input[name='totalPriceForItemNotSelected']").val());
	  	    		$('.total-price').find('.price').text("R"+ privousTotal.toFixed(2))
	  	    		ACC.cartitem.enableSelectItemActionButtons(false);
	  			}
	  	  },
	  	  
		  	onCheckBoxClick:function(){
		 		 $('button[data-select-all]').attr('data-select-all', '1').text('SELECT ALL').removeClass('select-all-blue');
                $("input[type='checkbox']").change(function () {
			  	    var total = 0;
			  	    $("input[type='checkbox']:checked").each(function () {
			  	        total += $(this).data("product-price");
			  	      $('button[data-select-all]').attr('data-select-all', '1').text('DESELECT ALL').addClass('select-all-blue');
                    });
			  	   
			  	    if(total > 0)
			  	    	{
			  	    	$('.total-price').find('.price').text("R" + total.toFixed(2));
			  	    	}
			  	    else{
			  	    		var privousTotal=parseFloat($("input[name='totalPriceForItemNotSelected']").val());
			  	    		$('.total-price').find('.price').text("R"+ privousTotal.toFixed(2))
			  	    	}
			  	});
		 	},
		  	
		 	clickCheckBoxForCopyButton:function(){
		 		$("input[type=checkbox]").change(function () {
		  		    if($('.shoppinglists-itemList-item .chk').is(':checked') || $('.shoppinglists-itemList-item .chk-N').is(':checked')){
		  		    		$('.copy-sl').prop('disabled',false);
		  		    		$('.sl-btn-disable').prop('disabled',false);
		  		    	}
		  		    else{
		  		    	$('.copy-sl').prop('disabled',true);
		  		    	$('.sl-btn-disable').prop('disabled',true);
		  		    }
		 		});
		 	},
		 	
		 	collapseSectionOnLoad:function(){
		 		var acc = document.getElementsByClassName("pnp-cart-accordion");
		 		var i;

		 		for (i = 0; i < acc.length; i++) {
		 		    acc[i].onclick = function(){
		 		        this.classList.toggle("active");
		 		        var ele = this.nextElementSibling;
		 		        var panel = ele.nextElementSibling;
		 		        if (panel.style.display === "block") {			
		 		            panel.style.display = "none";
		 		           $('.btn-collapse').attr('data-collapse-all', '1').text('EXPAND ALL');
		 		           $('.order-collapse-all').attr('data-collapse-all', '1').text('EXPAND ALL');
		 		        } else {
		 		            panel.style.display = "block";		 
		 		           $('.btn-collapse').attr('data-collapse-all', '0').text('COLLAPSE ALL');
		 		          $('.order-collapse-all').attr('data-collapse-all', '0').text('COLLAPSE ALL');
		 		        }		 					
		 		    }
		 		}
		 	},
		 	
		 	collapseButton:function(th,event){
	  			event.preventDefault();
	  			event.stopPropagation();
		 		var currentBtnStatus = $(th).attr('data-collapse-all');
	  			if(currentBtnStatus == "0"){
	  				$('.pnp-cart-accordion-panel').hide();
		  		    $(th).attr('data-collapse-all', '1').text('EXPAND ALL').addClass('expand-selected-red');
		  		    $('.pnp-cart-accordion').removeClass('active');
	  			}
	  			else{
	  				$('.pnp-cart-accordion-panel').show();
	  				$(th).attr('data-collapse-all', '0').text('COLLAPSE ALL').removeClass('expand-selected-red');
	  				$('.pnp-cart-accordion').addClass('active');
	  			}
		 	},
		 	
		 	createCategoryList:function(){
		 		var pageCode = $('.product-list').attr('data-page-code');
		 		if(pageCode == undefined || pageCode == null){
                    return;
                }
		 		var slCode = $('.slCode').val();
				if(slCode == undefined || slCode == null){
					return;
				}
		 		var categoryList = new Array();
	  			$('#productList .listPageHeader-short').each(function(){
	  				var categoryName = $(this).find('.pnp-cart-accordion').attr('data-category');
	  				if($(this).find('.pnp-cart-accordion').hasClass('active')){
	  					categoryList.push(categoryName + '|' + 'true');
	  				}
	  		    });
	  			
	  			if (categoryList == undefined || categoryList.length == 0) {
	  				categoryList= [''];
	   			}
	  			$.ajax({
	  				type : "GET",
	  				url : ACC.config.encodedContextPath + '/' + pageCode + '/save-category',
	  				data : {
	  					'categoryList' : categoryList,'slCode' :slCode
	  				},
	  				success : function(data) {
	  					console.log('category list added');
	  				},
	  				error : function(data) {
	  					console.log(data);
	  				}
	  			});
		 	},
		 	
		  	deleteAllProducts:function(th){
		  		var slCode = $(th).closest('.slEntries-delete').attr('data-slCode');
		  		var deleteProductUrl = '/shopping-list/'+ slCode +'/deleteAllProducts';
				$.ajax({
						type : "GET",
						url : ACC.config.encodedContextPath + deleteProductUrl,
						contentType : "application/json; charset=utf-8",
						beforeSend: function(){
							ACC.common.showLoadingSpinner(".slEntries-delete");
						},
						success : function(data) {
							console.log("Deleted products from shopping list");
							window.location = ACC.config.encodedContextPath + '/shopping-list/shopping-list-details/' + slCode;
						},
						error : function(data) {
							console.log(data);
						},
						complete: function () {
                            ACC.common.hideLoadingSpinner(".slEntries-delete");
                        }
				});
		  	},

		  	showProductPopUp:function(html, reloadAfterPopClose){
                var reloadAfterClosePopups = function () {
                    window.location.reload(true);
                };
				$.colorbox({
			    	  html :html,
			          width: '100%',
					  height: '100%',
			          maxWidth: '800px',
			          className: 'productvalidityOverlay',
					  onClosed: (reloadAfterPopClose == true) ? reloadAfterClosePopups: function () {}
			    });
				if($('.section1 ul li').length == 0) {
					$('.section1').fadeOut();
				}
				if($('.section2 ul li').length == 0) {
					$('.section2').fadeOut();
				}
				if($('.section3 ul li').length == 0) {
					$('.section3').fadeOut();
				}
		  	},

		  	getSearchString: function (url) {
                var startIndex = url.indexOf('q');
                var endIndex = url.indexOf('&')
                var searchString = ' ';
                if (startIndex >= 0 && endIndex >=0) {
                    searchString = url.substring(startIndex+2, endIndex);
                }
                searchString = searchString.replace(/%3A/g, ":");
                return searchString;
            },

            getFavouriteProducts : function (searchString, slCode) {
                var url = '/purchased-products/addToList';
                var productsList = new Array();
                $.ajax({
                    type : "GET",
                    url : ACC.config.encodedContextPath + url,
                    data : {
                        'q' : searchString
                    },
                    contentType : "application/json; charset=utf-8",
                    success : function(data) {
                        productsList = data;
                        ACC.shoppinglist.addFavouritesProductsToExistingList(productsList, slCode);
                    },
                    error : function(data) {
                        console.log(data);
                    },
                });
            },

	  		addFavouritesProductsToExistingList : function(productsList, slCode) {
            	var addCopyUrl = '/shopping-list/'+ slCode +'/add-copy-items';
       			var noteItemsList = [''];
                var noteItemsQuantity = [''];
	   			var productsQuantity = new Array();
	   			for (i = 0; i < productsList.length; i++) {
                    productsQuantity.push(1);
                }

	  			$.ajax({
	  				type : "POST",
	  				url : ACC.config.encodedContextPath + addCopyUrl,
	  				data : {
	  					'productsList' : productsList,'productsQuantity':productsQuantity,'noteItemsList' : noteItemsList,'noteItemsQuantity':noteItemsQuantity,
	  				},
	  				success : function(data) {
	  					var html = $($.parseHTML(data));
	 					$.colorbox({
	 	  		    		  html : html,
	 	  		    		  width : '100%',
	 	  		    		  maxWidth : 700,
							onClosed : function() {
	 	  		    		  	ACC.shoppinglist.hideActiveSpinner();
							},
							onCleanup: function () {
								$('#colorbox').css("left","100%");
								$('#colorbox').removeClass('addlist_popup');
								ACC.common.productSelection(false);
							},
	 	  		    	  });
	  				},
	  				error : function(data) {
	  					console.log(data);
	  				}
	  			});
	  		},
	hideActiveSpinner : function() {
		if ($(".add-to-my-list").length > 0 ) {
            ACC.common.hideLoadingSpinner(".add-to-my-list");
		}

		if ($(".fav-add-to-my-list").length > 0 ) {
            ACC.common.hideLoadingSpinner(".fav-add-to-my-list")
        }

        if ($(".js-save-to-shopping-list").length > 0 ) {
            ACC.common.hideLoadingSpinner(".js-save-to-shopping-list");
        }
	}
};


$(".save_name").keypress(function(e) {
	maxLength=$("#slMaxLength").val();
	if(this.text.length >= maxLength)
		{
		e.preventDefault();
		return false;
		}
	if (e.which == 13 || e.which==10) {
		e.preventDefault();
		ACC.shoppinglist.editSlName(this);
		return;
    }
});
$(".save_banner_name").keypress(function(e) {
	maxLength=$("#slMaxLength").val();
	if(this.text.length >= maxLength)
	{
	e.preventDefault();
	return false;
	}
	if (e.which == 13 || e.which==10) {
		e.preventDefault();
		ACC.shoppinglist.editBannerSlName(this);
		return;
    }
});

$(".saveNotes").keypress(function(e) {
	maxLength=$("#slMaxLength").val();
	if(this.text.length >= maxLength)
		{
		e.preventDefault();
		return false;
		}
	if (e.which == 13 || e.which==10) {
		e.preventDefault();
		ACC.shoppinglist.editNoteNameUpdate(this);
		return;
    }
});

// js for selectbox styling

$(document).ready(function(){

	if(ACC.global.isMobileMode()) {
		var sortForm = $('#sortForm1');
		sortForm.insertAfter('#filter-refine');
	}

	$('.sortShoppingList').on('click', function() {
		ACC.shoppinglist.sortShoppingList();
	});
	
	enquire.register("screen and (max-width: 1023px)", {
		   match : function() {
			   $(".mydashboardcomponent #flip").click(function(){
			        $(".mydashboardcomponent #panel").slideToggle("slow");
			    });
			   $('.mydashboardcomponent #panel').css('display','none');
		    
		   },
		   unmatch : function() {
			   $( ".mydashboardcomponent #flip" ).unbind("click");
			   $('.mydashboardcomponent #panel').css('display','block');
		   }
	});
	
	
});


// $(function() {
// 		$('select.custom_select').selectric({
// 			onOpen: function() {
// 				$(".selectric-scroll").niceScroll({
// 					cursorwidth: "8px",
// 					cursorcolor: "#cccccc",
// 					railpadding: {
// 		      top: 5,
// 		      right: 5,
// 		      left: 0,
// 		      bottom: 0
// 		    },
// 		    autohidemode: false,
// 				}).show();
// 			}
// 		});
// });
