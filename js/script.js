$(document).ready(function () {
	$("#tab-options a").click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	//Adicionar Cliente (Evento)
	$("#form-client").submit(function (e) {
		e.preventDefault();
		addClient();
	});
});

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
	}
}