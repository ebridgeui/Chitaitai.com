ACC.autocomplete = {

	_autoload: [
		"bindSearchAutocomplete"
	],

	bindSearchAutocomplete: function ()
	{
		// extend the default autocomplete widget, to solve issue on multiple instances of the searchbox component
		$.widget( "custom.yautocomplete", $.ui.autocomplete, {
			_create:function(){
				
				// get instance specific options form the html data attr
				var option = this.element.data("options");
				// set the options to the widget
				this._setOptions({
					minLength: option.minCharactersBeforeRequest,
					displayProductImages: option.displayProductImages,
					delay: option.waitTimeBeforeRequest,
					autocompleteUrl: option.autocompleteUrl,
					source: this.source
				});
				
				// call the _super()
				$.ui.autocomplete.prototype._create.call(this);
				
			},
			options:{
				cache:{}, // init cache per instance
				focus: function (){return false;}, // prevent textfield value replacement on item focus
				select: function (event, ui){
                    window.location.href = ui.item.url;
                }
			},
			_renderItem : function (ul, item){
				if(this.element.data("urlpage")=="shopping")
				{
				var renderHtml = "<div class='name'>" + item.value +"</div>";

				if (item.image != null){
					renderHtml += "<div class='thumb'><img src='" + item.image + "'  /></div>";
				}

				if (item.price != null) {
				    renderHtml += 	"<div class='price'>" + item.price +"</div>";
				}
				if (item.savings != null && item.savings > 0) {
				    renderHtml += 	"<div class='price savings'> " + ACC.searchPageSuggestionsSave + "&nbsp;" + item.savings +"</div>";
				}
				return $("<li>").data("item.autocomplete", item).append(renderHtml).appendTo(ul);
				}
				else
					{
					
					
				if (item.type == "autoSuggestion"){
					var renderHtml = "<a href='"+ item.url + "' ><div class='name'>" + item.value + "</div></a>";
					return $("<li>")
							.data("item.autocomplete", item)
							.append(renderHtml)
							.appendTo(ul);
				}
				else if (item.type == "productResult"){

					var renderHtml = "<a href='" + item.url + "' >";

					if (item.image != null){
						renderHtml += "<div class='thumb'><img src='" + item.image + "'  /></div>";
					}

					renderHtml += 	"<div class='name'>" + item.value +"</div>";
					if (item.price != null) {
					    renderHtml += 	"<div class='price'>" + item.price +"</div>";
					}
					if (item.savings != null && item.savings > 0) {
					    renderHtml += 	"<div class='price savings'> " + ACC.searchPageSuggestionsSave + "&nbsp;" + item.savings +"</div>";
					}
					renderHtml += 	"</a>";

					return $("<li disabled>").data("item.autocomplete", item).append(renderHtml).appendTo(ul);
				}
					}
			},
			source: function (request, response)
			{
				
				var self=this;
				var urlPage=this.element.data("urlpage");
				var slCode=this.element.data("slcode");
				
				var term = request.term.toLowerCase();
				if (term in self.options.cache)
				{
					return response(self.options.cache[term]);
				}

				$.getJSON(self.options.autocompleteUrl, {term: request.term}, function (data)
				{
					var autoSearchData = [];
					if(urlPage== "shopping")
					{
						if(data.products != null){
							$.each(data.products, function (i, obj)
							{
								autoSearchData.push({
									value: obj.name,
									code: obj.code,
									desc: obj.description,
									manufacturer: obj.manufacturer,
									url:  ACC.config.encodedContextPath +"/shopping-list/createNoteItem?noteItemText="+obj.code +"&slCode="+slCode,
									price: obj.price != null ? obj.price.formattedValue : null,
									savings: obj.price != null ? obj.price.savingsFormattedValue : null,
									type: "productResult",
									image: (obj.images!=null && self.options.displayProductImages) ? obj.images[0].url : null // prevent errors if obj.images = null
								});
							});
						}
						
					}
					else
						{
					var autoSearchData = [];
					if(data.suggestions != null){
						$.each(data.suggestions, function (i, obj)
						{
							autoSearchData.push({
								value: obj.term,
								url: ACC.config.encodedContextPath + "/search?text=" + obj.term,
								type: "autoSuggestion"
							});
						});
					}
					if(data.products != null){
						$.each(data.products, function (i, obj)
						{
							autoSearchData.push({
								value: obj.name,
								code: obj.code,
								desc: obj.description,
								manufacturer: obj.manufacturer,
								url:  ACC.config.encodedContextPath + obj.url,
								price: obj.price != null ? obj.price.formattedValue : null,
								savings: obj.price != null ? obj.price.savingsFormattedValue : null,
								type: "productResult",
								image: (obj.images!=null && self.options.displayProductImages) ? obj.images[0].url : null // prevent errors if obj.images = null
							});
						});
					}
						}
					self.options.cache[term] = autoSearchData;
					return response(autoSearchData);
				});
			}

		});

	
		$search = $(".js-site-search-input");
		if($search.length>0){
			$search.yautocomplete()
		}
	}
};