const recyclingPoints = [
  { id:1, name:"Eco Ponto Sorocaba - Parque das Águas", address:"Av. Dom Aguirre, 1000 - Sorocaba, SP", lat:-23.4905, lon:-47.4547 },
  { id:2, name:"Eco Ponto Campinas - Taquaral", address:"Av. Heitor Penteado, 2145 - Campinas, SP", lat:-22.8897, lon:-47.0481 },
  { id:3, name:"Eco Ponto São Paulo - Vila Mariana", address:"Rua Vergueiro, 1000 - São Paulo, SP", lat:-23.5880, lon:-46.6330 },
  { id:4, name:"Eco Ponto Santos - Centro", address:"Av. Conselheiro Nébias, 200 - Santos, SP", lat:-23.9618, lon:-46.3280 },
  { id:5, name:"Eco Ponto São José dos Campos - Centro", address:"Rua XV de Novembro, 400 - São José dos Campos, SP", lat:-23.1896, lon:-45.8841 },
  { id:6, name:"Eco Ponto Ribeirão Preto - Centro", address:"Rua Álvares Cabral, 50 - Ribeirão Preto, SP", lat:-21.1785, lon:-47.8060 }
];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
            Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

document.getElementById("buscarCepBtn").addEventListener("click", async () => {
  const cep = document.getElementById("cepInput").value.replace(/\D/g, "");
  if (cep.length !== 8) {
    alert("Digite um CEP válido!");
    return;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      alert("CEP não encontrado!");
      return;
    }

    const endereco = `${data.logradouro || ""}, ${data.localidade} - ${data.uf}`;
    document.getElementById("cepInfo").innerText = endereco;

    const cidadesLatLon = {
      "São Paulo": { lat:-23.5505, lon:-46.6333 },
      "Sorocaba": { lat:-23.5015, lon:-47.4526 },
      "Campinas": { lat:-22.9056, lon:-47.0608 },
      "Santos": { lat:-23.9608, lon:-46.3336 },
      "São José dos Campos": { lat:-23.1896, lon:-45.8841 },
      "Ribeirão Preto": { lat:-21.1775, lon:-47.8103 }
    };

    let userLatLon = cidadesLatLon[data.localidade] || { lat:-23.5505, lon:-46.6333 };

    const MAX_DISTANCE = 50; // km
    const nearbyPoints = recyclingPoints.filter(p => getDistance(userLatLon.lat, userLatLon.lon, p.lat, p.lon) <= MAX_DISTANCE);

    let content = "";

    if (nearbyPoints.length > 0) {
      nearbyPoints.forEach(p => {
        content += `<strong>${p.name}</strong><br>${p.address}<br><br>`;
      });
    } else {
      // Nenhum ponto próximo: exibe todos
      recyclingPoints.forEach(p => {
        content += `<strong>${p.name}</strong><br>${p.address}<br><br>`;
      });
    }

    document.getElementById("ecoPoint").innerHTML = content;

    const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
    resultModal.show();

  } catch (err) {
    alert("Erro ao consultar o CEP.");
  }
});
