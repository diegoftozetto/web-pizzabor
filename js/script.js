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

	//Adicionar Cliente (Evento)
	$("#form-client").submit(function (e) {
		e.preventDefault();
		addClient();
	});

	//Carregar Clientes
	element = document.getElementById("div-clients");
	if (element) {
		loadListClients();
	}
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

//Carrega Clientes (Listar)
function loadListClients() {
	$.ajax({
		type: "GET",
		dataType: "json",
		contentType: "application/json",
		url: "https://api-pizzabor.herokuapp.com/clients",
		success: function (result) {
			$("#div-clients").html("");
			if (result.length <= 0) {
				$("#div-clients").append("<div class='alert alert-warning' role='alert'>Nenhum Cliente Cadastrado.</div>");
			} else {
				for (key in result) {
					$("#div-clients").append("<div class='card mt-2' id='" + key + "'></div>");

					$("#div-clients #" + key).append("<div class='card-body'></div>");
					$("#div-clients #" + key + " .card-body").append("<p><b>Nome: </b>" + result[key].name + "</p>");
					$("#div-clients #" + key + " .card-body").append("<p><b>Telefone: </b>" + result[key].phone + "</p>");
					$("#div-clients #" + key + " .card-body").append("<p><b>Endereço: </b>" + result[key].address + " (" + result[key].cep + ")" + " | " + result[key].number + " | " + result[key].complement + "</p>");
					$("#div-clients #" + key + " .card-body").append("<p class='p-email'><b>E-mail: </b>" + result[key].email + "</p>");

					$("#div-clients #" + key).append("<div class='card-footer text-muted'></div>");
					$("#div-clients #" + key + " .card-footer").append("<a><button class='btn btn-info btn-sm'>Editar</button></a>");
					$("#div-clients #" + key + " .card-footer").append("<a onClick=\"deleteClient('" + result[key]._id + "');\"><button class='btn btn-danger btn-sm ml-2'>Remover</button></a>");
				}
			}
		}
	});
}