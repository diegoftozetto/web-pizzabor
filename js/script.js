$(document).ready(function () {
	$("#tab-options a").click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	// Produtos
	$("#form-product").submit(function (e) {
		e.preventDefault();
		var me = $(this);
		addProduct(me.attr('action'), me.attr('method'), me.serializeArray());
	});

	var element = document.getElementById("div-products");
	if (element) {
		listProducts();
	}

	//Adicionar Cliente (Evento)
	$("#form-client").submit(function (e) {
		e.preventDefault();
		addClient();
	});
});

///
/// Produtos
///

// Adicionar Produto
function addProduct(action, method, data) {
	var dataJson = {}, flag = true;

	data.forEach(element => {
		if (element.name != 'url') {
			if (!element.value || typeof element.value == undefined || element.value == null) {
				flag = false;
				return;
			}
		}
		dataJson[element.name] = element.value;
	});

	if (!flag) {
		alert("Falha ao processar requisição. Parâmetros Inválidos.");
	} else {
		$.ajax({
			type: method,
			data: JSON.stringify(dataJson),
			dataType: "json",
			contentType: "application/json",
			url: action,
			success: (result) => {
				alert(result.message);

				//Limpar elementos do form
				$("#form-product input, #form-product textarea").val('');
				$("#form-product select").prop('selectedIndex', 0);

				listProducts();
			},
			error: (result) => {
				switch (result.status) {
					case 0:
						alert("Falha ao processar requisição. Erro na Conexão.");
						break;
					default:
						alert(result.responseJSON.message);
						break;
				}
			}
		});
	}
}

// Listar Produtos (Admin)
function listProducts() {
	$.ajax({
		type: "GET",
		dataType: "json",
		contentType: "application/json",
		url: "https://api-pizzabor.herokuapp.com/products",
		success: function (result) {
			$("#div-products").html("");
			if (result.length > 0) {
				var currentCategorie = null;
				result.forEach((element, index) => {
					// Titulo da categoria
					if (element.categorie != currentCategorie) {
						currentCategorie = element.categorie;
						$("#div-products").append("<div class='alert alert-secondary mt-4' role='alert'><h4 class='alert-heading'>" + currentCategorie + "</h4></div>");
					}

					// Card
					$("#div-products").append("<div class='card mt-2' id='" + index + "'></div>");
					// Titulo do card
					$("#div-products" + " #" + index).append("<h5 class='card-header'>" + element.name + "</h5>"); 
					//Corpo do card
					$("#div-products" + " #" + index).append("<div class='card-body'></div>");

					if (element.url)
						$("#div-products" + " #" + index + " .card-body").append("<img src='" + element.url + "' alt='Imagem do Produto' id='img-pizza' class='img-thumbnail rounded float-left mr-4'>");
					else
						$("#div-products" + " #" + index + " .card-body").append("<img src='../../img/logo-pizzabor.png' alt='Imagem do Produto' id='img-pizza' class='img-thumbnail rounded float-left mr-4'>");

					$("#div-products" + " #" + index + " .card-body").append("<p><b>Descrição: </b>" + element.description + "</p>");

					if (element.categorie == "Pizza Salgada" || element.categorie == "Pizza Doce")
						$("#div-products" + " #" + index + " .card-body").append("<p><b>Preço:</b> Broto - R$" + (element.price * 12).toFixed(2) + " | Média - R$" + (element.price * 18).toFixed(2) + " | Grande - R$" + (element.price * 24).toFixed(2) + " | Família - R$" + (element.price * 32).toFixed(2) + "</p>");
					else if (element.categorie == "Calzone")
						$("#div-products" + " #" + index + " .card-body").append("<p><b>Preço:</b> Média - R$" + (element.price * 22).toFixed(2) + " | Grande - R$" + (element.price * 31).toFixed(2) + "</p>");
					else
						$("#div-products" + " #" + index + " .card-body").append("<p><b>Preço:</b> R$ " + element.price + "</p>");

					//Rodape do card
					$("#div-products" + " #" + index).append("<div class='card-footer text-muted'></div>");
					$("#div-products" + " #" + index + " .card-footer").append("<a><button class='btn btn-info btn-sm'>Editar</button></a>");
					$("#div-products" + " #" + index + " .card-footer").append("<a onClick=\"deleteProduct('" + element._id + "');\"><button class='btn btn-danger btn-sm ml-2'>Remover</button></a>");
				});
			} else {
				$("#div-products").append("<div class='alert alert-warning' role='alert'>Nenhum Produto Cadastrado.</div>");
			}
		},
		error: function (result) {
			$("#div-products").html("");
			switch (result.status) {
				case 0:
					$("#div-products").append("<div class='alert alert-danger' role='alert'>Falha ao processar requisição. Erro na Conexão.</div>");
					break;
				default:
					$("#div-products").append("<div class='alert alert-danger' role='alert'>" + result.responseJSON.message + "</div>");
					break;
			}
		}
	});	
}

///
/// Clientes
///

//Adionar Cliente
function addClient() {
	var json = {};

	json['name'] = $("#name").val();
	json['email'] = $("#email").val();
	json['phone'] = $("#phone").val();
	json['cep'] = $("#cep").val();
	json['address'] = $("#address").val();

	var isValid = true;
	for (key in json) {
		if (!json[key] || typeof json[key] == undefined || json[key] == null) {
			isValid = false;
		}
	}

	json['number'] = parseInt($("#number").val());

	if (!Number.isInteger(json['number'])) {
		isValid = false;
	}

	json['complement'] = $("#complement").val();

	if (!isValid) {
		alert("Falha ao processar requisição. Parâmetros Inválidos.");
	} else {
		alert("Cliente Adicionado.");
		$.ajax({
			type: "POST",
			data: JSON.stringify(json),
			dataType: "json",
			contentType: "application/json",
			url: "https://api-pizzabor.herokuapp.com/clients/",
			success: function (result) {
				alert(result.message);

				//Limpa elementos do form
				$("#form-client input").val('');

				//Carrega lista de clientes
				loadListClients();
			},
			error: function (result) {
				if (result.status == 0) {
					alert("Falha ao processar requisição. Erro na Conexão.");
				} else {
					alert(result.responseJSON.message);
				}
			}
		});
	}
}